"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import LiveRatesDashboard from "@/components/LiveRatesDashboard";

type Item = {
  id: string;
  name: string;
  metal: "Gold" | "Silver";
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
  try {
    return JSON.parse(localStorage.getItem("items") ?? "[]");
  } catch {
    return [];
  }
}

function readManualRates(): ManualRates | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("manualRates");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ManualRates;
    if (
      parsed &&
      [parsed.gold24_10g, parsed.gold22_10g, parsed.gold18_10g, parsed.silver999_1kg].every(
        (value) => Number.isFinite(value) && value > 0
      )
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [items, setItems] = useState<Item[]>([]);
  const [goldPrice24_10g, setGoldPrice24_10g] = useState<number>(0);

  const [manualRateForm, setManualRateForm] = useState({
    gold24: "",
    gold22: "",
    gold18: "",
    silver: "",
  });

  const [manualRates, setManualRates] = useState<ManualRates | null>(null);

  const [form, setForm] = useState({
    name: "",
    metal: "Gold",
    weight: "0",
    wastage: "3",
  });

  const [preview, setPreview] = useState<string | undefined>(undefined);

  const [adminUser, setAdminUser] = useState("admin");
  const [adminPass, setAdminPass] = useState("admin");

  useEffect(() => {
    if (typeof window === "undefined") return;

    setItems(readItems());
    setGoldPrice24_10g(Number(localStorage.getItem("goldPrice24_10g") ?? 0));

    setAdminUser(localStorage.getItem("adminUser") ?? "admin");
    setAdminPass(localStorage.getItem("adminPass") ?? "admin");

    const existingManualRates = readManualRates();
    if (existingManualRates) {
      setManualRates(existingManualRates);
      setManualRateForm({
        gold24: String(existingManualRates.gold24_10g),
        gold22: String(existingManualRates.gold22_10g),
        gold18: String(existingManualRates.gold18_10g),
        silver: String(existingManualRates.silver999_1kg),
      });
    }
  }, []);

  function login() {
    if (username === adminUser && password === adminPass) {
      setLoggedIn(true);
    } else {
      alert("Incorrect username or password");
    }
  }

  function saveGoldPrice() {
    if (typeof window !== "undefined") {
      localStorage.setItem("goldPrice24_10g", String(goldPrice24_10g));
      window.dispatchEvent(new Event("rates-updated"));
    }
    alert("Saved gold 24K price");
  }

  function saveManualRates() {
    if (typeof window === "undefined") return;

    const next: ManualRates = {
      gold24_10g: Number(manualRateForm.gold24) || 0,
      gold22_10g: Number(manualRateForm.gold22) || 0,
      gold18_10g: Number(manualRateForm.gold18) || 0,
      silver999_1kg: Number(manualRateForm.silver) || 0,
    };

    localStorage.setItem("manualRates", JSON.stringify(next));
    setManualRates(next);
    window.dispatchEvent(new Event("rates-updated"));

    alert("Saved exact manual rates");
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      alert("Please upload an image file (jpg, png)");
      return;
    }

    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(f);
  }

  function addItem() {
    const it: Item = {
      id: Date.now().toString(),
      name: form.name,
      metal: form.metal as any,
      weightGrams: Number(form.weight) || 0,
      image: preview,
      wastagePercent: Number(form.wastage) || 0,
    };

    const next = [it, ...items];
    setItems(next);

    if (typeof window !== "undefined") {
      localStorage.setItem("items", JSON.stringify(next));
      window.dispatchEvent(new Event("items-updated"));
    }

    setForm({ name: "", metal: "Gold", weight: "0", wastage: "3" });
    setPreview(undefined);
  }

  function computePrice(it: Item) {
    if (it.metal === "Gold") {
      const perGram = goldPrice24_10g / 10;
      const w = it.wastagePercent ?? 0;
      return perGram * it.weightGrams * (1 + w / 100);
    }
    return 0;
  }

  return (
    <>
      <Header />

      <main className="container">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 className="title">Admin</h1>
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
        </div>

        {!loggedIn ? (
          <section className="card" style={{ padding: 16 }}>
            <p>Enter admin username and password</p>

            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-primary" onClick={login}>
              Login
            </button>
          </section>
        ) : (
          <>
            {/* ✅ LIVE RATES DASHBOARD ADDED HERE */}
            <LiveRatesDashboard />

            {/* SETTINGS */}
            <section className="card" style={{ padding: 16, marginTop: 12 }}>
              <h2>Settings</h2>

              <label>Gold 24K Price</label>
              <input
                className="input"
                type="number"
                value={goldPrice24_10g || ""}
                onChange={(e) => setGoldPrice24_10g(Number(e.target.value))}
              />

              <button className="btn" onClick={saveGoldPrice}>
                Save Gold Price
              </button>

              <hr />

              <h3>Exact Rates Override</h3>

              <input
                className="input"
                placeholder="24K"
                value={manualRateForm.gold24}
                onChange={(e) =>
                  setManualRateForm({ ...manualRateForm, gold24: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="22K"
                value={manualRateForm.gold22}
                onChange={(e) =>
                  setManualRateForm({ ...manualRateForm, gold22: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="18K"
                value={manualRateForm.gold18}
                onChange={(e) =>
                  setManualRateForm({ ...manualRateForm, gold18: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Silver"
                value={manualRateForm.silver}
                onChange={(e) =>
                  setManualRateForm({ ...manualRateForm, silver: e.target.value })
                }
              />

              <button className="btn" onClick={saveManualRates}>
                Save Manual Rates
              </button>
            </section>

            {/* ADD ITEM */}
            <section className="card" style={{ padding: 16, marginTop: 12 }}>
              <h2>Add Item</h2>

              <input
                className="input"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <select
                className="input"
                value={form.metal}
                onChange={(e) => setForm({ ...form, metal: e.target.value })}
              >
                <option>Gold</option>
                <option>Silver</option>
              </select>

              <input
                className="input"
                type="number"
                placeholder="Weight"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />

              <input
                className="input"
                type="number"
                placeholder="Wastage"
                value={form.wastage}
                onChange={(e) => setForm({ ...form, wastage: e.target.value })}
              />

              <input type="file" accept="image/*" onChange={onFile} />

              {preview && <img src={preview} width={120} />}

              <button className="btn btn-primary" onClick={addItem}>
                Add Item
              </button>
            </section>

            {/* ITEMS */}
            <section className="card" style={{ padding: 16, marginTop: 12 }}>
              <h2>Items ({items.length})</h2>

              {items.map((it) => (
                <div key={it.id} style={{ display: "flex", gap: 10 }}>
                  <img src={it.image} width={80} />
                  <div>
                    <div>{it.name}</div>
                    <div>{it.metal}</div>
                    <div>{computePrice(it)}</div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </>
  );
}