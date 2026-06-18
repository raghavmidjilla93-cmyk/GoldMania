/**
 * Items API — product storage via Vercel Blob (JSON file)
 *
 * GET    /api/items  → returns all products (public)
 * POST   /api/items  → add a product      (requires x-admin-secret header)
 * DELETE /api/items  → remove by id       (requires x-admin-secret header)
 *
 * Setup (one-time in Vercel dashboard):
 *   Storage → Blob → Create Store → Connect to project
 *   Vercel adds BLOB_READ_WRITE_TOKEN automatically.
 *
 * Before Blob is set up: returns default seed items so the shop still works.
 */

import { put, list, del } from "@vercel/blob";

export type Purity = "24K" | "22K" | "18K";

export type Item = {
  id: string;
  name: string;
  metal: "Gold" | "Silver";
  purity?: Purity;
  weightGrams: number;
  image?: string;       // base64 data URL, compressed ≤ 500px
  wastagePercent?: number;
};

const BLOB_PREFIX   = "goldmania-items";
const ADMIN_SECRET  = process.env.ADMIN_SECRET ?? "admin123";

// Shown before admin adds any real products
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

// ── Blob helpers ─────────────────────────────────────────────────────────────

type BlobStore = { initialized: boolean; items: Item[] };

async function readBlob(): Promise<BlobStore> {
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    if (!blobs.length) return { initialized: false, items: [] };
    // Sort newest-first and take the latest
    const latest = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    return await res.json() as BlobStore;
  } catch {
    return { initialized: false, items: [] };
  }
}

async function writeBlob(store: BlobStore) {
  // Delete old versions then write fresh
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    await Promise.all(blobs.map(b => del(b.url)));
  } catch {}
  await put(
    `${BLOB_PREFIX}-${Date.now()}.json`,
    JSON.stringify(store),
    { access: "public", contentType: "application/json" }
  );
}

function checkAuth(req: Request) {
  return req.headers.get("x-admin-secret") === ADMIN_SECRET;
}

// ── GET — public ─────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const store = await readBlob();
    const items = store.initialized ? store.items : seedItems();
    return Response.json(items, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(seedItems(), { headers: { "Cache-Control": "no-store" } });
  }
}

// ── POST — add item ───────────────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!checkAuth(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const item: Item = await req.json();
    if (!item.id || !item.name) return Response.json({ error: "Missing id or name" }, { status: 400 });

    const store = await readBlob();
    // First real item replaces seed placeholders
    const current = store.initialized ? store.items : [];
    await writeBlob({ initialized: true, items: [item, ...current] });
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

// ── DELETE — remove item ──────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  if (!checkAuth(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    const store = await readBlob();
    await writeBlob({ ...store, items: store.items.filter(i => i.id !== id) });
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
