"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { siteConfig } from "@/config/siteConfig";

type Item = {
  id: string;
  name: string;
  metal: "Gold" | "Silver";
  weightGrams: number;
  image?: string;
  wastagePercent?: number;
};

function readItems(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("items") ?? "[]");
  } catch {
    return [];
  }
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [goldPrice24_10g, setGoldPrice24_10g] = useState<number>(0);
  const [form, setForm] = useState({ name: "", metal: "Gold", weight: "0", wastage: "3" });
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [adminUser, setAdminUser] = useState("admin");
  const [adminPass, setAdminPass] = useState("admin");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setItems(readItems());
    setGoldPrice24_10g(Number(localStorage.getItem("goldPrice24_10g") ?? 0));
    setAdminUser(localStorage.getItem("adminUser") ?? "admin");
    setAdminPass(localStorage.getItem("adminPass") ?? "admin");
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
    }
    alert("Saved gold 24K price");
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    // validate type
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
        <h1 className="title">Admin</h1>

        {!loggedIn ? (
          <section className="card" style={{ padding: 16 }}>
            <p>Enter admin username and password to continue.</p>
            <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-primary" onClick={login}>Login</button>
            </div>
          </section>
        ) : (
          <>
            <section className="card" style={{ padding: 16 }}>
              <h2>Settings</h2>
              <div style={{ display: "grid", gap: 8 }}>
                <label>Gold 24K Price (₹ per 10g)</label>
                <input className="input" type="number" value={goldPrice24_10g || ""} onChange={(e) => setGoldPrice24_10g(Number(e.target.value))} />
                <button className="btn" onClick={saveGoldPrice}>Save</button>

                <hr />
                <label>Admin credentials</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="input"
                    placeholder="Username"
                    value={adminUser}
                    onChange={(e) => {
                      const next = e.target.value;
                      setAdminUser(next);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("adminUser", next);
                      }
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Password"
                    type="password"
                    value={adminPass}
                    onChange={(e) => {
                      const next = e.target.value;
                      setAdminPass(next);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("adminPass", next);
                      }
                    }}
                  />
                </div>
              </div>
            </section>

            <section className="card" style={{ padding: 16, marginTop: 12 }}>
              <h2>Add Item</h2>
              <div style={{ display: "grid", gap: 8 }}>
                <input className="input" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <select className="input" value={form.metal} onChange={(e) => setForm({ ...form, metal: e.target.value })}>
                  <option>Gold</option>
                  <option>Silver</option>
                </select>
                <input className="input" placeholder="Weight (grams)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                <input className="input" placeholder="Wastage percent (e.g. 3)" value={form.wastage} onChange={(e) => setForm({ ...form, wastage: e.target.value })} />
                <input type="file" accept="image/*" onChange={onFile} />
                {preview ? <img src={preview} style={{ width: 160, height: 120, objectFit: "cover" }} /> : null}
                <button className="btn btn-primary" onClick={addItem}>Add Item</button>
              </div>
            </section>

            <section className="card" style={{ padding: 16, marginTop: 12 }}>
              <h2>Items</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {items.length === 0 ? <div className="muted">No items yet.</div> : items.map((it) => (
                  <div key={it.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {it.image ? <img src={it.image} style={{ width: 100, height: 80, objectFit: "cover" }} /> : <div style={{ width: 100, height: 80, background: "#f3f3f3" }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800 }}>{it.name}</div>
                      <div className="muted">{it.metal} • {it.weightGrams} g • Wastage: {it.wastagePercent}%</div>
                    </div>
                    <div style={{ fontWeight: 900 }}>{computePrice(it) > 0 ? new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(computePrice(it)) : 'N/A'}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
