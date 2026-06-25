"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import { siteConfig } from "@/config/siteConfig";

const SESSION_KEY = "gm_admin_session";
const ADMIN_USER  = "admin";
const ADMIN_PASS  = "GoldMania@2025";

type Metal  = "Gold" | "Silver";
type Purity = "24K" | "22K" | "18K";
type LineItem = {
  id: string;
  name: string;
  metal: Metal;
  purity: Purity;
  weightGrams: number;
  wastagePercent: number;
  ratePerGram: number;
  amount: number;
};

const PURITY_RATIO: Record<Purity, number> = { "24K": 1, "22K": 22 / 24, "18K": 18 / 24 };

function formatINR(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

function invoiceNo() {
  const d = new Date();
  return `GM-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000) + 1000}`;
}

export default function InvoicePage() {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const [authed,     setAuthed]     = useState(false);
  const [loginUser,  setLoginUser]  = useState("");
  const [loginPass,  setLoginPass]  = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
  }, []);

  function doLogin() {
    if (loginUser.trim() === ADMIN_USER && loginPass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect username or password.");
      setLoginPass("");
    }
  }

  // ── Live rates ──────────────────────────────────────────────────────────────
  const [gold24PerGram,  setGold24PerGram]  = useState(0);
  const [silverPerGram,  setSilverPerGram]  = useState(0);
  const [rateDate,       setRateDate]       = useState("—");
  const [rateSource,     setRateSource]     = useState("");

  useEffect(() => {
    // Try manual override first (same as homepage)
    try {
      const m = JSON.parse(localStorage.getItem("manualRates") || "{}");
      if (m.gold24_10g > 0) {
        setGold24PerGram(m.gold24_10g / 10);
      }
    } catch {}

    fetch("/api/rates", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        const g24row = d?.prices?.gold?.find((r: { purity: string }) => r.purity === "24K");
        if (g24row?.amount) setGold24PerGram(g24row.amount / 10);
        const s999row = d?.prices?.silver?.find((r: { purity: string }) => r.purity === "999");
        if (s999row?.amount) setSilverPerGram(s999row.amount / 1000);
        if (d?.updatedAt) setRateDate(new Date(d.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }));
        if (d?.source) setRateSource(d.source);
      })
      .catch(() => {});
  }, []);

  // ── Invoice state ───────────────────────────────────────────────────────────
  const [invNo]                   = useState(invoiceNo);
  const [customerName,  setCN]    = useState("");
  const [customerPhone, setCP]    = useState("");
  const [lines,         setLines] = useState<LineItem[]>([]);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [fName,    setFName]    = useState("");
  const [fMetal,   setFMetal]   = useState<Metal>("Gold");
  const [fPurity,  setFPurity]  = useState<Purity>("22K");
  const [fWeight,  setFWeight]  = useState("");
  const [fWastage, setFWastage] = useState("3");

  const printRef = useRef<HTMLDivElement>(null);

  function rateFor(metal: Metal, purity: Purity): number {
    if (metal === "Gold") return gold24PerGram * PURITY_RATIO[purity];
    return silverPerGram;
  }

  function addLine() {
    const wt  = parseFloat(fWeight);
    const ws  = parseFloat(fWastage) || 0;
    if (!fName.trim() || !wt || wt <= 0) return;
    const rate   = rateFor(fMetal, fPurity);
    const amount = Math.round(rate * wt * (1 + ws / 100));
    setLines(prev => [...prev, {
      id: Date.now().toString(),
      name: fName.trim(),
      metal: fMetal,
      purity: fPurity,
      weightGrams: wt,
      wastagePercent: ws,
      ratePerGram: Math.round(rate),
      amount,
    }]);
    setFName(""); setFWeight(""); setFWastage("3");
  }

  function removeLine(id: string) {
    setLines(prev => prev.filter(l => l.id !== id));
  }

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const gst3     = Math.round(subtotal * 0.03);
  const total    = subtotal + gst3;

  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  function doPrint() {
    window.print();
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: 8,
    color: "#D4AF37",
    padding: "9px 12px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#5C4E30",
    display: "block",
    marginBottom: 5,
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

  // ── Login gate ───────────────────────────────────────────────────────────────
  if (!authed) {
    const G = "linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)";
    const iStyle: React.CSSProperties = {
      width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.2)",
      borderRadius: 8, color: "#e8dfc8", padding: "10px 14px", fontSize: 13, outline: "none",
      boxSizing: "border-box",
    };
    return (
      <>
        <Header />
        <div style={{ background: "#050503", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "linear-gradient(160deg,#161409,#0c0c0a)", border: "1px solid rgba(212,175,55,0.14)", borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 360 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>🔐</div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 18, fontWeight: 700, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Admin Only</div>
              <div style={{ fontSize: 11, color: "#4a3e28", marginTop: 4 }}>Invoice Generator · Gold Mania</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6B5C3A", display: "block", marginBottom: 5 }}>Username</label>
                <input style={iStyle} placeholder="Enter username" value={loginUser}
                  onChange={e => { setLoginUser(e.target.value); setLoginError(""); }}
                  onKeyDown={e => e.key === "Enter" && doLogin()} autoComplete="username" />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6B5C3A", display: "block", marginBottom: 5 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input style={{ ...iStyle, paddingRight: 44 }} type={showPass ? "text" : "password"}
                    placeholder="Enter password" value={loginPass}
                    onChange={e => { setLoginPass(e.target.value); setLoginError(""); }}
                    onKeyDown={e => e.key === "Enter" && doLogin()} autoComplete="current-password" />
                  <button onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#6B5C3A", cursor: "pointer", fontSize: 14, padding: 0 }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              {loginError && (
                <div style={{ padding: "8px 12px", background: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.25)", borderRadius: 8, fontSize: 12, color: "#ef5350" }}>
                  {loginError}
                </div>
              )}
              <button onClick={doLogin}
                style={{ background: G, color: "#0a0806", border: "none", borderRadius: 999, padding: "12px 22px", fontWeight: 800, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", marginTop: 4 }}>
                Sign In →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Responsive + print styles */}
      <style>{`
        .inv-form-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
          gap: 12px;
          align-items: flex-end;
        }
        @media (max-width: 900px) {
          .inv-form-grid { grid-template-columns: 1fr 1fr; }
          .inv-form-name { grid-column: 1 / -1; }
          .inv-form-btn  { grid-column: 1 / -1; }
          .inv-customer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .inv-form-grid { grid-template-columns: 1fr; }
          .inv-form-name, .inv-form-btn { grid-column: 1; }
        }
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-area {
            display: block !important;
            position: fixed !important;
            inset: 0 !important;
            background: #fff !important;
            padding: 32px 40px !important;
            color: #111 !important;
            z-index: 9999 !important;
          }
          .inv-table th, .inv-table td { color: #111 !important; border-color: #ccc !important; }
          .inv-header-brand { color: #7a5c10 !important; -webkit-text-fill-color: #7a5c10 !important; }
        }
        @media screen {
          .print-area { display: none; }
        }

        /* screen form inputs on dark bg */
        .inv-input::placeholder { color: #3a3020; }
        .inv-input:focus { border-color: rgba(212,175,55,0.5) !important; }
        .inv-select option { background: #0c0c0a; color: #D4AF37; }
      `}</style>

      {/* ── SCREEN UI ────────────────────────────────────────────────────── */}
      <div className="no-print" style={{ background: "#050503", minHeight: "100vh", padding: "28px 16px 60px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Page title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#5C4E30", marginBottom: 6 }}>Gold Mania · Hyderabad</div>
            <h1 style={{ fontFamily: "var(--font-playfair,Georgia,serif)", fontSize: "clamp(22px,5vw,36px)", fontWeight: 900, background: "linear-gradient(135deg,#8B6914,#D4AF37,#F0D060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, letterSpacing: "0.06em" }}>
              Invoice Generator
            </h1>
            <div style={{ fontSize: 11, color: "#3a3020", marginTop: 6, fontStyle: "italic" }}>
              Rate used: 24K = {gold24PerGram > 0 ? formatINR(gold24PerGram) + "/g" : "loading…"}
              {rateSource && <span style={{ color: "#2d2619" }}> · {rateSource}</span>}
            </div>
          </div>

          {/* Customer details */}
          <div style={{ background: "linear-gradient(160deg,#161409,#0c0c0a)", border: "1px solid rgba(212,175,55,0.14)", borderRadius: 14, padding: "20px 22px", marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B5C3A", marginBottom: 14 }}>◆ Customer Details (optional)</div>
            <div className="inv-customer-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Customer Name</label>
                <input className="inv-input" style={inputStyle} placeholder="e.g. Priya Sharma" value={customerName} onChange={e => setCN(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input className="inv-input" style={inputStyle} placeholder="e.g. 98765 43210" value={customerPhone} onChange={e => setCP(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Add item form */}
          <div style={{ background: "linear-gradient(160deg,#161409,#0c0c0a)", border: "1px solid rgba(212,175,55,0.14)", borderRadius: 14, padding: "20px 22px", marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B5C3A", marginBottom: 14 }}>◆ Add Item</div>
            <div className="inv-form-grid">
              <div className="inv-form-name">
                <label style={labelStyle}>Item Name</label>
                <input className="inv-input" style={inputStyle} placeholder="e.g. Necklace, Ring…" value={fName} onChange={e => setFName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addLine()} />
              </div>
              <div>
                <label style={labelStyle}>Metal</label>
                <select className="inv-select" style={selectStyle} value={fMetal} onChange={e => setFMetal(e.target.value as Metal)}>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Purity</label>
                <select className="inv-select" style={{ ...selectStyle, opacity: fMetal === "Silver" ? 0.4 : 1 }}
                  value={fPurity} onChange={e => setFPurity(e.target.value as Purity)} disabled={fMetal === "Silver"}>
                  <option value="22K">22K</option>
                  <option value="24K">24K</option>
                  <option value="18K">18K</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Weight (g)</label>
                <input className="inv-input" style={inputStyle} type="number" min="0.01" step="0.01" placeholder="e.g. 12.5" value={fWeight}
                  onChange={e => setFWeight(e.target.value)} onKeyDown={e => e.key === "Enter" && addLine()} />
              </div>
              <div>
                <label style={labelStyle}>Wastage %</label>
                <input className="inv-input" style={inputStyle} type="number" min="0" step="0.5" placeholder="e.g. 3" value={fWastage}
                  onChange={e => setFWastage(e.target.value)} onKeyDown={e => e.key === "Enter" && addLine()} />
              </div>
              <div className="inv-form-btn">
                <button onClick={addLine} style={{ width: "100%", padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#8B6914,#D4AF37)", color: "#0a0806", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: "0.05em", minHeight: 44 }}>
                  + Add Item
                </button>
              </div>
            </div>

            {/* Live preview of current item */}
            {fWeight && parseFloat(fWeight) > 0 && gold24PerGram > 0 && (
              <div style={{ marginTop: 12, padding: "8px 14px", background: "rgba(212,175,55,0.05)", borderRadius: 8, border: "1px solid rgba(212,175,55,0.12)", fontSize: 12, color: "#8a7040" }}>
                Preview: {formatINR(Math.round(rateFor(fMetal, fPurity)))} /g × {fWeight}g
                {parseFloat(fWastage) > 0 ? ` + ${fWastage}% wastage` : ""} =&nbsp;
                <strong style={{ color: "#D4AF37", fontFamily: "system-ui,sans-serif" }}>
                  {formatINR(Math.round(rateFor(fMetal, fPurity) * parseFloat(fWeight) * (1 + (parseFloat(fWastage) || 0) / 100)))}
                </strong>
              </div>
            )}
          </div>

          {/* Line items table */}
          {lines.length > 0 && (
            <div style={{ background: "linear-gradient(160deg,#161409,#0c0c0a)", border: "1px solid rgba(212,175,55,0.14)", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(212,175,55,0.07)", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
                      {["#", "Item", "Metal", "Purity", "Weight", "Wastage", "Rate/g", "Amount", ""].map(h => (
                        <th key={h} style={{ padding: "10px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5C4E30", textAlign: h === "Amount" || h === "Rate/g" ? "right" : "left", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l, i) => (
                      <tr key={l.id} style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }}>
                        <td style={{ padding: "11px 12px", fontSize: 12, color: "#4a3e28" }}>{i + 1}</td>
                        <td style={{ padding: "11px 12px", fontSize: 13, color: "#C9A84C", fontWeight: 600 }}>{l.name}</td>
                        <td style={{ padding: "11px 12px", fontSize: 12, color: "#6B5C3A" }}>{l.metal}</td>
                        <td style={{ padding: "11px 12px", fontSize: 12, color: "#6B5C3A" }}>{l.metal === "Silver" ? "999" : l.purity}</td>
                        <td style={{ padding: "11px 12px", fontSize: 12, color: "#6B5C3A" }}>{l.weightGrams}g</td>
                        <td style={{ padding: "11px 12px", fontSize: 12, color: "#6B5C3A" }}>{l.wastagePercent}%</td>
                        <td style={{ padding: "11px 12px", fontSize: 12, color: "#6B5C3A", textAlign: "right", fontFamily: "system-ui,sans-serif" }}>{formatINR(l.ratePerGram)}</td>
                        <td style={{ padding: "11px 12px", fontSize: 14, fontWeight: 700, color: "#D4AF37", textAlign: "right", fontFamily: "system-ui,sans-serif" }}>{formatINR(l.amount)}</td>
                        <td style={{ padding: "11px 8px" }}>
                          <button onClick={() => removeLine(l.id)} style={{ background: "rgba(239,83,80,0.12)", border: "1px solid rgba(239,83,80,0.2)", borderRadius: 6, color: "#ef5350", fontSize: 11, padding: "3px 8px", cursor: "pointer" }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: "1px solid rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.03)" }}>
                      <td colSpan={7} style={{ padding: "11px 12px", fontSize: 11, color: "#4a3e28", textAlign: "right", fontWeight: 700, letterSpacing: "0.1em" }}>SUBTOTAL (excl. GST)</td>
                      <td style={{ padding: "11px 12px", fontSize: 15, fontWeight: 800, color: "#D4AF37", textAlign: "right", fontFamily: "system-ui,sans-serif" }}>{formatINR(subtotal)}</td>
                      <td />
                    </tr>
                    <tr>
                      <td colSpan={7} style={{ padding: "6px 12px", fontSize: 11, color: "#4a3e28", textAlign: "right" }}>GST @ 3%</td>
                      <td style={{ padding: "6px 12px", fontSize: 12, color: "#8a7040", textAlign: "right", fontFamily: "system-ui,sans-serif" }}>{formatINR(gst3)}</td>
                      <td />
                    </tr>
                    <tr style={{ background: "rgba(212,175,55,0.07)", borderTop: "1px solid rgba(212,175,55,0.18)" }}>
                      <td colSpan={7} style={{ padding: "13px 12px", fontSize: 12, fontWeight: 800, color: "#C9A84C", textAlign: "right", letterSpacing: "0.12em" }}>TOTAL</td>
                      <td style={{ padding: "13px 12px", fontSize: 17, fontWeight: 900, color: "#D4AF37", textAlign: "right", fontFamily: "system-ui,sans-serif" }}>{formatINR(total)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
            {lines.length > 0 && (
              <button onClick={() => setLines([])} style={{ padding: "11px 22px", borderRadius: 999, background: "transparent", border: "1px solid rgba(239,83,80,0.3)", color: "#ef5350", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.1em" }}>
                Clear All
              </button>
            )}
            <button onClick={doPrint} disabled={lines.length === 0}
              style={{ padding: "11px 28px", borderRadius: 999, background: lines.length === 0 ? "rgba(212,175,55,0.15)" : "linear-gradient(135deg,#8B6914,#D4AF37)", color: lines.length === 0 ? "#3a3020" : "#0a0806", border: "none", fontSize: 12, fontWeight: 800, cursor: lines.length === 0 ? "not-allowed" : "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              🖨 Print Invoice
            </button>
          </div>

          {/* Rate info */}
          <div style={{ marginTop: 28, padding: "14px 18px", background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.08)", borderRadius: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3a3020", marginBottom: 8 }}>Rates used for this invoice ({rateDate})</div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {gold24PerGram > 0 && [
                { label: "24K", val: formatINR(Math.round(gold24PerGram)) },
                { label: "22K", val: formatINR(Math.round(gold24PerGram * 22 / 24)) },
                { label: "18K", val: formatINR(Math.round(gold24PerGram * 18 / 24)) },
              ].map(r => (
                <div key={r.label}>
                  <span style={{ fontSize: 9, color: "#3a3020" }}>Gold {r.label} /g · </span>
                  <span style={{ fontFamily: "system-ui,sans-serif", fontSize: 13, fontWeight: 700, color: "#D4AF37" }}>{r.val}</span>
                </div>
              ))}
              {silverPerGram > 0 && (
                <div>
                  <span style={{ fontSize: 9, color: "#3a3020" }}>Silver 999 /g · </span>
                  <span style={{ fontFamily: "system-ui,sans-serif", fontSize: 13, fontWeight: 700, color: "#A0A0A0" }}>{formatINR(Math.round(silverPerGram))}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── PRINT-ONLY INVOICE ───────────────────────────────────────────── */}
      <div ref={printRef} className="print-area" style={{ fontFamily: "Georgia, serif", color: "#111" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #b8960c", paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <div className="inv-header-brand" style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a5c10" }}>
              {siteConfig.brandName}
            </div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>Hyderabad · Certified Hallmarked Gold</div>
            <div style={{ fontSize: 11, color: "#666" }}>{siteConfig.phone} · {siteConfig.address}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.12em" }}>Tax Invoice</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#333", marginTop: 4 }}>{invNo}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Date: {today}</div>
          </div>
        </div>

        {/* Customer */}
        {(customerName || customerPhone) && (
          <div style={{ marginBottom: 18, padding: "10px 14px", background: "#faf8f0", borderRadius: 6, border: "1px solid #e8ddb0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Bill To</div>
            {customerName  && <div style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>{customerName}</div>}
            {customerPhone && <div style={{ fontSize: 12, color: "#555" }}>{customerPhone}</div>}
          </div>
        )}

        {/* Rate bar */}
        <div style={{ marginBottom: 16, fontSize: 10, color: "#888", display: "flex", gap: 18, flexWrap: "wrap" }}>
          <span>Rates on {rateDate}:</span>
          {gold24PerGram > 0 && (
            <>
              <span>24K = {formatINR(Math.round(gold24PerGram))}/g</span>
              <span>22K = {formatINR(Math.round(gold24PerGram * 22 / 24))}/g</span>
              <span>18K = {formatINR(Math.round(gold24PerGram * 18 / 24))}/g</span>
            </>
          )}
          {silverPerGram > 0 && <span>Silver 999 = {formatINR(Math.round(silverPerGram))}/g</span>}
        </div>

        {/* Items table */}
        <table className="inv-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 0, fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f5f0e0" }}>
              {["#", "Item Description", "Metal", "Purity", "Weight (g)", "Wastage %", "Rate /g (₹)", "Amount (₹)"].map((h, i) => (
                <th key={h} style={{ padding: "9px 10px", border: "1px solid #ddd", textAlign: i >= 6 ? "right" : i >= 4 ? "center" : "left", fontWeight: 700, letterSpacing: "0.05em", fontSize: 10, textTransform: "uppercase", color: "#555" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={l.id} style={{ background: i % 2 === 0 ? "#fff" : "#faf8f0" }}>
                <td style={{ padding: "9px 10px", border: "1px solid #e8e8e8", color: "#999" }}>{i + 1}</td>
                <td style={{ padding: "9px 10px", border: "1px solid #e8e8e8", fontWeight: 600, color: "#222" }}>{l.name}</td>
                <td style={{ padding: "9px 10px", border: "1px solid #e8e8e8", color: "#555" }}>{l.metal}</td>
                <td style={{ padding: "9px 10px", border: "1px solid #e8e8e8", color: "#555", textAlign: "center" }}>{l.metal === "Silver" ? "999" : l.purity}</td>
                <td style={{ padding: "9px 10px", border: "1px solid #e8e8e8", color: "#555", textAlign: "center" }}>{l.weightGrams}</td>
                <td style={{ padding: "9px 10px", border: "1px solid #e8e8e8", color: "#555", textAlign: "center" }}>{l.wastagePercent}%</td>
                <td style={{ padding: "9px 10px", border: "1px solid #e8e8e8", color: "#555", textAlign: "right" }}>{l.ratePerGram.toLocaleString("en-IN")}</td>
                <td style={{ padding: "9px 10px", border: "1px solid #e8e8e8", fontWeight: 700, color: "#111", textAlign: "right" }}>{l.amount.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} style={{ padding: "9px 10px", border: "1px solid #ddd", textAlign: "right", fontWeight: 600, color: "#555", fontSize: 11 }}>Subtotal (excl. GST)</td>
              <td style={{ padding: "9px 10px", border: "1px solid #ddd", textAlign: "right", fontWeight: 700, color: "#333" }}>{subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td colSpan={7} style={{ padding: "7px 10px", border: "1px solid #ddd", textAlign: "right", color: "#666", fontSize: 11 }}>GST @ 3%</td>
              <td style={{ padding: "7px 10px", border: "1px solid #ddd", textAlign: "right", color: "#666", fontSize: 11 }}>{gst3.toLocaleString("en-IN")}</td>
            </tr>
            <tr style={{ background: "#f5f0e0" }}>
              <td colSpan={7} style={{ padding: "11px 10px", border: "2px solid #b8960c", textAlign: "right", fontWeight: 800, color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total</td>
              <td style={{ padding: "11px 10px", border: "2px solid #b8960c", textAlign: "right", fontWeight: 900, fontSize: 16, color: "#7a5c10" }}>₹ {total.toLocaleString("en-IN")}</td>
            </tr>
          </tfoot>
        </table>

        {/* Notes */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Terms &amp; Conditions</div>
            <div style={{ fontSize: 10, color: "#888", lineHeight: 1.7 }}>
              · Rates are as on the date of invoice.<br/>
              · All weights verified at the time of billing.<br/>
              · GST included in the total amount above.<br/>
              · No exchange/return without original invoice.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginTop: 40, borderTop: "1px solid #ccc", paddingTop: 8, display: "inline-block", minWidth: 180 }}>
              <div style={{ fontSize: 11, color: "#888" }}>Authorised Signatory</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#333", marginTop: 2 }}>{siteConfig.brandName}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 28, paddingTop: 12, borderTop: "1px solid #eee", textAlign: "center", fontSize: 10, color: "#aaa" }}>
          Thank you for choosing {siteConfig.brandName} · {siteConfig.phone} · {siteConfig.address}
        </div>

      </div>
    </>
  );
}
