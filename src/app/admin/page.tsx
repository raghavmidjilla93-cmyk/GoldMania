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

            <section className="card" style={{ padding: 16, marginTop: 12, backgroundColor: "#f9f9f9" }}>
              <h2 style={{ marginBottom: 8 }}>📸 Add New Item with Image</h2>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Upload jewelry items with photos. Images are stored and displayed in your shop.</p>
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: "block", color: "#333" }}>Item Name</label>
                  <input className="input" placeholder="e.g., Gold Ring, Silver Bracelet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: "block", color: "#333" }}>Metal Type</label>
                    <select className="input" value={form.metal} onChange={(e) => setForm({ ...form, metal: e.target.value })}>
                      <option>Gold</option>
                      <option>Silver</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: "block", color: "#333" }}>Weight (grams)</label>
                    <input className="input" placeholder="e.g., 10" type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: "block", color: "#333" }}>Wastage % (Labor)</label>
                  <input className="input" placeholder="e.g., 3" type="number" value={form.wastage} onChange={(e) => setForm({ ...form, wastage: e.target.value })} />
                </div>
                <div style={{ border: "2px dashed #1e87a7", padding: 20, borderRadius: 8, backgroundColor: "#e8f4f8", textAlign: "center" }}>
                  <label htmlFor="file-upload" style={{ display: "block", cursor: "pointer" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#1e87a7", fontSize: 15 }}>Click to upload image</div>
                    <div style={{ fontSize: 12, color: "#666" }}>or drag and drop (JPG, PNG)</div>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={onFile}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                {preview ? (
                  <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #ddd" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, padding: 8, backgroundColor: "#f0f0f0", margin: 0 }}>✅ Image Preview</p>
                    <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 220, objectFit: "contain", backgroundColor: "#fff" }} />
                  </div>
                ) : null}
                <button className="btn btn-primary" onClick={addItem} style={{ padding: "12px 16px", fontSize: 15, fontWeight: 600, marginTop: 8 }}>
                  ➕ Add Item to Shop
                </button>
              </div>
            </section>

            <section className="card" style={{ padding: 16, marginTop: 12 }}>
              <h2 style={{ marginBottom: 12 }}>📦 Shop Items ({items.length})</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {items.length === 0 ? (
                  <div className="muted" style={{ padding: 20, textAlign: "center", backgroundColor: "#f5f5f5", borderRadius: 8 }}>
                    <p style={{ margin: 0 }}>No items added yet. Create your first item above! ☝️</p>
                  </div>
                ) : (
                  items.map((it) => (
                    <div key={it.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, backgroundColor: "#fafafa", borderRadius: 8, border: "1px solid #e0e0e0" }}>
                      {it.image ? (
                        <img src={it.image} alt={it.name} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 6 }} />
                      ) : (
                        <div style={{ width: 90, height: 90, background: "#e0e0e0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 32 }}>🖼️</span>
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{it.name}</div>
                        <div className="muted" style={{ fontSize: 13 }}>
                          {it.metal} • {it.weightGrams}g • Wastage: {it.wastagePercent}%
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 6, color: "#1e87a7" }}>
                          {computePrice(it) > 0
                            ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(computePrice(it))
                            : "N/A"}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updatedItems = items.filter((i) => i.id !== it.id);
                          setItems(updatedItems);
                          localStorage.setItem("items", JSON.stringify(updatedItems));
                        }}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#ff4444",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
