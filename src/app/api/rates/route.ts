/**
 * Gold Rate API — Hyderabad
 *
 * Priority order:
 *  1. goodreturns.in  — live Hyderabad retail rates (scrape)
 *  2. IBJA            — India Bullion & Jewellers Association (scrape)
 *  3. goldapi.io      — international spot × Indian multiplier (fallback)
 *
 * Response shape expected by page.tsx:
 * {
 *   updatedAt: string,
 *   city: string,
 *   source: string,
 *   prices: {
 *     gold:   [{purity, amount}],
 *     silver: [{purity, amount}]
 *   }
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

// ── SOURCE 1: goodreturns.in ──────────────────────────────────────────────────
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
 