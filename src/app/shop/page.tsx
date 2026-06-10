"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

type Item = {
  id: string;
  name: string;
  metal: "Gold" | "Silver";
  weightGrams: number;
  image?: string; // data URL
  wastagePercent?: number;
};

function getItems(): Item[] {
  if (typeof window === "undefined") return sampleItems();
  try {
    const raw = localStorage.getItem("items");
    if (!raw) return sampleItems();
    return JSON.parse(raw) as Item[];
  } catch {
    return sampleItems();
  }
}

function readManualRates(): { gold24_10g: number } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("manualRates");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Number.isFinite(parsed.gold24_10g) && parsed.gold24_10g > 0) {
      return { gold24_10g: parsed.gold24_10g };
    }
  } catch {
    return null;
  }
  return null;
}

function sampleItems(): Item[] {
  return [
    { id: "g1", name: "Gold Patteellu (Ankle)", metal: "Gold", weightGrams: 5, wastagePercent: 3 },
    { id: "g2", name: "Jhumkis", metal: "Gold", weightGrams: 8, wastagePercent: 3 },
    { id: "g3", name: "Short Necklace", metal: "Gold", weightGrams: 20, wastagePercent: 3 },
    { id: "g4", name: "Temple Work Necklace", metal: "Gold", weightGrams: 30, wastagePercent: 3 },
    { id: "s1", name: "Silver Anklet", metal: "Silver", weightGrams: 50, wastagePercent: 2 },
  ];
}

export default function ShopPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"All" | "Gold" | "Silver">("All");
  const [goldPrice24_10g, setGoldPrice24_10g] = useState<number>(0);
  const [manualGold24_10g, setManualGold24_10g] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setItems(getItems());
    setGoldPrice24_10g(Number(localStorage.getItem("goldPrice24_10g") ?? 0));
    const manual = readManualRates();
    if (manual) {
      setManualGold24_10g(manual.gold24_10g);
    }

    const handleItemsUpdated = () => setItems(getItems());
    const handleRatesUpdated = () => {
      const manualNext = readManualRates();
      if (manualNext) {
        setManualGold24_10g(manualNext.gold24_10g);
      }
    };
    window.addEventListener("items-updated", handleItemsUpdated);
    window.addEventListener("storage", handleItemsUpdated);
    window.addEventListener("rates-updated", handleRatesUpdated);
    return () => {
      window.removeEventListener("items-updated", handleItemsUpdated);
      window.removeEventListener("storage", handleItemsUpdated);
      window.removeEventListener("rates-updated", handleRatesUpdated);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("goldPrice24_10g", String(goldPrice24_10g));
  }, [goldPrice24_10g]);

  const visible = useMemo(() => {
    return items.filter((it) => (filter === "All" ? true : it.metal === filter));
  }, [items, filter]);

  function priceFor(item: Item) {
    if (item.metal === "Gold") {
      const priceBase = manualGold24_10g && manualGold24_10g > 0 ? manualGold24_10g : goldPrice24_10g;
      const perGram = priceBase > 0 ? priceBase / 10 : 0;
      const w = item.wastagePercent ?? 0;
      return perGram * item.weightGrams * (1 + w / 100);
    }
    // For Silver, we don't have dynamic price; show N/A or 0
    return 0;
  }

  return (
    <>
      <Header />
      <main className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <h1 className="title" style={{ margin: 0 }}>Shop — Designs</h1>
          <Link href="/" className="btn btn-secondary" style={{ padding: "10px 14px" }}>
            Home
          </Link>
        </div>

        <div style={{ marginBottom: 12 }}>
          <button className="btn" onClick={() => setFilter("All")} style={{ marginRight: 8 }}>
            All
          </button>
          <button className="btn" onClick={() => setFilter("Gold")} style={{ marginRight: 8 }}>
            Gold
          </button>
          <button className="btn" onClick={() => setFilter("Silver")}>
            Silver
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ marginRight: 8 }}>Gold 24K Price (₹ per 10g):</label>
          <input
            className="input"
            type="number"
            value={goldPrice24_10g || ""}
            onChange={(e) => setGoldPrice24_10g(Number(e.target.value))}
            placeholder="Enter gold price 24K per 10g"
          />
        </div>

        <div className="grid">
          {visible.map((it) => (
            <div key={it.id} className="card" style={{ padding: 12 }}>
              {it.image ? (
                <img src={it.image} alt={it.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 160, background: "#f3f3f3" }} />
              )}

              <h3 style={{ marginTop: 8 }}>{it.name}</h3>
              <div className="muted">{it.metal} • {it.weightGrams} g</div>
              <div style={{ marginTop: 8, fontWeight: 800 }}>
                Price: {priceFor(it) > 0 ? new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(priceFor(it)) : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
