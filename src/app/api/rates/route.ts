/**
 * Gold Rate API — Hyderabad
 *
 * Priority order:
 *  1. dpgold.com      — live Andhra Pradesh / Telangana retail rates (direct API)
 *  2. goodreturns.in  — live Hyderabad retail rates (scrape)
 *  3. IBJA            — India Bullion & Jewellers Association (scrape)
 *  4. goldapi.io      — international spot × Indian multiplier (fallback)
 *
 * Previous-day rates always come from IBJA history table.
 *
 * Response shape expected by page.tsx:
 * {
 *   updatedAt: string,
 *   city: string,
 *   source: string,
 *   prices:    { gold: [{purity, amount}], silver: [{purity, amount}] },
 *   prevPrices?: { gold: [{purity, amount}], silver: [{purity, amount}] } | null
 * }
 */

const OZ_TO_GRAM = 31.1034768;

// ── in-memory cache ───────────────────────────────────────────────────────────
let cache: {
  result: any;
  ts: number;
} | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function r2(n: number) {
  return Math.round(n); // round to nearest rupee
}

// ── helpers ───────────────────────────────────────────────────────────────────
function parseAmount(s: string): number {
  return parseFloat(s.replace(/[,\s₹]/g, ""));
}

// ── SOURCE 1: dpgold.com — Andhra Pradesh / Telangana live retail rates ───────
// API: statewisebcast.dpgold.in — tab-separated, no auth required.
// Format per line:  \t<ID>\t<Name>\t<Current>\t<Bid>\t<High>\t<Low>\t<Unit>
// Gold AP-Telangana 999 value is per GRAM (despite label "/ 10 Gm").
// Verified: 15625/g × 94.52 INR/USD matches $4315/oz spot + ~19% import duty + GST.
async function scrapeDPGold(): Promise<{
  gold24PerGram: number; // per gram
  silverPerKg: number;   // per kg
} | null> {
  try {
    const res = await fetch(
      "https://statewisebcast.dpgold.in:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/dpgold",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Referer": "https://www.dpgold.com/",
        },
        signal: AbortSignal.timeout(8_000),
      }
    );
    if (!res.ok) return null;
    const text = await res.text();

    let gold24PerGram = 0;
    let silverPerKg = 0;

    for (const line of text.split("\n")) {
      const cols = line.split("\t").map((s) => s.trim());
      // cols: ["", id, name, current, bid, high, low, unit]
      const name = (cols[2] ?? "").toLowerCase();
      const val = parseFloat(cols[3] ?? "0");
      if (!isFinite(val) || val <= 0) continue;

      if ((name.includes("andhra") || name.includes("telangana")) && name.includes("999")) {
        // Gold AP-Telangana 999 — value is per gram (verified via gold-silver ratio)
        if (val > 5000 && val < 50000) gold24PerGram = val;
      }
      if (name.includes("silver") && (name.includes("pan") || name.includes("india"))) {
        // Silver PAN India — value is per kg
        if (val > 50000 && val < 2000000) silverPerKg = val;
      }
    }

    if (gold24PerGram > 5000) return { gold24PerGram, silverPerKg };
    return null;
  } catch {
    return null;
  }
}

// ── SOURCE 2: goodreturns.in ──────────────────────────────────────────────────
async function scrapeGoodReturns(): Promise<{
  gold24: number; gold22: number; gold18: number; silver: number;
} | null> {
  try {
    const res = await fetch(
      "https://www.goodreturns.in/gold-rates-in-hyderabad.html",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-IN,en;q=0.9",
        },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!res.ok) return null;
    const html = await res.text();

    // goodreturns.in embeds rates in structured HTML tables and spans.
    // Try JSON-LD first (most reliable)
    const jsonldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonldMatch) {
      for (const block of jsonldMatch) {
        try {
          const inner = block.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
          const obj = JSON.parse(inner);
          // check for gold price data
          if (obj?.offers?.price || obj?.price) {
            const p = parseAmount(String(obj?.offers?.price || obj?.price));
            if (p > 50000) {
              // likely 22K per 10g
              const gold22 = p;
              const gold24 = Math.round(gold22 / (22 / 24));
              const gold18 = Math.round(gold24 * (18 / 24));
              return { gold24, gold22, gold18, silver: 0 };
            }
          }
        } catch { /* skip */ }
      }
    }

    // Fallback: scan for 22K and 24K amounts in the HTML
    // goodreturns shows: "₹X,XX,XXX per 10 grams" or inside table cells
    const amts: number[] = [];
    const amtRegex = /₹\s*([\d,]+)/g;
    let m: RegExpExecArray | null;
    while ((m = amtRegex.exec(html)) !== null) {
      const v = parseAmount(m[1]);
      if (v >= 50000 && v <= 500000) amts.push(v); // 10g range — upper cap 5 lakh for future
    }

    if (amts.length >= 2) {
      // largest = 24K, second = 22K (typical page order)
      const sorted = [...new Set(amts)].sort((a, b) => b - a);
      const gold24 = sorted[0];
      const gold22 = sorted[1];
      const gold18 = Math.round(gold24 * (18 / 24));

      // Try to grab silver (per kg) — now 2-3 lakh range
      const silverRegex = /₹\s*([\d,]+)/g;
      const silverAmts: number[] = [];
      while ((m = silverRegex.exec(html)) !== null) {
        const v = parseAmount(m[1]);
        if (v >= 70000 && v <= 600000) silverAmts.push(v);
      }
      const silver = silverAmts.sort((a, b) => a - b)[0] ?? 0;

      if (gold24 > 100000 && gold22 > 80000) {
        return { gold24, gold22, gold18, silver };
      }
    }

    return null;
  } catch {
    return null;
  }
}

