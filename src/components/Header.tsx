"use client";

import { siteConfig } from "@/config/siteConfig";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const wa = siteConfig.whatsapp.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${wa}`;

  return (
    <header className="site-header">
      {/* Top Info Bar */}
      <div style={{ backgroundColor: "#1e87a7", color: "white", padding: "8px 0", fontSize: 13 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>📍 {siteConfig.address}</div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href={`tel:${siteConfig.phone}`} style={{ color: "white", textDecoration: "none" }}>📞 {siteConfig.phone}</a>
            <a href={`mailto:${siteConfig.email}`} style={{ color: "white", textDecoration: "none" }}>✉️ {siteConfig.email}</a>
          </div>
        </div>
      </div>

      {/* Banner image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 180,
          overflow: "hidden",
        }}
      >
        <img
          src={siteConfig.bannerUrl}
          alt="Jewellery Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Light dark overlay to make text readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Center text */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            padding: "0 12px",
            color: "#fff",
            width: "100%",
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 900,
              letterSpacing: 1.5,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {siteConfig.brandName}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 14,
              color: "#f1f1f1",
              opacity: 0.95,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              fontStyle: "italic",
            }}
          >
            {siteConfig.tagline}
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: 14, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25D366",
                color: "#fff",
                textDecoration: "none",
                padding: "10px 18px",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 13,
                display: "inline-block",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              💬 WhatsApp Us
            </a>

            <Link
              href="/shop"
              style={{
                background: "#ffd700",
                color: "#000",
                textDecoration: "none",
                padding: "10px 18px",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 13,
                display: "inline-block",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              🛍️ Shop Now
            </Link>
          </div>
 
          {/* Navigation links */}
          <nav style={{ marginTop: 14, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop" },
              { href: "/contact", label: "Contact" },
              { href: "/admin", label: "Admin" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: pathname === item.href ? "#1e87a7" : "#fff",
                  background: pathname === item.href ? "#fff" : "rgba(255,255,255,0.16)",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: pathname === item.href ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Social Media Links Bar */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "12px 0", borderBottom: "1px solid #e0e0e0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Follow us:</span>
          {siteConfig.socialLinks.facebook && (
            <a href={siteConfig.socialLinks.facebook} target="_blank" rel="noreferrer" style={{ fontSize: 16, textDecoration: "none" }} title="Facebook">
              f
            </a>
          )}
          {siteConfig.socialLinks.instagram && (
            <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noreferrer" style={{ fontSize: 16, textDecoration: "none" }} title="Instagram">
              📷
            </a>
          )}
          {siteConfig.socialLinks.twitter && (
            <a href={siteConfig.socialLinks.twitter} target="_blank" rel="noreferrer" style={{ fontSize: 16, textDecoration: "none" }} title="Twitter">
              𝕏
            </a>
          )}
          {siteConfig.socialLinks.youtube && (
            <a href={siteConfig.socialLinks.youtube} target="_blank" rel="noreferrer" style={{ fontSize: 16, textDecoration: "none" }} title="YouTube">
              ▶️
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
