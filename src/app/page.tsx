"use client";

import { useEffect, useMemo, useState } from "react";
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
      <div style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
        <div className="container" style={{ display: "flex", gap: 12, padding: "10px 0" }}>
          <a href="/" style={{ padding: "8px 12px", textDecoration: "none", fontWeight: 700 }}>Home</a>
          <a href="/shop" style={{ padding: "8px 12px", textDecoration: "none", fontWeight: 700 }}>Shop</a>
          <a href="/contact" style={{ padding: "8px 12px", textDecoration: "none", fontWeight: 700 }}>Contact Us</a>
          <a href="/admin" style={{ padding: "8px 12px", textDecoration: "none", fontWeight: 700 }}>Admin</a>
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

          <section className="card" style={{ padding: 16, marginTop: 12 }}>
            <h2 className="center" style={{ marginTop: 0 }}>Featured Jewellery</h2>

            <div className="feature-grid" style={{ marginTop: 12 }}>
              <div className="feature-card">
                <img src="/gold1.png" alt="Gold Bar" />
                <div className="meta">
                  <div>
                    <div className="title">24K Gold Bar</div>
                    <div className="muted" style={{ fontSize: 13 }}>10g approx. retail</div>
                  </div>
                  <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} className="cta">Enquire</a>
                </div>
              </div>

              <div className="feature-card">
                <img src="/gold3.jpg" alt="Necklace" />
                <div className="meta">
                  <div>
                    <div className="title">Designer Necklace</div>
                    <div className="muted" style={{ fontSize: 13 }}>Handcrafted jewellery</div>
                  </div>
                  <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} className="cta">Enquire</a>
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
