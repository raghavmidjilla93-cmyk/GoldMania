const OZ_TO_GRAM = 31.1034768;

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchGoldAPI(metal: "XAU" | "XAG") {
  const key = process.env.GOLDAPI_KEY;
  if (!key) throw new Error("Missing GOLDAPI_KEY in .env.local");

  const url = `https://www.goldapi.io/api/${metal}/INR`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-access-token": key,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 * 60 * 24 }, // 1/day
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GoldAPI failed ${res.status}: ${text}`);
  }

  return res.json();
}

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function GET() {
  try {
    const goldMult = Number(process.env.HYD_GOLD_MULTIPLIER ?? "1.08");
    const silverMult = Number(process.env.HYD_SILVER_MULTIPLIER ?? "1.06");

    if (!Number.isFinite(goldMult) || goldMult <= 0) throw new Error("HYD_GOLD_MULTIPLIER invalid");
    if (!Number.isFinite(silverMult) || silverMult <= 0) throw new Error("HYD_SILVER_MULTIPLIER invalid");

    // Fetch Gold then Silver (avoid 429)
    const gold = await fetchGoldAPI("XAU");
    await sleep(1100);
    const silver = await fetchGoldAPI("XAG");

    // GoldAPI returns INR per troy ounce → convert to INR per gram
    const goldSpotPerGram = gold.price / OZ_TO_GRAM;
    const silverSpotPerGram = silver.price / OZ_TO_GRAM;

    // Apply Hyderabad retail multipliers
    const goldRetailPerGram24 = goldSpotPerGram * goldMult;
    const goldRetailPerGram22 = goldRetailPerGram24 * (22 / 24);
    const goldRetailPerGram18 = goldRetailPerGram24 * (18 / 24);

    const silverRetailPerGram = silverSpotPerGram * silverMult;

    // Units you requested
    const gold24_10g = goldRetailPerGram24 * 10;
    const gold22_10g = goldRetailPerGram22 * 10;
    const gold18_10g = goldRetailPerGram18 * 10;

    const silver_1kg = silverRetailPerGram * 1000;

    return Response.json({
      updatedAt: new Date().toISOString(),
      city: "Hyderabad",
      note: "Hyderabad Retail (Approx.)",
      units: {
        gold: "₹ per 10 grams",
        silver: "₹ per 1 kg",
      },
      prices: {
        gold: [
          { purity: "Spot", amount: r2(goldSpotPerGram * 10) },
          { purity: "24K", amount: r2(gold24_10g) },
          { purity: "22K", amount: r2(gold22_10g) },
          { purity: "18K", amount: r2(gold18_10g) },
        ],
        silver: [{ purity: "999", amount: r2(silver_1kg) }],
      },
    });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
