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

        {/*