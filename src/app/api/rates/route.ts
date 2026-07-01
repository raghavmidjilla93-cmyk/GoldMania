/**
 * Gold Rate API — Hyderabad / AP / Telangana
 *
 * Priority order:
 *  1. dpgold.com   — live AP/Telangana retail rates (port 7768 — may be blocked on Vercel)
 *  2. goodreturns.in  — Hyderabad retail rates (HTML scrape)
 *  3. IBJA           — India Bullion & Jewellers Association wholesale rates (+retail premium)
 *  4. goldapi.io     — international spot × Indian duty multiplier (needs GOLDAPI_KEY env)
 *
 * When the admin sets a manual rate via /admin, the frontend uses that directly
 * and this API is only used as the baseline "live" fallback.
 *
 * Response shape:
 * {
 *   updatedAt: string,
 *   city: string,
 *   source: string,
 *   sourceWarning?: string,   // set when using a wholesale/fallback source
 *   prices:    { gold: [{purity, amount}], silver: [{purity, amount}] },
 *   prevPrices?: { gold: [{purity, amount}], silver: [{purity, amount}] } | null
 * }
 *
 * All gold amounts = per 10 grams (₹).
 * Silver amount   = per kg (₹).
 * The frontend divides gold by 10 to display per-gram.
 */

const OZ_TO_GRAM = 31.1034768;

let cache: { result: unknown; ts: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function r2(n: number) { return Math.round(n); }

function parseAmount(s: string): number {
  return parseFloat(s.replace(/[,\s₹]/g, ""));
}

// ── SOURCE 1: dpgold.com ──────────────────────────────────────────────────────
// API: statewisebcast.dpgold.in:7768 (tab-separated streaming data)
//
// Actual row names seen on dpgold.com (June 2026):
//   "GOLD IMPORTED 999"    → 14801.0  (per gram)
//   "SILVER 30 KG PAN India" → 236649 (per kg for 30kg bars)
//   "SILVER 1 KG Bar"        → 239649 (per kg for 1kg bars)
//   "GOLD SPOT"              → 4093.60 (USD/oz — skip)
//   "USDINR"                 → 95.27   (skip)
//
// Gold values: per-gram range ~5,000–35,000 ₹/g (detect automatically)
// Silver values: per-kg range ~50,000–500,000 ₹/kg
async function scrapeDPGold(): Promise<{
  gold24PerGram: number;
  gold22PerGram: number;
  gold18PerGram: number;
  silverPerKg: number;
} | null> {
  try {
    const res = await fetch(
      "https://statewisebcast.dpgold.in:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/dpgold",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Referer":    "https://www.dpgold.com/",
          "Accept":     "text/plain, */*",
        },
        signal: AbortSignal.timeout(8_000),
      }
    );
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trim().length < 10) return null;

    // Candidates: we may find multiple rows per purity — last one wins (most recent)
    let gold24PerGram = 0;
    let gold22PerGram = 0;
    let gold18PerGram = 0;
    let silverPerKg   = 0;

    // Convert a dpgold value to per-gram:
    // If 5,000–35,000  → already per gram
    // If 50,000–350,000 → per 10g → divide by 10
    // Anything else → ignore (spot USD prices, etc.)
    function toPerGram(v: number): number {
      if (v > 5_000  && v < 35_000)  return v;
      if (v > 50_000 && v < 350_000) return v / 10;
      return 0;
    }

    for (const line of text.split("\n")) {
      const cols = line.split("\t").map(s => s.trim());
      const name = (cols[2] ?? "").toLowerCase();
      const val  = parseFloat(cols[3] ?? "0");
      if (!isFinite(val) || val <= 0) continue;

      const isGold   = name.includes("gold");
      const isSilver = name.includes("silver");

      // Skip USD spot prices and USDINR (values < 5000 or named "spot"/"usd"/"inr")
      if (name.includes("spot") || name.includes("usd") || name.includes("inr")) continue;
      if (name.includes("mcx")  || name.includes("future"))  continue;

      if (isGold) {
        if (name.includes("999") || name.includes("24k") || name.includes("imported")) {
          const pg = toPerGram(val);
          if (pg > 0) gold24PerGram = pg;
        } else if (name.includes("916") || name.includes("22k")) {
          const pg = toPerGram(val);
          if (pg > 0) gold22PerGram = pg;
        } else if (name.includes("750") || name.includes("18k")) {
          const pg = toPerGram(val);
          if (pg > 0) gold18PerGram = pg;
        }
      }

      if (isSilver) {
        // Per-kg silver: 50,000–500,000 ₹/kg range
        // Prefer "1 kg bar" over bulk "30 kg" rate for retail accuracy
        if (val > 50_000 && val < 500_000) {
          // If it's a 1kg bar row, it takes priority
          if (name.includes("1 kg") || name.includes("1kg")) {
            silverPerKg = val;          // definitive — stop looking
          } else if (silverPerKg === 0) {
            silverPerKg = val;          // use as fallback until we find 1kg rate
          }
        }
      }
    }

    if (gold24PerGram > 5_000) {
      return { gold24PerGram, gold22PerGram, gold18PerGram, silverPerKg };
    }
    return null;
  } catch {
    return null;
  }
}

