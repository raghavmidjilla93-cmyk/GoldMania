"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import { siteConfig } from "@/config/siteConfig";

type GoldPrice = { purity: string; amount: number };
type SilverPrice = { purity: "999"; amount: number };

type ApiData = {
  updatedAt: string;
  city?: string;
  note?: string;
  units?: {
    gold?: string; // ₹ per 10 grams
    silver?: string; // ₹ per 1 kg
  };
  prices: {
    gold: GoldPrice[];
    silver: SilverPrice[];
  };
};

export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [error, setError] = useState<string>("");

  async function loadRates() {
    try {
      setError("");
      const res = await fetch("/api/rates", { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? "Failed to load rates");
        setData(null);
        return;
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Network error");
      setData(null);
    }
  }

  useEffect(() => {
    loadRates();
    const t = setInterval(loadRates, 10 * 60_000); // every 10 mins
    return () => clearInterval(t);
  }, []);

  const gold = useMemo(() => data?.prices?.gold ?? [], [data]);
  const silver = useMemo(() => data?.prices?.silver ?? [], [data]);

  const rateDate = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Loading...";

  const lastUpdated = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleString("en-IN")
    : "Loading...";

  return (
    <>
      <Header />

      {/* Visible tab bar under header for quick navigation */}
      <div className="page-nav-bar">
        <div className="container page-nav">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>

      
      <main className="container">
        <h1 className="title">TODAY&apos;S GOLD RATE</h1>

        <div className="center muted">
          <div>Rate Date: {rateDate}</div>
          <div>Last Updated: {lastUpdated}</div>
          <div style={{ marginTop: 6, fontSize: 13 }}>
            {data?.city ? `${data.city} • ` : ""}{data?.note ?? ""}
          </div>
        </div>

        {error ? <div className="error">{error}</div> : null}

        {/* GOLD SECTION (10g) */}
        <section className="card">
          <div className="card-header">Gold Rates (INR) — 10 Grams</div>

          <div style={{ overflowX: "auto" }}>
            <table className="rates-table">
              <thead>
                <tr>
                  <th style={th}>Metal</th>
                  <th style={th}>Purity</th>
                  <th style={{ ...th, textAlign: "right" }}>Price (10g)</th>
                </tr>
              </thead>

              <tbody>
                {gold.length === 0 && !error ? (
                  <tr>
                    <td style={td} colSpan={3}>
                      Loading gold rates...
                    </td>
                  </tr>
                ) : (
                  gold.map((r, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                      <td style={td}>Gold</td>
                      <td style={td}>{r.purity}</td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 900 }}>
                        {formatINR(r.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SILVER SECTION (1kg) */}
        <section className="card">
          <div className="card-header">Silver Rate (INR) — 1 KG</div>

          <div style={{ overflowX: "auto" }}>
            <table className="rates-table">
              <thead>
                <tr>
                  <th style={th}>Metal</th>
                  <th style={th}>Purity</th>
                  <th style={{ ...th, textAlign: "right" }}>Price (1kg)</th>
                </tr>
              </thead>

              <tbody>
                {silver.length === 0 && !error ? (
                  <tr>
                    <td style={td} colSpan={3}>
                      Loading silver rate...
                    </td>
                  </tr>
                ) : (
                  silver.map((r, i) => (
                    <tr key={i}>
                      <td style={td}>Silver</td>
                      <td style={td}>{r.purity}</td>
                      <td className="numeric" style={{ ...td }}>
                        {formatINR(r.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

          {/* After rates: Hero slider + Featured */}
          <HeroSlider />

          {/* FEATURES SECTION */}
          <section style={{ marginTop: 20 }}>
            <h2 className="center" style={{ marginBottom: 16, fontSize: 24, fontWeight: 700 }}>Why Choose Us?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {siteConfig.features.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{feature.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{feature.title}</div>
                  <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{feature.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURED JEWELLERY GALLERY */}
          <section className="card" style={{ padding: 16, marginTop: 20 }}>
            <h2 className="center" style={{ marginTop: 0, marginBottom: 20, fontSize: 24, fontWeight: 700 }}>✨ Featured Collection</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 16,
            }}>
              <div style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}>
                <img src="/gold1.png" alt="Gold Bar" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>24K Gold Bar</div>
                  <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Pure hallmarked gold • 10g approx.</div>
                  <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} className="cta" style={{ display: "inline-block", padding: "8px 12px", backgroundColor: "#1e87a7", color: "white", textDecoration: "none", borderRadius: 4, fontSize: 13, fontWeight: 600 }}>
                    📱 Enquire on WhatsApp
                  </a>
                </div>
              </div>

              <div style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}>
                <img src="/gold3.jpg" alt="Necklace" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Designer Necklace</div>
                  <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Handcrafted 22K • Premium design</div>
                  <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} className="cta" style={{ display: "inline-block", padding: "8px 12px", backgroundColor: "#1e87a7", color: "white", textDecoration: "none", borderRadius: 4, fontSize: 13, fontWeight: 600 }}>
                    📱 Enquire on WhatsApp
                  </a>
                </div>
              </div>

              <div style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}>
                <div style={{ width: "100%", height: 200, backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                  💍
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Custom Designs</div>
                  <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Create your unique jewelry • Any design</div>
                  <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} className="cta" style={{ display: "inline-block", padding: "8px 12px", backgroundColor: "#1e87a7", color: "white", textDecoration: "none", borderRadius: 4, fontSize: 13, fontWeight: 600 }}>
                    📱 Get Free Quote
                  </a>
                </div>
              </div>
            </div>
          </section>

        <section style={{ marginTop: 24 }}>
          <h2>All About Gold!</h2>
          <p className="muted" style={{ lineHeight: 1.7 }}>
            This page shows Hyderabad retail (approx.) INR rates.
            Gold is shown per <b>10 grams</b> and Silver is shown per <b>1 kg</b>.
          </p>
        </section>

        <section className="card" style={{ padding: 16 }}>
          <h2 className="center" style={{ marginTop: 0 }}>
            Subscribe for Metal Rate Update
          </h2>

          <form style={{ display: "grid", gap: 12, marginTop: 14 }}>
            <input className="input" placeholder="Customer Name" />
            <input className="input" placeholder="Enter Your Area" />
            <input className="input" placeholder="Enter Your Email" />
            <button type="button" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

const th: React.CSSProperties = { padding: 12, textAlign: "left" };
const td: React.CSSProperties = { padding: 12 };



function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}
