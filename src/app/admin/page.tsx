"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const G = "linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)";

type Purity = "24K" | "22K" | "18K";

type Item = {
  id: string;
  name: string;
  metal: "Gold" | "Silver";
  purity?: Purity;
  weightGrams: number;
  image?: string;
  wastagePercent?: number;
};

type ManualRates = {
  gold24_10g: number;
  gold22_10g: number;
  gold18_10g: number;
  silver999_1kg: number;
};

function readItems(): Item[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("items") ?? "[]"); } catch { return []; }
}

function readManualRates(): ManualRates | null {
  if (typeof window === "undefined") return null;
  try {
    const p = JSON.parse(localStorage.getItem("manualRates") ?? "{}") as ManualRates;
    if (p && Number.isFinite(p.gold24_10g) && p.gold24_10g > 0) return p;
  } catch {}
  return null;
}

function formatINR(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: 8,
  color: "#e8dfc8",
  padding: "10px 14px",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "system-ui,sans-serif",
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#6B5C3A",
  marginBottom: 5,
  display: "block",
};

const sectionStyle: React.CSSProperties = {
  background: "linear-gradient(160deg,#161409,#0c0c0a)",
  border: "1px solid rgba(212,175,55,0.12)",
  borderRadius: 14,
  padding: "24px 22px",
  marginBottom: 18,
};