// ── SOURCE 2: goodreturns.in — Hyderabad retail ───────────────────────────────
async function scrapeGoodReturns(): Promise<{
  gold24: number; gold22: number; gold18: number; silver: number;
} | null> {
  try {
    const res = await fetch(
      "https://www.goodreturns.in/gold-rates-in-hyderabad.html",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-IN,en;q=0.9",
        },
        signal: AbortSignal.timeout(10_000),
      }
    );
    if (!res.ok) return null;
    const html = await res.text();

    // Try to find "24 Carat" and "22 Carat" specifically
    const g24m = html.match(/24\s*[Cc]arat[^₹\d]{0,40}₹?\s*([\d,]{5,8})/);
    const g22m = html.match(/22\s*[Cc]arat[^₹\d]{0,40}₹?\s*([\d,]{5,8})/);
    const g18m = html.match(/18\s*[Cc]arat[^₹\d]{0,40}₹?\s*([\d,]{5,8})/);

    if (g24m && g22m) {
      const gold24 = parseAmount(g24m[1]);
      const gold22 = parseAmount(g22m[1]);
      const gold18 = g18m ? parseAmount(g18m[1]) : r2(gold24 * 18/24);

      // goodreturns shows per-10g; validate realistic ranges
      if (gold24 > 60_000 && gold24 < 500_000 && gold22 > 50_000) {
        // Also try to grab silver per kg
        const silm = html.match(/[Ss]ilver[^₹\d]{0,30}₹?\s*([\d,]{5,8})/);
        const silver = silm ? parseAmount(silm[1]) : 0;
        return { gold24, gold22, gold18, silver: silver > 50_000 ? silver : 0 };
      }
    }

    // Fallback: pick two largest ₹ amounts in 10g range
    const amts: number[] = [];
    const amtRx = /₹\s*([\d,]+)/g;
    let m: RegExpExecArray | null;
    while ((m = amtRx.exec(html)) !== null) {
      const v = parseAmount(m[1]);
      if (v >= 60_000 && v <= 500_000) amts.push(v);
    }
    if (amts.length >= 2) {
      const sorted = [...new Set(amts)].sort((a, b) => b - a);
      const gold24 = sorted[0];
      const gold22 = sorted[1];
      if (gold24 > 80_000 && gold22 > 70_000 && gold24 > gold22) {
        return { gold24, gold22, gold18: r2(gold24 * 18/24), silver: 0 };
      }
    }
    return null;
  } catch {
    return null;
  }
}

// ── SOURCE 3: ibjarates.com — wholesale (we add retail premium) ───────────────
type IBJARates = {
  gold24: number; gold22: number; gold18: number; gold750: number; silver: number;
};

