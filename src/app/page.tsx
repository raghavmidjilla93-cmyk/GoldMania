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
type Purity = "24K" | "22K" | "18K";
type Item = {
  id: string; name: string; metal: "Gold" | "Silver";
  purity?: Purity; weightGrams: number; image?: string; wastagePercent?: number;
};
const PURITY_RATIO: Record<Purity, number> = { "24K": 1, "22K": 22/24, "18K": 18/24 };
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
  const [items, setItems] = useState<Item[]>([]);

  function readManual(): ManualRates|null {
    if (typeof window==="undefined") return null;
    try {
      const p = JSON.parse(localStorage.getItem("manualRates")||"{}") as ManualRates;
      if (Number.isFinite(p.gold24_10g) && p.gold24_10g > 0) {
        // Auto-derive 22K and 18K if not set
        return {
          gold24_10g: p.gold24_10g,
          gold22_10g: p.gold22_10g > 0 ? p.gold22_10g : Math.round(p.gold24_10g * 22/24),
          gold18_10g: p.gold18_10g > 0 ? p.gold18_10g : Math.round(p.gold24_10g * 18/24),
          silver999_1kg: p.silver999_1kg || 0,
        };
      }
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
    fetch("/api/items",{cache:"no-store"}).then(r=>r.json()).then(setItems).catch(()=>{});
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

  function priceFor(it: Item): number {
    if (it.metal === "Gold") {
      const g24_10g = gold.find(r=>r.purity==="24K")?.amount ?? 0;
      if (!g24_10g) return 0;
      const ratio = PURITY_RATIO[it.purity ?? "22K"];
      return Math.round((g24_10g / 10) * ratio * it.weightGrams * (1 + (it.wastagePercent ?? 0) / 100));
    }
    if (it.metal === "Silver") {
      const s_kg = silver.find(r=>r.purity==="999")?.amount ?? 0;
      if (!s_kg) return 0;
      return Math.round((s_kg / 1000) * it.weightGrams * (1 + (it.wastagePercent ?? 0) / 100));
    }
    return 0;
  }

  const featuredItems = items.slice(0, 6);

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
      <style>{`
        .hero-wrap { position:relative; width:100%; overflow:hidden; min-height:clamp(500px,62vw,720px); }
        .hero-img  { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:78% 20%; display:block; }
        /* Desktop: dark left → transparent right so photo shows on right */
        .hero-grad { position:absolute; inset:0; background:linear-gradient(to right,rgba(5,5,3,1) 0%,rgba(5,5,3,0.98) 30%,rgba(5,5,3,0.85) 50%,rgba(5,5,3,0.35) 70%,rgba(5,5,3,0) 88%); }
        .hero-vignette { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(5,5,3,0.4) 0%,transparent 20%,transparent 80%,rgba(5,5,3,0.5) 100%); }
        .hero-content { position:relative; z-index:2; height:100%; min-height:clamp(500px,62vw,720px); display:flex; flex-direction:column; justify-content:center; padding:clamp(24px,4vw,52px) clamp(16px,5vw,52px); max-width:clamp(320px,52vw,660px); }
        /* Mobile: photo shows at top, table at bottom */
        @media (max-width:640px) {
          .hero-wrap    { min-height:auto; }
          .hero-img     { position:relative; inset:unset; width:100%; height:56vw; min-height:210px; max-height:300px; object-position:center 18%; }
          .hero-grad    { background:linear-gradient(to bottom,rgba(5,5,3,0) 0%,rgba(5,5,3,0.55) 55%,#050503 100%); top:unset; bottom:0; height:80px; }
          .hero-vignette { display:none; }
          .hero-content { position:static; min-height:unset; height:auto; max-width:100%; justify-content:flex-start; padding:16px 14px 24px; background:#050503; }
          .rate-grid    { grid-template-columns:1fr 1fr 58px !important; }
          .rate-hdr     { grid-template-columns:1fr 1fr 58px !important; }
          .rate-col-prev { display:none !important; }
          .rate-hdr-prev { display:none !important; }
        }
      `}</style>
      <div className="hero-wrap">

        {/* Photo — anchored right so bride + jewellery is on the right side (desktop) */}
        <img src="/gold3.jpg" alt="Gold Mania Hyderabad" className="hero-img" />

        {/* Gradients */}
        <div className="hero-grad" />
        <div className="hero-vignette" />

        {/* CONTENT — left half on desktop, full-width below photo on mobile */}
        <div className="hero-content">

          {/* Brand */}
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <div style={{ height:1, width:22, background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.5))" }} />
              <span style={{ fontSize:8, fontWeight:700, letterSpacing:"0.32em", textTransform:"uppercase", color:"rgba(201,168,76,0.65)" }}>Hyderabad · Since 2000</span>
            </div>
            <div style={{ fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:"clamp(22px,4.5vw,58px)", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", background:"linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1.05 }}>
              Gold Mania
            </div>
            <div style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(11px,1.8vw,17px)", fontStyle:"italic", color:"rgba(245,237,214,0.4)", letterSpacing:"0.07em", marginTop:3 }}>
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
            <div className="rate-hdr" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 66px", background:"rgba(212,175,55,0.06)", borderBottom:"1px solid rgba(212,175,55,0.1)", padding:"7px 14px" }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#5C4E30" }}>Purity</div>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#5C4E30", textAlign:"center" }}>Today / 1g</div>
              <div className="rate-hdr-prev" style={{ fontSize:8, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#5C4E30", textAlign:"center" }}>Yesterday</div>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#5C4E30", textAlign:"center" }}>Chg</div>
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
                    <div key={r.purity} className="rate-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 66px", padding:"10px 14px", borderBottom:"1px solid rgba(212,175,55,0.06)", alignItems:"center" }}>
                      <div>
                        <div style={{ fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:15, fontWeight:900, background:"linear-gradient(135deg,#8B6914,#D4AF37,#F0D060)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1 }}>{r.purity}</div>
                        <div style={{ fontSize:9, color:"#4a3e28", marginTop:2 }}>{PURITY_DESC[r.purity]??""}</div>
                      </div>
                      <div style={{ textAlign:"center", fontFamily:"system-ui,sans-serif", fontSize:"clamp(13px,1.7vw,17px)", fontWeight:700, color:"#D4AF37" }}>{formatINR(Math.round(todayG))}</div>
                      <div className="rate-col-prev" style={{ textAlign:"center", fontSize:12, color:"#4a3e28", fontWeight:600 }}>{prevG !== null ? formatINR(Math.round(prevG)) : "—"}</div>
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
                <div key={r.purity} className="rate-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 66px", padding:"10px 14px", alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:15, fontWeight:900, color:"#888", lineHeight:1 }}>Silver {r.purity}</div>
                    <div style={{ fontSize:9, color:"#4a3e28", marginTop:2 }}>Fine Silver · 99.9%</div>
                  </div>
                  <div style={{ textAlign:"center", fontFamily:"system-ui,sans-serif", fontSize:"clamp(13px,1.7vw,17px)", fontWeight:700, color:"#A0A0A0" }}>{formatINR(Math.round(todayG))}</div>
                  <div className="rate-col-prev" style={{ textAlign:"center", fontSize:12, color:"#4a3e28", fontWeight:600 }}>{prevG !== null ? formatINR(Math.round(prevG)) : "—"}</div>
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
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED COLLECTION — admin items ── */}
        <section style={{ marginTop:44 }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <p className="section-label">Our Collection</p>
            <h2 className="section-title">Featured Jewellery</h2>
            <div className="gold-divider" style={{ maxWidth:220, margin:"10px auto 0" }}>
              <span className="gold-divider-icon">◆ ◆</span>
            </div>
          </div>

          {featuredItems.length === 0
            ? <div style={{ textAlign:"center", padding:"40px 0", color:"#4a3e28", fontStyle:"italic", fontSize:13 }}>Loading collection…</div>
            : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))", gap:16 }}>
                  {featuredItems.map(it => {
                    const price = priceFor(it);
                    const badge = it.metal === "Gold" ? (it.purity ?? "22K") : "Silver";
                    const badgeColor = it.metal === "Gold" ? "#D4AF37" : "#A0A0A0";
                    return (
                      <div key={it.id} style={{ background:"linear-gradient(160deg,#161409,#0c0c0a)", borderRadius:16, border:"1px solid rgba(212,175,55,0.12)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
                        {/* Image */}
                        <div style={{ height:200, overflow:"hidden", position:"relative", background:"linear-gradient(135deg,#1a1506,#0c0c0a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {it.image
                            ? <img src={it.image} alt={it.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }}
                                onMouseEnter={e=>(e.currentTarget as HTMLImageElement).style.transform="scale(1.06)"}
                                onMouseLeave={e=>(e.currentTarget as HTMLImageElement).style.transform="scale(1)"}
                              />
                            : <div style={{ textAlign:"center" }}>
                                <div style={{ fontSize:48, background:"linear-gradient(135deg,#8B6914,#D4AF37,#F0D060)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>◈</div>
                                <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.2em", color:"#3a3020", marginTop:6, textTransform:"uppercase" }}>{it.name}</div>
                              </div>
                          }
                          <div style={{ position:"absolute", inset:0, background:"linear-gradient(0deg,rgba(5,5,3,0.65),transparent 55%)", pointerEvents:"none" }} />
                          <div style={{ position:"absolute", top:10, left:10, padding:"3px 9px", borderRadius:999, background:"rgba(5,5,3,0.75)", border:`1px solid ${badgeColor}44`, fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:badgeColor }}>
                            {badge} · {it.metal.toUpperCase()}
                          </div>
                        </div>

                        {/* Info */}
                        <div style={{ padding:"16px 18px 18px", flex:1, display:"flex", flexDirection:"column", gap:7 }}>
                          <div style={{ fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:16, fontWeight:700, color:"#C9A84C", letterSpacing:"0.03em", lineHeight:1.3 }}>{it.name}</div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                            <span style={{ fontSize:10, color:"#4a3e28" }}>{it.weightGrams}g</span>
                            {(it.wastagePercent ?? 0) > 0 && <span style={{ fontSize:10, color:"#3a3020" }}>+{it.wastagePercent}% wastage</span>}
                            {price > 0 && (
                              <span style={{ fontFamily:"system-ui,sans-serif", fontSize:14, fontWeight:700, color:"#D4AF37", marginLeft:"auto" }}>
                                {formatINR(price)}
                              </span>
                            )}
                          </div>
                          <a href={`https://wa.me/${wa}?text=Hi, I'm interested in ${it.name} (${badge}, ${it.weightGrams}g). Please share details.`}
                            target="_blank" rel="noreferrer"
                            style={{ marginTop:"auto", display:"inline-flex", alignItems:"center", gap:5, padding:"8px 14px", borderRadius:999, background:"linear-gradient(135deg,#128C7E,#25D366)", color:"#fff", textDecoration:"none", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", width:"fit-content" }}>
                            ◆ Enquire on WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View all button */}
                <div style={{ textAlign:"center", marginTop:28 }}>
                  <Link href="/shop" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 28px", borderRadius:999, background:"linear-gradient(135deg,#8B6914,#D4AF37)", color:"#0a0806", textDecoration:"none", fontSize:12, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase" }}>
                    View Full Collection →
                  </Link>
                </div>
              </>
            )
          }
        </section>

        {/* ── TRUST STRIP ── */}
        <section style={{ marginTop:44, padding:"28px 24px", background:"linear-gradient(160deg,#161409,#0c0c0a)", borderRadius:16, border:"1px solid rgba(212,175,55,0.1)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,160px),1fr))", gap:20, textAlign:"center" }}>
            {[
              { icon:"◆", num:"25+", label:"Years in Hyderabad" },
              { icon:"◈", num:"10K+", label:"Happy Families" },
              { icon:"◇", num:"100%", label:"BIS Hallmarked" },
              { icon:"✦", num:"10 Min", label:"Rate Updates" },
            ].map(t=>(
              <div key={t.label}>
                <div style={{ fontSize:10, color:"#D4AF37", marginBottom:6, letterSpacing:"0.15em" }}>{t.icon}</div>
                <div style={{ fontFamily:"var(--font-playfair,Georgia,serif)", fontSize:26, fontWeight:900, background:"linear-gradient(135deg,#8B6914,#D4AF37,#F0D060)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1 }}>{t.num}</div>
                <div style={{ fontSize:11, color:"#5C5040", marginTop:4, letterSpacing:"0.06em" }}>{t.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── INFO ── */}
        <section className="info-section">
          <h2>About These Rates</h2>
          <p>
            Rates are sourced from IBJA (India Bullion &amp; Jewellers Association) with a Hyderabad local premium applied to match Sri Krishna &amp; Vardhaman Jewellers pricing.
            Gold is displayed <strong style={{ color:"var(--gold)" }}>per 1 gram</strong>, silver <strong style={{ color:"#C0C0C0" }}>per 10 grams</strong> — both <strong>without GST</strong> and without making charges.
            Add 3% GST for the final counter price.
            {data?.source && <> Source: <em style={{ color:"var(--fg-subtle)" }}>{data.source}</em>.</>}
          </p>
        </section>

        {/* ── SUBSCRIBE ── */}
        <section className="subscribe-section">
          <p className="section-label">Stay Informed</p>
          <h2 className="section-title" style={{ color:"var(--fg)" }}>Get Rate Alerts</h2>
          <div className="gold-divider" style={{ maxWidth:200, margin:"10px auto 0" }}>
            <span className="gold-divider-icon">◆</span>
          </div>
          <p style={{ marginTop:14, color:"var(--fg-subtle)", fontSize:14, fontStyle:"italic", fontFamily:"var(--font-cormorant,Georgia,serif)" }}>
            Receive live gold &amp; silver price alerts directly to your inbox.
          </p>
          <form className="subscribe-form" onSubmit={e=>e.preventDefault()}>
            <input className="input" placeholder="Your Name" type="text"/>
            <input className="input" placeholder="Your Area / City" type="text"/>
            <input className="input" placeholder="Email Address" type="email"/>
            <button type="submit" className="btn btn-gold">Subscribe for Alerts</button>
          </form>
        </section>

      </main>

      <Footer />

      {/* FLOATING WHATSAPP */}
      <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="wa-float" aria-label="WhatsApp">
        💬
      </a>
    </>
  );
}
