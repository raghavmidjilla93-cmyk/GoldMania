import { siteConfig } from "@/config/siteConfig";
import Link from "next/link";

export default function Header() {
  const wa = siteConfig.whatsapp.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${wa}`;

  return (
    <header className="site-header">
      {/* Banner image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 160, // ✅ smaller height (change to 160 if you want more small)
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

        {/* Center text (not too big) */}
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
              fontSize: "clamp(36px, 6vw, 56px)", // 2x larger (was clamp(18px,3vw,28px))
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
              fontSize: 13,
              color: "#f1f1f1",
              opacity: 0.95,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            📞 {siteConfig.phone} &nbsp; • &nbsp; ✉ {siteConfig.email}
          </div>

          {/* WhatsApp button */}
          <div style={{ marginTop: 10 }}>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25D366",
                color: "#fff",
                textDecoration: "none",
                padding: "9px 14px",
                borderRadius: 999,
                fontWeight: 900,
                fontSize: 13,
                display: "inline-block",
                boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
              }}
            >
              WhatsApp
            </a>
          </div>
 
          {/* Navigation links */}
          <nav style={{ marginTop: 14 }}>
            <Link
              href="/"
              style={{
                background: "#fff",
                color: siteConfig.primaryColor,
                margin: "0 10px",
                fontWeight: 800,
                padding: "8px 12px",
                borderRadius: 999,
                textDecoration: "none",
                boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
              }}
            >
              Home
            </Link>

            <Link href="/shop" style={{ color: "#fff", margin: "0 10px", fontWeight: 700 }}>Shop</Link>
            <Link href="/contact" style={{ color: "#fff", margin: "0 10px", fontWeight: 700 }}>Contact Us</Link>
            <Link href="/admin" style={{ color: "#fff", margin: "0 10px", fontWeight: 700 }}>Admin</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