async function scrapeIBJA(): Promise<{ today: IBJARates; prevDay: IBJARates | null } | null> {
  try {
    const res = await fetch("https://www.ibjarates.com/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    function extractAfterLabel(label: string): number {
      const rx = new RegExp(label + "[^\\d]{0,20}([\\d,]{5,9})", "i");
      const m = html.match(rx);
      if (!m) return 0;
      const v = parseAmount(m[1]);
      return v > 50_000 && v < 600_000 ? v : 0;
    }

    const gold999  = extractAfterLabel("Gold 999");
    const gold916  = extractAfterLabel("Gold 916");
    const gold750  = extractAfterLabel("Gold 750");
    const silver999 = extractAfterLabel("Silver 999");

    if (!(gold999 > 100_000 && gold916 > 80_000)) return null;

    const today: IBJARates = {
      gold24: gold999,
      gold22: gold916,
      gold18: gold750 > 0 ? gold750 : r2(gold999 * 18/24),
      gold750,
      silver: silver999,
    };

    // Previous-day from history table
    let prevDay: IBJARates | null = null;
    try {
      const prevRx = /(\d{2}\/\d{2}\/\d{4})[^\d]+([\d,]+)[^\d]+([\d,]+)[^\d]+([\d,]+)[^\d]+([\d,]+)[^\d]+([\d,]+)[^\d]+([\d,]+)/g;
      const rows: IBJARates[] = [];
      let m2: RegExpExecArray | null;
      while ((m2 = prevRx.exec(html)) !== null) {
        const g999  = parseAmount(m2[2]);
        const g916  = parseAmount(m2[4]);
        const g750  = parseAmount(m2[5]);
        const silv  = parseAmount(m2[7]);
        if (g999 > 100_000 && g916 > 80_000) {
          rows.push({ gold24: g999, gold22: g916, gold18: g750 || r2(g999*18/24), gold750: g750, silver: silv > 50_000 ? silv : 0 });
        }
      }
      if (rows.length > 0) prevDay = rows[rows.length - 1];
    } catch { /* non-critical */ }

    return { today, prevDay };
  } catch {
    return null;
  }
}

