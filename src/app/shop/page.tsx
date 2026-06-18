"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/siteConfig";

const G = "linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)";
const wa = siteConfig.whatsapp.replace(/\D/g, "");

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

type CartEntry = { item: Item; qty: number };

function formatINR(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

const PURITY_RATIO: Record<Purity, number> = { "24K": 1, "22K": 22 / 24, "18K": 18 / 24 };

function defaultItems(): Item[] {
  return [
    { id: "g1", name: "Temple Necklace", metal: "Gold", purity: "22K", weightGrams: 28, wastagePercent: 3 },
    { id: "g2", name: "Bridal Bangles Set (2pcs)", metal: "Gold", purity: "22K", weightGrams: 40, wastagePercent: 3 },
    { id: "g3", name: "Jhumkis", metal: "Gold", purity: "22K", weightGrams: 8, wastagePercent: 3 },
    { id: "g4", name: "Gold Chain 24K", metal: "Gold", purity: "24K", weightGrams: 10, wastagePercent: 1 },
    { id: "g5", name: "Diamond-Cut Ring", metal: "Gold", purity: "18K", weightGrams: 5, wastagePercent: 4 },
    { id: "s1", name: "Silver Anklets", metal: "Silver", weightGrams: 50, wastagePercent: 2 },
  ];
}

export default function ShopPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"All" | "Gold" | "Silver">("All");
  const [gold24_10g, setGold24_10g] = useState(0);
  const [silverPerKg, setSilverPerKg] = useState(0);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load items + rates from localStorage / API
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Items
    try {
      const raw = localStorage.getItem("items");
      setItems(raw ? JSON.parse(raw) : defaultItems());
    } catch { setItems(defaultItems()); }

    // Rates: prefer manual override, else fetch from API
    function applyRates() {
      try {
        const m = JSON.parse(localStorage.getItem("manualRates") ?? "{}");
        if (m?.gold24_10g > 0) {
          setGold24_10g(m.gold24_10g);
          if (m.silver999_1kg > 0) setSilverPerKg(m.silver999_1kg);
          return;
        }
      } catch {}
      // fetch live rate
      fetch("/api/rates", { cache: "no-store" })
        .then(r => r.json())
        .then(data => {
          const g24 = data?.prices?.gold?.find((r: any) => r.purity === "24K")?.amount ?? 0;
          const sil = data?.prices?.silver?.[0]?.amount ?? 0;
          if (g24 > 0) setGold24_10g(g24);
          if (sil > 0) setSilverPerKg(sil); // per kg from API
        })
        .catch(() => {});
    }

    applyRates();

    const onUpdate = () => {
      try {
        const raw = localStorage.getItem("items");
        setItems(raw ? JSON.parse(raw) : defaultItems());
      } catch {}
      applyRates();
    };
    window.addEventListener("items-updated", onUpdate);
    window.addEventListener("rates-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("items-updated", onUpdate);
      window.removeEventListener("rates-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const visible = useMemo(() =>
    items.filter(it => filter === "All" || it.metal === filter),
    [items, filter]
  );

  function priceFor(it: Item): number {
    if (it.metal === "Gold") {
      if (!gold24_10g) return 0;
      const ratio = PURITY_RATIO[it.purity ?? "22K"];
      const perGram = (gold24_10g / 10) * ratio;
      return perGram * it.weightGrams * (1 + (it.wastagePercent ?? 0) / 100);
    }
    if (it.metal === "Silver") {
      if (!silverPerKg) return 0;
      const perGram = silverPerKg / 1000;
      return perGram * it.weightGrams * (1 + (it.wastagePercent ?? 0) / 100);
    }
    return 0;
  }

  // Cart helpers
  function addToCart(item: Item) {
    setCart(prev => {
      const existing = prev.find(e => e.item.id === item.id);
      if (existing) return prev.map(e => e.item.id === item.id ? { ...e, qty: e.qty + 1 } : e);
      return [...prev, { item, qty: 1 }];
    });
    setCartOpen(true);
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(e => e.item.id !== id));
  }

  function changeQty(id: string, delta: number) {
    setCart(prev =>
      prev.map(e => e.item.id === id ? { ...e, qty: Math.max(1, e.qty + delta) } : e)
        .filter(e => e.qty > 0)
    );
  }

  const cartTotal = cart.reduce((sum, e) => sum + priceFor(e.item) * e.qty, 0);
  const cartCount = cart.reduce((sum, e) => sum + e.qty, 0);

  function whatsappEnquiry() {
    const lines = cart.map(e => {
      const price = priceFor(e.item);
      const pLabel = e.item.purity ? ` (${e.item.purity})` : "";
      return `• ${e.item.name}${pLabel} × ${e.qty} — ${price > 0 ? formatINR(Math.round(price * e.qty)) : "Price TBD"}`;
    });
    const msg = `Hi Gold Mania,\n\nI'm interested in the following items:\n\n${lines.join("\n")}\n\nTotal: ${formatINR(Math.round(cartTotal))}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const purityColor: Record<string, string> = {
    "24K": "#D4AF37", "22K": "#C9A84C", "18K": "#B8A080",
  };

  return (
    <>
      <Header />

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .cart-btn-add:hover { opacity:.88; transform:translateY(-1px); }
        .shop-card:hover { border-color:rgba(212,175,55,0.28) !important; }
        .shop-card:hover .shop-card-img { transform:scale(1.04); }
      `}</style>

      {/* Cart backdrop */}
      {cartOpen && (
        <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 400, backdropFilter: "blur(3px)" }} />
      )}

      {/* Cart drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100%", width: "min(400px,95vw)",
        background: "#0c0c0a", borderLeft: "1px solid rgba(212,175,55,0.15)",
        zIndex: 500, display: "flex", flexDirection: "column",
        transform: cartOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "system-ui,sans-serif",
      }}>
        {/* Drawer header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "var(--font-playfair,Georgia,serif)", fontSize: 16, fontWeight: 700, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Enquiry Basket</div>
            <div style={{ fontSize: 10, color: "#6B5C3A", marginTop: 2 }}>{cartCount} {cartCount === 1 ? "item" : "items"}</div>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: "transparent", border: "none", color: "#6B5C3A", fontSize: 20, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>✕</button>
        </div>

        {/* Drawer body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#4a3e28" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>◆</div>
              <div style={{ fontSize: 13, fontStyle: "italic" }}>Your basket is empty</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.map(({ item, qty }) => {
                const price = priceFor(item);
                return (
                  <div key={item.id} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "rgba(212,175,55,0.04)", borderRadius: 10, border: "1px solid rgba(212,175,55,0.09)" }}>
                    <div style={{ width: 54, height: 54, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(212,175,55,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 18, opacity: 0.25, color: "#D4AF37" }}>◆</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e8dfc8", marginBottom: 2 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "#6B5C3A" }}>{item.purity ?? item.metal} · {item.weightGrams}g</div>
                      {price > 0 && <div style={{ fontSize: 13, fontWeight: 700, color: "#D4AF37", marginTop: 4 }}>{formatINR(Math.round(price * qty))}</div>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: "transparent", border: "none", color: "#4a3e28", cursor: "pointer", fontSize: 12, padding: "2px 6px" }}>✕</button>
                      <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid rgba(212,175,55,0.15)", borderRadius: 6, overflow: "hidden" }}>
                        <button onClick={() => changeQty(item.id, -1)} style={{ background: "transparent", border: "none", color: "#D4AF37", cursor: "pointer", padding: "3px 9px", fontSize: 14 }}>−</button>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#e8dfc8", padding: "0 4px", minWidth: 20, textAlign: "center" }}>{qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} style={{ background: "transparent", border: "none", color: "#D4AF37", cursor: "pointer", padding: "3px 9px", fontSize: 14 }}>+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer footer */}
        {cart.length > 0 && (
          <div style={{ padding: "16px 20px 24px", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B5C3A" }}>Estimated Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#D4AF37" }}>{formatINR(Math.round(cartTotal))}</span>
            </div>
            <div style={{ fontSize: 9, color: "#4a3e28", marginBottom: 12, lineHeight: 1.5 }}>
              Prices exclude making charges & GST. Final price confirmed at showroom.
            </div>
            <button onClick={whatsappEnquiry} style={{ width: "100%", background: "linear-gradient(135deg,#128C7E,#25D366)", color: "#fff", border: "none", borderRadius: 999, padding: "13px 20px", fontWeight: 800, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
              ◆ Enquire on WhatsApp
            </button>
            <button onClick={() => setCart([])} style={{ width: "100%", marginTop: 8, background: "transparent", border: "none", color: "#4a3e28", fontSize: 10, cursor: "pointer", padding: "6px", letterSpacing: "0.08em" }}>
              Clear basket
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ background: "#050503", minHeight: "100vh", fontFamily: "system-ui,sans-serif" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 18px 80px" }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B5C3A", marginBottom: 4 }}>Handpicked For You</div>
              <div style={{ fontFamily: "var(--font-playfair,Georgia,serif)", fontSize: 26, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Our Collection</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link href="/" style={{ fontSize: 10, color: "#6B5C3A", textDecoration: "none", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 999, padding: "7px 14px" }}>
                ← Home
              </Link>
              {/* Cart button */}
              <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 999, color: "#D4AF37", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                ◆ Basket
                {cartCount > 0 && (
                  <span style={{ background: G, color: "#0a0806", fontSize: 10, fontWeight: 800, borderRadius: 999, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{cartCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Live rate info bar */}
          {gold24_10g > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {[
                { label: "24K / 1g", val: gold24_10g / 10 },
                { label: "22K / 1g", val: gold24_10g / 10 * 22 / 24 },
                { label: "18K / 1g", val: gold24_10g / 10 * 18 / 24 },
              ].map(r => (
                <div key={r.label} style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.12)", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B5C3A" }}>{r.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#D4AF37" }}>{formatINR(Math.round(r.val))}</span>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {(["All", "Gold", "Silver"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? G : "transparent",
                color: filter === f ? "#0a0806" : "#6B5C3A",
                border: `1px solid ${filter === f ? "transparent" : "rgba(212,175,55,0.2)"}`,
                borderRadius: 999, padding: "7px 18px",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "all 0.2s",
              }}>{f}</button>
            ))}
          </div>

          {/* Product grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gap: 18 }}>
            {visible.map(it => {
              const price = priceFor(it);
              const pColor = it.purity ? purityColor[it.purity] : "#A0A0A0";
              const inCart = cart.some(e => e.item.id === it.id);
              return (
                <div key={it.id} className="shop-card" style={{ background: "linear-gradient(160deg,#161409,#0c0c0a)", borderRadius: 14, border: "1px solid rgba(212,175,55,0.1)", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.25s" }}>
                  {/* Image */}
                  <div style={{ height: 210, overflow: "hidden", position: "relative", background: "rgba(212,175,55,0.04)" }}>
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="shop-card-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                        <span style={{ fontSize: 44, opacity: 0.12, color: "#D4AF37" }}>◆</span>
                        <span style={{ fontSize: 9, color: "#4a3e28", letterSpacing: "0.14em", textTransform: "uppercase" }}>Photo Coming Soon</span>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(5,5,3,0.65),transparent 55%)", pointerEvents: "none" }} />
                    {/* Purity badge */}
                    {(it.purity || it.metal === "Silver") && (
                      <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(5,5,3,0.78)", border: `1px solid ${pColor}40`, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: pColor }}>
                        {it.purity ?? "SILVER"} · {it.metal.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontFamily: "var(--font-playfair,Georgia,serif)", fontSize: 15, fontWeight: 700, color: "#C9A84C", lineHeight: 1.3 }}>{it.name}</div>
                    <div style={{ fontSize: 10, color: "#5C5040" }}>
                      {it.weightGrams}g{it.wastagePercent ? ` · ${it.wastagePercent}% wastage` : ""}
                    </div>

                    {/* Price */}
                    <div style={{ marginTop: 4 }}>
                      {price > 0 ? (
                        <>
                          <div style={{ fontSize: 19, fontWeight: 800, color: "#D4AF37", fontFamily: "system-ui,sans-serif" }}>{formatINR(Math.round(price))}</div>
                          <div style={{ fontSize: 9, color: "#4a3e28", marginTop: 1 }}>excl. GST & making charges</div>
                        </>
                      ) : (
                        <div style={{ fontSize: 12, color: "#4a3e28", fontStyle: "italic" }}>Price on enquiry</div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 10 }}>
                      <button
                        className="cart-btn-add"
                        onClick={() => addToCart(it)}
                        style={{
                          flex: 1, background: inCart ? "rgba(212,175,55,0.12)" : G,
                          color: inCart ? "#D4AF37" : "#0a0806",
                          border: inCart ? "1px solid rgba(212,175,55,0.3)" : "none",
                          borderRadius: 999, padding: "10px 0",
                          fontWeight: 800, fontSize: 11, letterSpacing: "0.1em",
                          textTransform: "uppercase", cursor: "pointer",
                          transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                      >
                        {inCart ? "✓ Added" : "◆ Add to Basket"}
                      </button>
                      <a
                        href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi Gold Mania, I'm interested in "${it.name}"${it.purity ? ` (${it.purity})` : ""} — ${it.weightGrams}g.${price > 0 ? ` Approx. ${formatINR(Math.round(price))}.` : ""} Please share details.`)}`}
                        target="_blank" rel="noreferrer"
                        style={{ width: 40, height: 40, borderRadius: 999, background: "linear-gradient(135deg,#128C7E,#25D366)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16, flexShrink: 0 }}
                        title="WhatsApp"
                      >
                        💬
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#4a3e28" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" }}>No products in this category</div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}

const purityColor: Record<string, string> = {
  "24K": "#D4AF37", "22K": "#C9A84C", "18K": "#B8A080",
};