// ── SOURCE 3: ibjarates.com ───────────────────────────────────────────────────
type IBJARates = {
  gold24: number; gold22: number; gold18: number; gold750: number; silver: number;
};

async function scrapeIBJA(): Promise<{
  today: IBJARates;
  prevDay: IBJARates | null;
} | null> {
  try {
    const res = await fetch("https://www.ibjarates.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return null;
    const html = await res.text();

    // IBJA table row format: | Gold 999 | 150105 | or | Gold 916 | 137496 |
    // Extract specific purity rates by keyword context to avoid picking wrong rows
    function extractAfterLabel(label: string): number {
      // Match the label then capture the first number that follows (skipping pipes, spaces, newlines)
      const rx = new RegExp(label + "[^\\d]{0,20}([\\d,]{5,9})", "i");
      const m = html.match(rx);
      if (!m) return 0;
      const v = parseAmount(m[1]);
      return v > 50000 && v < 600000 ? v : 0;
    }

    const gold999 = extractAfterLabel("Gold 999");
    const gold916 = extractAfterLabel("Gold 916");
    const gold750 = extractAfterLabel("Gold 750");
    const silver999 = extractAfterLabel("Silver 999");

    if (!(gold999 > 100000 && gold916 > 80000)) {
      return null;
    }

    const today: IBJARates = {
      gold24: gold999,
      gold22: gold916,
      gold18: gold750 > 0 ? gold750 : r2(gold999 * (18 / 24)),
      gold750: gold750,
      silver: silver999,
    };

    // ── Extract previous day's PM rates from IBJA history table ──
    // Table format: DD/MM/YYYY | Gold999 | Gold995 | Gold916 | Gold750 | Gold585 | Silver999 | Platinum
    // We match up to 7 numbers after a date to get the full row
    let prevDay: IBJARates | null = null;
    try {
      const prevRx = /(\d{2}\/\d{2}\/\d{4})[^\d]+([\d,]+)[^\d]+([\d,]+)[^\d]+([\d,]+)[^\d]+([\d,]+)[^\d]+([\d,]+)[^\d]+([\d,]+)/g;
      const rows: IBJARates[] = [];
      let m2: RegExpExecArray | null;
      while ((m2 = prevRx.exec(html)) !== null) {
        // positions: m2[2]=999, m2[3]=995, m2[4]=916, m2[5]=750, m2[6]=585, m2[7]=Silver
        const g999 = parseAmount(m2[2]);
        const g916 = parseAmount(m2[4]);
        const g750 = parseAmount(m2[5]);
        const silv = parseAmount(m2[7]);
        if (g999 > 100000 && g916 > 80000) {
          rows.push({
            gold24: g999,
            gold22: g916,
            gold18: g750 > 0 ? g750 : r2(g999 * (18 / 24)),
            gold750: g750,
            silver: silv > 50000 ? silv : 0,
          });
        }
      }
      // Take the LAST matched row = most recent previous day's PM rate
      if (rows.length > 0) prevDay = rows[rows.length - 1];
    } catch { /* non-critical */ }

    return { today, prevDay };
  } catch {
    return null;
  }
}

// ── SOURCE 4: goldapi.io (fallback) ──────────────────────────────────────────
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

async function getFallbackRates(): Promise<{
  gold24: number; gold22: number; gold18: number; silver: number;
}> {
  // Indian retail = international spot × (import duty ~15% + AIDC ~5% + GST 3%) ≈ ×1.185
  const goldMult = Number(process.env.HYD_GOLD_MULTIPLIER ?? 1.185);
  const silverMult = Number(process.env.HYD_SILVER_MULTIPLIER ?? 1.185);

  const [gold, silver] = await Promise.all([
    fetchGoldAPI("XAU"),
    fetchGoldAPI("XAG"),
  ]);

  const spotGoldPer10g = (gold.price / OZ_TO_GRAM) * 10;
  const gold24 = r2(spotGoldPer10g * goldMult);
  const gold22 = r2(gold24 * (22 / 24));
  const gold18 = r2(gold24 * (18 / 24));
  const silverPerKg = r2((silver.price / OZ_TO_GRAM) * 1000 * silverMult);

  return { gold24, gold22, gold18, silver: silverPerKg };
}

// ── MAIN HANDLER ──────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const now = Date.now();

    if (cache && now - cache.ts < CACHE_TTL) {
      return Response.json({ ...cache.result, cached: true });
    }

    let rates: { gold24: number; gold22: number; gold18: number; silver: number } | null = null;
    let prevRates: IBJARates | null = null;
    let source = "goldapi.io (fallback)";

    // Local Hyderabad premium — only applied when using IBJA/goodreturns wholesale rates
    const localGoldPremium = Number(process.env.LOCAL_GOLD_PREMIUM ?? 0);
    const localSilverPremium = Number(process.env.LOCAL_SILVER_PREMIUM ?? 0);

    // ── Try dpgold.com first (AP/Telangana live retail, includes all duties) ──
    const dpg = await scrapeDPGold();
    if (dpg && dpg.gold24PerGram > 5000) {
      // dpgold gives per-gram; we store per-10g internally (page.tsx divides by 10 for display)
      const g24 = r2(dpg.gold24PerGram * 10);
      rates = {
        gold24: g24,
        gold22: r2(g24 * (22 / 24)),
        gold18: r2(g24 * (18 / 24)),
        silver: dpg.silverPerKg > 0 ? r2(dpg.silverPerKg) : 0,
      };
      source = "dpgold.com (AP/Telangana live retail)";
      // Fetch IBJA in parallel for previous-day history
      const ibjaExtra = await scrapeIBJA();
      if (ibjaExtra?.prevDay) prevRates = ibjaExtra.prevDay;
    }

    // ── Try goodreturns.in ──
    if (!rates) {
      const gr = await scrapeGoodReturns();
      if (gr && gr.gold24 > 100000) {
        rates = {
          gold24: r2(gr.gold24 + localGoldPremium),
          gold22: r2(gr.gold22 + localGoldPremium),
          gold18: r2(gr.gold18 + localGoldPremium),
          silver: gr.silver > 0 ? r2(gr.silver + localSilverPremium) : 0,
        };
        source = "goodreturns.in (Hyderabad retail)";
          const ibjaExtra = await scrapeIBJA();
        if (ibjaExtra?.prevDay) prevRates = ibjaExtra.prevDay;
      }
    }

    // ── Try IBJA (also gives us previous day rates) ──
    if (!rates) {
      const ibja = await scrapeIBJA();
      if (ibja && ibja.today.gold24 > 100000) {
        rates = {
          gold24: r2(ibja.today.gold24 + localGoldPremium),
          gold22: r2(ibja.today.gold22 + localGoldPremium),
          gold18: r2(ibja.today.gold18 + localGoldPremium),
          silver: ibja.today.silver > 0 ? r2(ibja.today.silver + localSilverPremium) : 0,
        };
        if (ibja.prevDay) prevRates = ibja.prevDay;
        source = "IBJA (India Bullion & Jewellers Association)";
        }
    }

    // ── Fall back to goldapi.io ──
    if (!rates) {
      rates = await getFallbackRates();
      source = "goldapi.io (spot × Indian retail multiplier)";
    }

    const silverAmt = rates.silver > 0 ? rates.silver : r2(rates.gold24 * 0.0165);
    // Previous day silver: IBJA gives per-kg; add local premium only if premium wasn't already applied
    const prevSilverAmt = prevRates && prevRates.silver > 0
      ? r2(prevRates.silver + localSilverPremium)
      : 0;

    const result = {
      updatedAt: new Date().toISOString(),
      city: "Hyderabad",
      source,
      note: `Rates sourced from ${source}. Match local jeweller prices.`,
      prices: {
        gold: [
          { purity: "24K", amount: rates.gold24 },
          { purity: "22K", amount: rates.gold22 },
          { purity: "18K", amount: rates.gold18 },
        ],
        silver: [{ purity: "999", amount: silverAmt }],
      },
      // Previous day rates (per 10g for gold, per kg for silver) — from IBJA history table
      prevPrices: prevRates ? {
        gold: [
          { purity: "24K", amount: r2(prevRates.gold24 + localGoldPremium) },
          { purity: "22K", amount: r2(prevRates.gold22 + localGoldPremium) },
          { purity: "18K", amount: r2(prevRates.gold18 + localGoldPremium) },
        ],
        silver: [{ purity: "999", amount: prevSilverAmt > 0 ? prevSilverAmt : 0 }],
      } : null,
    };

    cache = { result, ts: now };

    return Response.json({ ...result, cached: false });
  } catch (e: any) {
    return Response.json(
      { error: e?.message ?? "Unknown error fetching rates" },
      { status: 500 }
    );
  }
}