// ── SOURCE 4: goldapi.io (last resort) ───────────────────────────────────────
async function fetchGoldAPI(metal: "XAU" | "XAG") {
  const key = process.env.GOLDAPI_KEY;
  if (!key) throw new Error("Missing GOLDAPI_KEY");
  const res = await fetch(`https://www.goldapi.io/api/${metal}/INR`, {
    headers: { "x-access-token": key },
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "GoldAPI failed");
  return data;
}

async function getFallbackRates() {
  // Post July-2024 duty cut: BCD 6% + AIDC 5% + SWS 0.5% + GST 3% + dealer margin ≈ ×1.18
  // Verified: GOLD SPOT $4093.60, USDINR 95.27 → spot ₹12,544/g; dpgold 999 = ₹14,801/g → ratio 1.1800
  const goldMult   = Number(process.env.HYD_GOLD_MULTIPLIER   ?? 1.18);
  const silverMult = Number(process.env.HYD_SILVER_MULTIPLIER ?? 1.30); // silver has higher duty %
  const [gold, silver] = await Promise.all([fetchGoldAPI("XAU"), fetchGoldAPI("XAG")]);
  const spotGold10g  = (gold.price   / OZ_TO_GRAM) * 10;
  const gold24 = r2(spotGold10g * goldMult);
  return {
    gold24,
    gold22: r2(gold24 * 22/24),
    gold18: r2(gold24 * 18/24),
    silver: r2((silver.price / OZ_TO_GRAM) * 1000 * silverMult),
  };
}

// ── MAIN HANDLER ──────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const now = Date.now();
    if (cache && now - cache.ts < CACHE_TTL) {
      return Response.json({ ...(cache.result as object), cached: true });
    }

    type Rates = { gold24: number; gold22: number; gold18: number; silver: number };
    let rates: Rates | null = null;
    let prevRates: IBJARates | null = null;
    let source = "goldapi.io (fallback)";
    let sourceWarning: string | undefined;

    // Retail premium env vars — used when IBJA/goodreturns wholesale source is active
    const retailPremium = Number(process.env.RETAIL_PREMIUM ?? 0); // ₹ per 10g additive

    // ── 1. dpgold.com (AP/Telangana live retail) ──────────────────────────────
    const dpg = await scrapeDPGold();
    if (dpg && dpg.gold24PerGram > 5_000) {
      const g24 = r2(dpg.gold24PerGram * 10);
      // Use direct API values for 22K/18K if available, else compute from 24K purity ratio
      const g22 = dpg.gold22PerGram > 0 ? r2(dpg.gold22PerGram * 10) : r2(g24 * 22/24);
      const g18 = dpg.gold18PerGram > 0 ? r2(dpg.gold18PerGram * 10) : r2(g24 * 18/24);
      rates = { gold24: g24, gold22: g22, gold18: g18, silver: dpg.silverPerKg || 0 };
      source = "dpgold.com (live retail — Gold Imported 999)";
      // Get prev-day from IBJA in background
      const ibjaExtra = await scrapeIBJA();
      if (ibjaExtra?.prevDay) prevRates = ibjaExtra.prevDay;
    }

    // ── 2. goodreturns.in (Hyderabad retail) ─────────────────────────────────
    if (!rates) {
      const gr = await scrapeGoodReturns();
      if (gr && gr.gold24 > 80_000) {
        rates = {
          gold24: r2(gr.gold24 + retailPremium),
          gold22: r2(gr.gold22 + retailPremium),
          gold18: r2(gr.gold18 + retailPremium),
          silver: gr.silver > 0 ? gr.silver : 0,
        };
        source = "goodreturns.in (Hyderabad retail)";
        const ibjaExtra = await scrapeIBJA();
        if (ibjaExtra?.prevDay) prevRates = ibjaExtra.prevDay;
      }
    }

    // ── 3. IBJA (wholesale — add retail premium) ──────────────────────────────
    if (!rates) {
      const ibja = await scrapeIBJA();
      if (ibja && ibja.today.gold24 > 100_000) {
        // IBJA is wholesale. Indian retail = IBJA + ~3% GST + local dealer margin (~1-2%)
        // Default IBJA_RETAIL_MARKUP = 3 (%) — adjust via env var if needed
        const ibjaMarkup = Number(process.env.IBJA_RETAIL_MARKUP ?? 3) / 100;
        rates = {
          gold24: r2(ibja.today.gold24 * (1 + ibjaMarkup) + retailPremium),
          gold22: r2(ibja.today.gold22 * (1 + ibjaMarkup) + retailPremium),
          gold18: r2(ibja.today.gold18 * (1 + ibjaMarkup) + retailPremium),
          silver: ibja.today.silver > 0 ? r2(ibja.today.silver * (1 + ibjaMarkup)) : 0,
        };
        if (ibja.prevDay) prevRates = ibja.prevDay;
        source = "IBJA (India Bullion & Jewellers Association)";
        sourceWarning = "Wholesale rate with estimated retail markup applied. For exact AP rates, check dpgold.com and use Admin → Rate Override.";
      }
    }

    // ── 4. goldapi.io (last resort) ───────────────────────────────────────────
    if (!rates) {
      try {
        rates = await getFallbackRates();
        source = "goldapi.io (spot × Indian retail multiplier)";
        sourceWarning = "International spot price with duty multiplier. For exact AP rates, use Admin → Rate Override.";
      } catch {
        return Response.json({ error: "All rate sources unavailable. Use Admin → Rate Override to set rates manually." }, { status: 503 });
      }
    }

    const silverAmt     = rates.silver > 0 ? rates.silver : r2(rates.gold24 * 0.0165);
    const prevSilverAmt = prevRates?.silver && prevRates.silver > 0 ? prevRates.silver : 0;

    const result = {
      updatedAt: new Date().toISOString(),
      city: "Hyderabad",
      source,
      ...(sourceWarning ? { sourceWarning } : {}),
      prices: {
        gold: [
          { purity: "24K", amount: rates.gold24 },
          { purity: "22K", amount: rates.gold22 },
          { purity: "18K", amount: rates.gold18 },
        ],
        silver: [{ purity: "999", amount: silverAmt }],
      },
      prevPrices: prevRates ? {
        gold: [
          { purity: "24K", amount: prevRates.gold24 },
          { purity: "22K", amount: prevRates.gold22 },
          { purity: "18K", amount: prevRates.gold18 },
        ],
        silver: [{ purity: "999", amount: prevSilverAmt }],
      } : null,
    };

    cache = { result, ts: now };
    return Response.json({ ...result, cached: false });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