const btnGold: React.CSSProperties = {
  background: G,
  color: "#0a0806",
  border: "none",
  borderRadius: 999,
  padding: "10px 22px",
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminUser] = useState("admin");
  const [adminPass] = useState("admin");

  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  // Manual rates — only 24K input; 22K/18K auto-derived
  const [gold24Input, setGold24Input] = useState("");
  const [silverInput, setSilverInput] = useState("");
  const [manualRates, setManualRates] = useState<ManualRates | null>(null);
  const [rateSaved, setRateSaved] = useState(false);

  // Add item form
  const [form, setForm] = useState({ name: "", metal: "Gold" as "Gold" | "Silver", purity: "22K" as Purity, weight: "", wastage: "3" });
  const [preview, setPreview] = useState<string | undefined>();
  const [itemSaved, setItemSaved] = useState(false);
  const [itemError, setItemError] = useState("");

  const ADMIN_SECRET = "admin123"; // must match ADMIN_SECRET env var on Vercel

  async function loadItems() {
    try {
      const res = await fetch("/api/items", { cache: "no-store" });
      setItems(await res.json());
    } catch { /* keep current */ }
    finally { setItemsLoading(false); }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    loadItems();
    const m = readManualRates();
    if (m) {
      setManualRates(m);
      setGold24Input(String(m.gold24_10g));
      setSilverInput(m.silver999_1kg > 0 ? String(m.silver999_1kg) : "");
    }
  }, []);

  // Derived rates from 24K input
  const g24 = Number(gold24Input) || 0;
  const g22 = g24 > 0 ? Math.round(g24 * 22 / 24) : 0;
  const g18 = g24 > 0 ? Math.round(g24 * 18 / 24) : 0;

  function login() {
    if (username === adminUser && password === adminPass) setLoggedIn(true);
    else alert("Wrong credentials");
  }

  function saveRates() {
    if (!g24) return alert("Enter a valid 24K rate");
    const next: ManualRates = {
      gold24_10g: g24,
      gold22_10g: g22,
      gold18_10g: g18,
      silver999_1kg: Number(silverInput) || 0,
    };
    localStorage.setItem("manualRates", JSON.stringify(next));
    setManualRates(next);
    window.dispatchEvent(new Event("rates-updated"));
    setRateSaved(true);
    setTimeout(() => setRateSaved(false), 2000);
  }

  function clearRates() {
    localStorage.removeItem("manualRates");
    setManualRates(null);
    setGold24Input("");
    setSilverInput("");
    window.dispatchEvent(new Event("rates-updated"));
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { alert("Images only (jpg, png, webp)"); return; }
    // Resize to max 800px before storing
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      const maxW = 800;
      const scale = img.width > maxW ? maxW / img.width : 1;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      setPreview(canvas.toDataURL("image/jpeg", 0.82));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  async function addItem() {
    if (!form.name.trim()) return alert("Enter item name");
    if (!Number(form.weight) || Number(form.weight) <= 0) return alert("Enter valid weight");
    const it: Item = {
      id: Date.now().toString(),
      name: form.name.trim(),
      metal: form.metal,
      purity: form.metal === "Gold" ? form.purity : undefined,
      weightGrams: Number(form.weight),
      image: preview,
      wastagePercent: Number(form.wastage) || 0,
    };
    setItemError("");
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
        body: JSON.stringify(it),
      });
      if (!res.ok) {
        const err = await res.json();
        setItemError(err.error ?? "Failed to save");
        return;
      }
      setItems(prev => [it, ...prev]);
      setForm({ name: "", metal: "Gold", purity: "22K", weight: "", wastage: "3" });
      setPreview(undefined);
      setItemSaved(true);
      setTimeout(() => setItemSaved(false), 2500);
    } catch {
      setItemError("Network error — check connection");
    }
  }

  async function deleteItem(id: string) {
    try {
      await fetch("/api/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
        body: JSON.stringify({ id }),
      });
      setItems(prev => prev.filter(i => i.id !== id));
    } catch { /* silently retry */ }
  }

  function priceFor(it: Item): number {
    if (it.metal !== "Gold" || !g24) return 0;
    const ratio = it.purity === "22K" ? 22/24 : it.purity === "18K" ? 18/24 : 1;
    const perGram = (g24 / 10) * ratio;
    return perGram * it.weightGrams * (1 + (it.wastagePercent ?? 0) / 100);
  }

  return (
    <>
      <Header />

      <div style={{ background: "#050503", minHeight: "100vh", fontFamily: "system-ui,sans-serif", padding: "0 0 60px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 18px 0" }}>

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B5C3A", marginBottom: 4 }}>Admin Panel</div>
              <div style={{ fontFamily: "var(--font-playfair,Georgia,serif)", fontSize: 22, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Gold Mania
              </div>
            </div>
            <Link href="/" style={{ color: "#6B5C3A", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 999, padding: "8px 16px" }}>
              ← Home
            </Link>
          </div>

          {!loggedIn ? (
            <div style={sectionStyle}>
              <div style={{ fontSize: 13, color: "#6B5C3A", marginBottom: 18 }}>Enter your credentials to access the admin panel.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
                <div>
                  <label style={labelStyle}>Username</label>
                  <input style={inputStyle} placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
                </div>
                <button style={{ ...btnGold, marginTop: 6 }} onClick={login}>Sign In</button>
              </div>
            </div>
          ) : (
            <>
              {/* ── RATE OVERRIDE ── */}
              <div style={sectionStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ fontFamily: "var(--font-playfair,Georgia,serif)", fontSize: 15, fontWeight: 700, color: "#C9A84C" }}>Rate Override</div>
                  {manualRates && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(212,175,55,0.15)", color: "#D4AF37", padding: "3px 10px", borderRadius: 999 }}>Active</span>}
                </div>

                <div style={{ fontSize: 11, color: "#5C5040", marginBottom: 16, lineHeight: 1.6 }}>
                  Enter the 24K rate per 10g. 22K and 18K are auto-calculated from purity percentage.
                </div>

                {/* 24K input */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>24K Gold — ₹ per 10g</label>
                    <input style={inputStyle} type="number" placeholder="e.g. 156250" value={gold24Input}
                      onChange={e => setGold24Input(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Silver 999 — ₹ per kg</label>
                    <input style={inputStyle} type="number" placeholder="e.g. 256949" value={silverInput}
                      onChange={e => setSilverInput(e.target.value)} />
                  </div>
                </div>

                {/* Auto-computed preview */}
                {g24 > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
                    {[
                      { label: "24K / 10g", val: g24, sub: "99.9%" },
                      { label: "22K / 10g", val: g22, sub: "91.6% (auto)" },
                      { label: "18K / 10g", val: g18, sub: "75% (auto)" },
                    ].map(r => (
                      <div key={r.label} style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.12)", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B5C3A", marginBottom: 4 }}>{r.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#D4AF37" }}>{formatINR(r.val)}</div>
                        <div style={{ fontSize: 9, color: "#4a3e28", marginTop: 2 }}>{r.sub}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={btnGold} onClick={saveRates}>
                    {rateSaved ? "✓ Saved!" : "Save Rates"}
                  </button>
                  {manualRates && (
                    <button onClick={clearRates} style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 999, color: "#6B5C3A", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 18px", cursor: "pointer" }}>
                      Clear Override
                    </button>
                  )}
                </div>
              </div>

              {/* ── ADD ITEM ── */}
              <div style={sectionStyle}>
                <div style={{ fontFamily: "var(--font-playfair,Georgia,serif)", fontSize: 15, fontWeight: 700, color: "#C9A84C", marginBottom: 18 }}>Add Product</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Product Name</label>
                    <input style={inputStyle} placeholder="e.g. Temple Necklace" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>

                  <div>
                    <label style={labelStyle}>Metal</label>
                    <select style={inputStyle} value={form.metal} onChange={e => setForm({ ...form, metal: e.target.value as "Gold" | "Silver" })}>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                    </select>
                  </div>

                  {form.metal === "Gold" && (
                    <div>
                      <label style={labelStyle}>Purity</label>
                      <select style={inputStyle} value={form.purity} onChange={e => setForm({ ...form, purity: e.target.value as Purity })}>
                        <option value="24K">24K (99.9%)</option>
                        <option value="22K">22K (91.6%)</option>
                        <option value="18K">18K (75%)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label style={labelStyle}>Weight (grams)</label>
                    <input style={inputStyle} type="number" placeholder="e.g. 12.5" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
                  </div>

                  <div>
                    <label style={labelStyle}>Wastage %</label>
                    <input style={inputStyle} type="number" placeholder="3" value={form.wastage} onChange={e => setForm({ ...form, wastage: e.target.value })} />
                  </div>
                </div>

                {/* Photo upload */}
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Product Photo</label>
                  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <span style={{ background: "rgba(212,175,55,0.08)", border: "1px dashed rgba(212,175,55,0.25)", borderRadius: 10, padding: "10px 18px", fontSize: 11, color: "#6B5C3A", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      ◆ Choose Photo
                    </span>
                    {preview && <img src={preview} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(212,175,55,0.2)" }} />}
                    <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
                  </label>
                </div>

                {/* Estimated price preview */}
                {form.name && Number(form.weight) > 0 && g24 > 0 && form.metal === "Gold" && (
                  <div style={{ marginTop: 14, padding: "12px 16px", background: "rgba(212,175,55,0.06)", borderRadius: 10, border: "1px solid rgba(212,175,55,0.12)" }}>
                    <div style={{ fontSize: 10, color: "#6B5C3A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Estimated Price</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#D4AF37" }}>
                      {formatINR(Math.round((g24 / 10) * (form.purity === "22K" ? 22/24 : form.purity === "18K" ? 18/24 : 1) * Number(form.weight) * (1 + Number(form.wastage) / 100)))}
                    </div>
                    <div style={{ fontSize: 9, color: "#4a3e28", marginTop: 2 }}>{form.purity} · {form.weight}g · {form.wastage}% wastage</div>
                  </div>
                )}

                <button style={{ ...btnGold, marginTop: 16 }} onClick={addItem}>
                  {itemSaved ? "✓ Saved — visible to all!" : "Add Product"}
                </button>
                {itemError && <div style={{ marginTop: 10, color: "#ef5350", fontSize: 12 }}>{itemError}</div>}
              </div>

              {/* ── ITEMS LIST ── */}
              <div style={sectionStyle}>
                <div style={{ fontFamily: "var(--font-playfair,Georgia,serif)", fontSize: 15, fontWeight: 700, color: "#C9A84C", marginBottom: 18 }}>
                  Products ({itemsLoading ? "…" : items.length})
                </div>

                {itemsLoading ? (
                  <div style={{ color: "#4a3e28", fontSize: 12, textAlign: "center", padding: "20px 0", fontStyle: "italic" }}>Loading…</div>
                ) : items.length === 0 ? (
                  <div style={{ color: "#4a3e28", fontSize: 13, fontStyle: "italic", textAlign: "center", padding: "24px 0" }}>No products added yet.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {items.map(it => (
                      <div key={it.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(212,175,55,0.08)" }}>
                        {/* Image */}
                        <div style={{ flexShrink: 0, width: 60, height: 60, borderRadius: 8, overflow: "hidden", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {it.image
                            ? <img src={it.image} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span style={{ fontSize: 20, opacity: 0.3 }}>◆</span>
                          }
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: "#e8dfc8", fontSize: 13, marginBottom: 2 }}>{it.name}</div>
                          <div style={{ fontSize: 10, color: "#6B5C3A" }}>{it.metal}{it.purity ? ` · ${it.purity}` : ""} · {it.weightGrams}g{it.wastagePercent ? ` · ${it.wastagePercent}% wastage` : ""}</div>
                          {priceFor(it) > 0 && (
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#D4AF37", marginTop: 3 }}>{formatINR(Math.round(priceFor(it)))}</div>
                          )}
                        </div>
                        {/* Delete */}
                        <button onClick={() => deleteItem(it.id)} style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.12)", borderRadius: 8, color: "#6B5C3A", cursor: "pointer", padding: "6px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
}
