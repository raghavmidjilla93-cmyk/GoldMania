"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/siteConfig";

type RateRow   = { purity: string; amount: number };
type ApiData = {
  updatedAt: string; city?: string; note?: string; source?: string;
  prices:    { gold: RateRow[]; silver: RateRow[] };
  prevPrices?: { gold: RateRow[]; silver: RateRow[] } | null;
};
type ManualRates = { gold24_10g:number; gold22_10g:number; gold18_10g:number; silver999_1kg:number };

function formatINR(v: number) {
  return new Intl.NumberFormat("en-IN",{ style:"currency", currency:"INR", maximumFractionDigits:0 }).format(v);
}

const PURITY_DESC: Record<string,string> = {
  "24K":"Pure Gold · 99.9%",
  "22K":"Indian Standard · 91.6%",
  "18K":"Mixed Alloy · 75%",
  "Spot":"Spot Rate",
  "999":"Fine Silver · 99.9%",
};

export default function Home() {
  const [data, setData]   = useState<ApiData|null>(null);
  const [error, setError] = useState("");
  const [manualActive, setManualActive] = useState(false);

  function readManual(): ManualRates|null {
    if (typeof window==="undefined") return null;
    try {
      const p = JSON.parse(localStorage.getItem("manualRates")||"{}") as ManualRates;
      if ([p.gold24_10g,p.gold22_10g,p.gold18_10g,p.silver999_1kg].every(v=>Number.isFinite(v)&&v>0)) return p;
    } catch {}
    return null;
  }

  async function loadRates() {
    try {
      setError("");
      const res  = await fetch("/api/rates",{ cache:"no-store" });
      const json = await res.json();
      if (!res.ok) { setError(json?.error??"Failed to load rates"); setData(null); return; }
      const m = readManual();
      if (m) {
        setManualActive(true);
        setData({ ...json, note:"Admin rates active",
          prices:{ gold:[{purity:"24K",amount:m.gold24_10g},{purity:"22K",amount:m.gold22_10g},{purity:"18K",amount:m.gold18_10g}],
                   silver:[{purity:"999",amount:m.silver999_1kg}] }});
      } else {
        setManualActive(false);
        setData(json);
      }
    } catch(e:any) { setError(e?.message??"Network error"); setData(null); }
  }

  useEffect(()=>{
    loadRates();
    const fn=()=>loadRates();
    window.addEventListener("rates-updated",fn);
    window.addEventListener("storage",fn);
    const t=setInterval(loadRates,10*60_000);
    return ()=>{ clearInterval(t); window.removeEventListener("rates-updated",fn); window.removeEventListener("storage",fn); };
  },[]);

  const gold      = useMemo(()=>data?.prices?.gold??[],[data]);
  const silver    = useMemo(()=>data?.prices?.silver??[],[data]);
  const prevGold  = useMemo(()=>data?.prevPrices?.gold??[],[data]);
  const prevSilver= useMemo(()=>data?.prevPrices?.silver??[],[data]);

  // Build lookup maps for prev day amounts
  const prevGoldMap  = useMemo(()=>Object.fromEntries(prevGold.map(r=>[r.purity,r.amount])),  [prevGold]);
  const prevSilverMap= useMemo(()=>Object.fromEntries(prevSilver.map(r=>[r.purity,r.amount])),[prevSilver]);

  const rateDate   = data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"}) : "—";
  const lastUpdate = data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}) : "—";
  const wa = siteConfig.whatsapp.replace(/\D/g,"");

  return (
    <>
      <Header />

      {/* STICKY PAGE NAV */}
      <div className="page-nav-bar">
        <div className="page-nav">
          <Link href="/">Home</Link>
          <Link href="/shop">Collection</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>

      {/* ── HERO · LEFT RATES / RIGHT PHOTO ── */}
      <div style={{ position:"relative", width:"100%", minHeight:"clamp(500px,62vw,720px)", overflow:"hidden" }}>

        {/* Photo — anchored right so bride + jewellery is on the right side */}
        <img src="/gold3.jpg" alt="Gold Mania Hyderabad"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"78% 20%", display:"block" }} />

        {/* LEFT→RIGHT gradient: fully dark left (rates area) → transparent right (photo shows) */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(5,5,3,1) 0%, rgba(5,5,3,0.98) 30%, rgba(5,5,3,0.85) 50%, rgba(5,5,3,0.35) 70%, rgba(5,5,3,0) 88%)" }} />
        {/* Soft top+bottom vignette for polish */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(5,5,3,0.4) 0%, transparent 20%, transparent 80%, rgba(5,5,3,0.5) 100%)" }} />

        {/* CONTENT — left half only */}
        <div style={{
          position:"relative", zIndex:2,
          height:"100%", minHeight:"clamp(500px,62vw,720px)",
          display:"flex", flexDirection:"column", justifyContent:"center",
          padding:"clamp(24px,4vw,52px) clamp(16px,5vw,52px)",
          maxWidth:"clamp(320px,52vw,660px)",
        }}>

          {/* Brand */}
          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ height:1, width:28, background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.5))" }} />
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.38em", textTransform:"uppercase", color:"rgba(201,168,76,0.7)" }}>Hyderabad · Since 2000</span>
            </div>
            <div style={{ fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:"clamp(28px,4.5vw,58px)", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", background:"linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1.05 }}>
              Gold Mania
            </div>
            <div style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(12px,1.8vw,17px)", fontStyle:"italic", color:"rgba(245,237,214,0.45)", letterSpacing:"0.07em", marginTop:5 }}>
              Where Gold Meets Luxury
            </div>
          </div>

          {/* Table meta row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:4, marginBottom:7 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B5C3A" }}>◆ Live Rates</span>
              <span className="badge badge-live" style={{ fontSize:9, padding:"2px 7px" }}><span className="live-dot"/>Live</span>
              {manualActive && <span className="badge badge-gold" style={{ fontSize:9, padding:"2px 7px" }}>Admin</span>}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:9, color:"#4a3e28" }}>{rateDate} · {lastUpdate}</span>
              <button onClick={loadRates} style={{ background:"transparent", border:"1px solid rgba(212,175,55,0.2)", borderRadius:999, color:"#6B5C3A", fontSize:9, padding:"2px 9px", cursor:"pointer", letterSpacing:"0.1em", fontWeight:700 }}>↻</button>
            </div>
          </div>

          {error && <div className="error" style={{ marginBottom:6 }}>{error}</div>}

          {/* RATE TABLE */}
          <div style={{ background:"rgba(5,5,3,0.72)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", border:"1px solid rgba(212,175,55,0.22)", borderRadius:12, overflow:"hidden" }}>

            {/* Col headers */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 66px", background:"rgba(212,175,55,0.06)", borderBottom:"1px solid rgba(212,175,55,0.1)", padding:"7px 14px" }}>
              {["Purity","Today / 1g","Yesterday / 1g","Chg"].map((h,i)=>(
                <div key={h} style={{ fontSize:8, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#5C4E30", textAlign:i>0?"center":"left" }}>{h}</div>
              ))}
            </div>

            {/* GOLD */}
            {gold.length === 0 && !error
              ? <div style={{ padding:"18px", textAlign:"center", color:"#4a3e28", fontStyle:"italic", fontSize:12 }}>Fetching rates…</div>
              : gold.map(r=>{
                  const todayG = r.amount / 10;
                  const prevG  = prevGoldMap[r.purity] ? prevGoldMap[r.purity] / 10 : null;
                  const diff   = prevG !== null ? todayG - prevG : null;
                  const isUp   = diff !== null && diff > 0;
                  return (
                    <div key={r.purity} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 66px", padding:"10px 14px", borderBottom:"1px solid rgba(212,175,55,0.06)", alignItems:"center" }}>
                      <div>
                        <div style={{ fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:15, fontWeight:900, background:"linear-gradient(135deg,#8B6914,#D4AF37,#F0D060)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1 }}>{r.purity}</div>
                        <div style={{ fontSize:9, color:"#4a3e28", marginTop:2 }}>{PURITY_DESC[r.purity]??""}</div>
                      </div>
                      <div style={{ textAlign:"center", fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:"clamp(12px,1.7vw,16px)", fontWeight:700, color:"#D4AF37" }}>{formatINR(Math.round(todayG))}</div>
                      <div style={{ textAlign:"center", fontSize:12, color:"#4a3e28", fontWeight:600 }}>{prevG !== null ? formatINR(Math.round(prevG)) : "—"}</div>
                      <div style={{ textAlign:"center" }}>
                        {diff !== null && diff !== 0
                          ? <span style={{ fontSize:10, fontWeight:700, color:isUp?"#4CAF50":"#ef5350" }}>{isUp?"▲":"▼"}{formatINR(Math.abs(Math.round(diff)))}</span>
                          : <span style={{ color:"#2d2619", fontSize:10 }}>—</span>}
                      </div>
                    </div>
                  );
                })
            }

            {/* Silver divider */}
            <div style={{ padding:"4px 14px", background:"rgba(160,160,160,0.04)", borderTop:"1px solid rgba(140,140,140,0.1)", borderBottom:"1px solid rgba(140,140,140,0.1)" }}>
              <span style={{ fontSize:8, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#3a3a3a" }}>◇ Silver — Per 10 Grams</span>
            </div>

            {/* SILVER */}
            {silver.map(r=>{
              const todayG = r.amount / 100;
              const prevG  = prevSilverMap[r.purity] ? prevSilverMap[r.purity] / 100 : null;
              const diff   = prevG !== null ? todayG - prevG : null;
              const isUp   = diff !== null && diff > 0;
              return (
                <div key={r.purity} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 66px", padding:"10px 14px", alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:15, fontWeight:900, color:"#888", lineHeight:1 }}>Silver {r.purity}</div>
                    <div style={{ fontSize:9, color:"#4a3e28", marginTop:2 }}>Fine Silver · 99.9%</div>
                  </div>
                  <div style={{ textAlign:"center", fontSize:"clamp(12px,1.7vw,16px)", fontWeight:700, color:"#A0A0A0" }}>{formatINR(Math.round(todayG))}</div>
                  <div style={{ textAlign:"center", fontSize:12, color:"#4a3e28", fontWeight:600 }}>{prevG !== null ? formatINR(Math.round(prevG)) : "—"}</div>
                  <div style={{ textAlign:"center" }}>
                    {diff !== null && diff !== 0
                      ? <span style={{ fontSize:10, fontWeight:700, color:isUp?"#4CAF50":"#ef5350" }}>{isUp?"▲":"▼"}{formatINR(Math.abs(Math.round(diff)))}</span>
                      : <span style={{ color:"#2d2619", fontSize:10 }}>—</span>}
                  </div>
                </div>
              );
            })}

            {/* Footnote */}
            <div style={{ padding:"6px 14px", borderTop:"1px solid rgba(212,175,55,0.07)", background:"rgba(212,175,55,0.02)" }}>
              <span style={{ fontSize:8, color:"#2d2619", fontStyle:"italic" }}>Gold per 1g · Silver per 10g · Without GST · Add 3% for counter price</span>
            </div>
          </div>

        </div>
      </div>

      <main className="container">

        {/* ── WHY CHOOSE US ── */}
        <section style={{ marginTop:56 }}>
          <p className="section-label">Our Promise</p>
          <h2 className="section-title">Why Gold Mania</h2>
          <div className="gold-divider" style={{ maxWidth:220, margin:"10px auto 0" }}>
            <span className="gold-divider-icon">◆</span>
          </div>
          <div className="feature-grid">
            {siteConfig.features.map((f,i)=>(
              <div key={i} className="feature-item">
              