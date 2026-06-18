"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/siteConfig";
import { useState } from "react";

const G = "linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const wa = siteConfig.whatsapp.replace(/\D/g,"");

  return (
    <>
      <Header />

      <main className="container" style={{ paddingTop:48 }}>

        {/* ── HEADLINE ── */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <p className="section-label">Get In Touch</p>
          <h1 className="luxury-title">Contact Us</h1>
          <div className="gold-divider" style={{ maxWidth:240, margin:"14px auto" }}>
            <span className="gold-divider-icon">◆ ◆ ◆</span>
          </div>
          <p style={{ color:"var(--fg-subtle)", fontSize:14, fontStyle:"italic", fontFamily:"var(--font-cormorant,Georgia,serif)" }}>
            We&apos;re here to help with enquiries, custom orders and appointments.
          </p>
        </div>

        {/* ── INFO + FORM GRID ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,300px),1fr))", gap:24 }}>

          {/* CONTACT INFO */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Quick actions */}
            <div style={{
              padding:"26px 24px", borderRadius:"var(--radius-lg)",
              background:"var(--grad-card)", border:"1px solid rgba(212,175,55,0.1)",
            }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:18 }}>
                Quick Actions
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" style={{
                  display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
                  borderRadius:"var(--radius-sm)",
                  background:"linear-gradient(135deg,rgba(18,140,126,0.15),rgba(37,211,102,0.1))",
                  border:"1px solid rgba(37,211,102,0.2)", color:"#4ade80",
                  textDecoration:"none", fontSize:13, fontWeight:600, transition:"all 0.28s",
                }}>
                  <span style={{ fontSize:20 }}>💬</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:12, letterSpacing:"0.08em" }}>WhatsApp Us</div>
                    <div style={{ fontSize:11, color:"rgba(74,222,128,0.6)", marginTop:2 }}>{siteConfig.whatsapp}</div>
                  </div>
                </a>
                <a href={`tel:${siteConfig.phone}`} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
                  borderRadius:"var(--radius-sm)",
                  background:"rgba(212,175,55,0.04)", border:"1px solid rgba(212,175,55,0.14)",
                  color:"var(--fg-muted)", textDecoration:"none", fontSize:13, fontWeight:600,
                  transition:"all 0.28s",
                }}>
                  <span style={{ fontSize:20 }}>📞</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:12, letterSpacing:"0.08em", color:"var(--gold)" }}>Call Us</div>
                    <div style={{ fontSize:11, color:"var(--fg-subtle)", marginTop:2 }}>{siteConfig.phone}</div>
                  </div>
                </a>
                <a href={`mailto:${siteConfig.email}`} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
                  borderRadius:"var(--radius-sm)",
                  background:"rgba(212,175,55,0.04)", border:"1px solid rgba(212,175,55,0.14)",
                  color:"var(--fg-muted)", textDecoration:"none", fontSize:13, fontWeight:600,
                }}>
                  <span style={{ fontSize:20 }}>✉️</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:12, letterSpacing:"0.08em", color:"var(--gold)" }}>Email Us</div>
                    <div style={{ fontSize:11, color:"var(--fg-subtle)", marginTop:2 }}>{siteConfig.email}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Address + Hours */}
            <div style={{
              padding:"26px 24px", borderRadius:"var(--radius-lg)",
              background:"var(--grad-card)", border:"1px solid rgba(212,175,55,0.1)",
              flex:1,
            }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:18 }}>
                Visit Us
              </div>
              <p style={{ color:"var(--fg-muted)", fontSize:13, lineHeight:1.7, marginBottom:20 }}>
                {siteConfig.address}
              </p>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:14 }}>
                Business Hours
              </div>
              {Object.entries(siteConfig.businessHours).map(([day,hrs])=>(
                <div key={day} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:8 }}>
                  <span style={{ color:"var(--fg-subtle)", textTransform:"capitalize" }}>{day}</span>
                  <span style={{ color:"var(--fg-muted)" }}>{hrs}</span>
                </div>
              ))}
            </div>

          </div>

          {/* MESSAGE FORM */}
          <div style={{
            padding:"32px 28px", borderRadius:"var(--radius-lg)",
            background:"var(--grad-card)", border:"1px solid rgba(212,175,55,0.1)",
          }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>
              Send a Message
            </div>
            <p style={{ fontSize:13, color:"var(--fg-subtle)", marginBottom:24, lineHeight:1.6 }}>
              For custom orders, bulk enquiries or appointments — we reply within 24 hours.
            </p>

            {sent ? (
              <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <div style={{ fontSize:40, marginBottom:16 }}>✉️</div>
                <div style={{ fontFamily:"var(--font-display,Georgia,serif)", fontSize:22, color:"var(--gold)", marginBottom:8 }}>
                  Message Sent
                </div>
                <p style={{ color:"var(--fg-subtle)", fontSize:13 }}>We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form style={{ display:"grid", gap:12 }} onSubmit={e=>{e.preventDefault();setSent(true);}}>
                <input className="input" placeholder="Your Full Name" type="text" required />
                <input className="input" placeholder="Phone Number" type="tel" />
                <input className="input" placeholder="Email Address" type="email" />
                <input className="input" placeholder="Subject (e.g. Custom Necklace)" type="text" />
                <textarea className="input" placeholder="Your Message…" rows={5} />
                <button type="submit" className="btn btn-gold" style={{ marginTop:4 }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
