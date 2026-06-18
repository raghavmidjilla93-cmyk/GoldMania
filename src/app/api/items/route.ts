/**
 * Items API — product storage via Upstash Redis REST API
 *
 * GET    /api/items  → returns all products (public)
 * POST   /api/items  → add a product      (requires x-admin-secret header)
 * DELETE /api/items  → remove by id       (requires x-admin-secret header)
 *
 * Setup (one-time in Vercel dashboard):
 *   Storage → Upstash → Create Redis DB → Connect to project
 *   Vercel automatically adds UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
 *
 * Before Upstash is set up: returns default seed items so the shop still works.
 */

export const runtime = "nodejs";

export type Purity = "24K" | "22K" | "18K";

export type Item = {
  id: string;
  name: string;
  metal: "Gold" | "Silver";
  purity?: Purity;
  weightGrams: number;
  image?: string;          // base64 data URL, compressed
  wastagePercent?: number;
};

const REDIS_KEY    = "gm_items";
const INIT_KEY     = "gm_initialized";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "admin123";
const REDIS_URL    = process.env.UPSTASH_REDIS_REST_URL ?? "";
const REDIS_TOKEN  = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

function hasRedis() {
  return !!(REDIS_URL && REDIS_TOKEN);
}

// ── Upstash REST helpers ──────────────────────────────────────────────────────

async function rGet(key: string): Promise<string | null> {
  if (!hasRedis()) return null;
  try {
    const res = await fetch(`${REDIS_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json() as { result: string | null };
    return data.result ?? null;
  } catch {
    return null;
  }
}

async function rSet(key: string, value: string): Promise<void> {
  if (!hasRedis()) return;
  try {
    await fetch(`${REDIS_URL}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: value,
      cache: "no-store",
    });
  } catch {}
}

// ── Product helpers ───────────────────────────────────────────────────────────

function seedItems(): Item[] {
  return [
    { id: "g1", name: "Temple Necklace",    metal: "Gold",   purity: "22K", weightGrams: 28, wastagePercent: 3 },
    { id: "g2", name: "Bridal Bangles Set", metal: "Gold",   purity: "22K", weightGrams: 40, wastagePercent: 3 },
    { id: "g3", name: "Jhumkis",            metal: "Gold",   purity: "22K", weightGrams:  8, wastagePercent: 3 },
    { id: "g4", name: "Gold Chain 24K",     metal: "Gold",   purity: "24K", weightGrams: 10, wastagePercent: 1 },
    { id: "g5", name: "Diamond-Cut Ring",   metal: "Gold",   purity: "18K", weightGrams:  5, wastagePercent: 4 },
    { id: "s1", name: "Silver Anklets",     metal: "Silver",               weightGrams: 50, wastagePercent: 2 },
  ];
}

async function loadItems(): Promise<{ initialized: boolean; items: Item[] }> {
  if (!hasRedis()) return { initialized: false, items: [] };
  const [rawItems, rawInit] = await Promise.all([rGet(REDIS_KEY), rGet(INIT_KEY)]);
  if (!rawInit || rawInit !== "1" || !rawItems) return { initialized: false, items: [] };
  try {
    return { initialized: true, items: JSON.parse(rawItems) as Item[] };
  } catch {
    return { initialized: false, items: [] };
  }
}

async function saveItems(items: Item[]): Promise<void> {
  await Promise.all([
    rSet(REDIS_KEY,  JSON.stringify(items)),
    rSet(INIT_KEY,   "1"),
  ]);
}

function checkAuth(req: Request) {
  return req.headers.get("x-admin-secret") === ADMIN_SECRET;
}

// ── GET — public ─────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const store = await loadItems();
    const items = store.initialized ? store.items : seedItems();
    return Response.json(items, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(seedItems(), { headers: { "Cache-Control": "no-store" } });
  }
}

// ── POST — add item ───────────────────────────────────────────────────────────

export async function POST(req: Request) {
  if (!checkAuth(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasRedis()) {
    return Response.json(
      { error: "Database not connected. Go to Vercel → Storage → Upstash → Create Redis DB → Connect to project, then redeploy." },
      { status: 503 }
    );
  }
  try {
    const item: Item = await req.json();
    if (!item.id || !item.name) return Response.json({ error: "Missing id or name" }, { status: 400 });

    const store = await loadItems();
    // First real product replaces seed placeholders entirely
    const current = store.initialized ? store.items : [];
    await saveItems([item, ...current]);
    return Response.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}

// ── DELETE — remove item ──────────────────────────────────────────────────────

export async function DELETE(req: Request) {
  if (!checkAuth(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasRedis()) {
    return Response.json(
      { error: "Database not connected." },
      { status: 503 }
    );
  }
  try {
    const { id } = await req.json() as { id: string };
    const store = await loadItems();
    await saveItems(store.items.filter(i => i.id !== id));
    return Response.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
