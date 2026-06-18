"use client";

import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

const G = "linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)";

export default function Footer() {
  const wa = siteConfig.whatsapp.replace(/\D/g, "");

  return (
    <footer style={{
      background: "linear-gradient(180deg,#080806 0%,#050503 100%)",
      borderTop: "1px solid rgba(212,175,55,0.15)",
      fontFamily: "var(--font-inter,system-ui,sans-serif)",
      marginTop: 0,
    }}>

      {/* ── GOLD TOP BORDER ── */}
      <div style={{ height: 2, background: G }} />

      {/* ── MAIN FOOTER BODY ── */}
      <div style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "60px 24px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 40,
      }}>

        {/* BRAND COL */}
        <div>
          <div style={{
            fontFamily: "var(--font-playfair,Georgia,serif)",
            fontSize: 26,
            fontWeight: 900,
            background: G,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}>
            {siteConfig.brandName}
          </div>
          <p style={{
            fontFamily: "var(--font-cormorant,Georgia,serif)",
            fontSize: 14,
            fontStyle: "italic",
            color: "#6B5C3A",
            lineHeight: 1.7,
            marginBottom: 20,
          }}>
            {siteConfig.description}
          </p>
          {/* Social icons */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { href: siteConfig.socialLinks.instagram, label: "IG", icon: "◈" },
              { href: siteConfig.socialLinks.facebook,  label: "FB", icon: "◉" },
              { href: siteConfig.socialLinks.youtube,   label: "YT", icon: "▶" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: "1px solid rgba(212,175,55,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#6B5C3A", fontSize: 14, textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--gold,#D4AF37)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.2)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#6B5C3A";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* CONTACT COL */}
        <div>
          <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#D4AF37", marginBottom: 20 }}>
            Contact Us
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
            <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: "#D4AF37", fontSize: 14, marginTop: 1 }}>◆</span>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5C5040", marginBottom: 3 }}>Address</div>
                <span style={{ fontSize: 13, color: "#9A8866", lineHeight: 1.6 }}>{siteConfig.address}</span>
              </div>
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: "#D4AF37", fontSize: 14, marginTop: 1 }}>◆</span>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5C5040", marginBottom: 3 }}>Phone</div>
                <a href={`tel:${siteConfig.phone}`} style={{ fontSize: 13, color: "#9A8866", textDecoration: "none" }}>{siteConfig.phone}</a>
              </div>
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: "#D4AF37", fontSize: 14, marginTop: 1 }}>◆</span>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5C5040", marginBottom: 3 }}>Email</div>
                <a href={`mailto:${siteConfig.email}`} style={{ fontSize: 13, color: "#9A8866", textDecoration: "none" }}>{siteConfig.email}</a>
              </div>
            </li>
            <li>
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  marginTop: 4, padding: "9px 18px", borderRadius: 999,
                  background: "linear-gradient(135deg,#128C7E,#25D366)",
                  color: "#fff", textDecoration: "none",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                WhatsApp Us
              </a>
            </li>
          </ul>
        </div>

        {/* HOURS COL */}
        <div>
          <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#D4AF37", marginBottom: 20 }}>
            Business Hours
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(siteConfig.businessHours).map(([day, hrs]) => (
              <li key={day} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12 }}>
                <span style={{ color: "#5C5040", textTransform: "capitalize", letterSpacing: "0.04em" }}>{day}</span>
                <span style={{ color: "#9A8866" }}>{hrs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* QUICK LINKS COL */}
        <div>
          <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#D4AF37", marginBottom: 20 }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { href: "/",       label: "Today's Gold Rate" },
              { href: "/shop",   label: "Our Collection" },
              { href: "/contact",label: "Contact Us" },
              { href: "/admin",  label: "Admin Panel" },
            ].map(l => (
              <li key={l.href}>
                <Link href={l.href} style={{
                  fontSize: 13, color: "#6B5C3A", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "color 0.2s",
                }}>
                  <span style={{ color: "#D4AF37", fontSize: 8 }}>▶</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Purity info */}
          <div style={{ marginTop: 28, padding: "14px 16px", borderRadius: 10, border: "1px solid rgba(212,175,55,0.1)", background: "rgba(212,175,55,0.03)" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4AF37", marginBottom: 8 }}>Purity Guide</div>
            {[
              ["24K", "99.9% Pure Gold"],
              ["22K", "91.6% — Indian Standard"],
              ["18K", "75% — Mixed Alloy"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5C5040", marginBottom: 4 }}>
                <span style={{ color: "#9A8866", fontWeight: 600 }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ borderTop: "1px solid rgba(212,175,55,0.08)", padding: "18px 24px" }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ fontSize: 11, color: "#3a3020", letterSpacing: "0.04em" }}>
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </span>
          <span style={{ fontSize: 11, color: "#3a3020", letterSpacing: "0.04em" }}>
            Rates are indicative · Verify at counter
          </span>
        </div>
      </div>

    </footer>
  );
}
