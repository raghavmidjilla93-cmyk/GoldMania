"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

const G = "linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)";

export default function HeroSlider() {
  const [index, setIndex]     = useState(0);
  const [prev,  setPrev]      = useState<number | null>(null);
  const [dir,   setDir]       = useState<1 | -1>(1);
  const [paused, setPaused]   = useState(false);

  const images = siteConfig.heroImages;
  const wa = siteConfig.whatsapp.replace(/\D/g, "");

  const go = useCallback((next: number, d: 1 | -1) => {
    setPrev(index);
    setDir(d);
    setIndex(next);
  }, [index]);

  const advance = useCallback(() => {
    go((index + 1) % images.length, 1);
  }, [index, images.length, go]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(advance, 5000);
    return () => clearInterval(t);
  }, [paused, advance]);

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 700);
    return () => clearTimeout(t);
  }, [index, prev]);

  const slide = images[index];
  const ctaHref = index === 1
    ? `https://wa.me/${wa}`
    : index === 2 ? "/" : "/shop";
  const ctaExternal = index === 1;

  return (
    <section
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        background: "#050503",
        border: "1px solid rgba(212,175,55,0.12)",
        height: "clamp(320px,42vw,520px)",
        marginTop: 16,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* ── OUTGOING SLIDE ── */}
      {prev !== null && (
        <div style={{
          position: "absolute", inset: 0,
          animation: `slideOut${dir > 0 ? "Left" : "Right"} 0.7s cubic-bezier(0.4,0,0.2,1) forwards`,
          zIndex: 1,
        }}>
          <img
            src={images[prev].url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(5,5,3,0.25) 0%,rgba(5,5,3,0.65) 50%,rgba(5,5,3,0.97) 100%)" }} />
        </div>
      )}

      {/* ── ACTIVE SLIDE ── */}
      <div style={{
        position: "absolute", inset: 0,
        animation: prev !== null ? `slideIn${dir > 0 ? "Right" : "Left"} 0.7s cubic-bezier(0.4,0,0.2,1) forwards` : "none",
        zIndex: 2,
      }}>
        <img
          src={slide.url}
          alt={slide.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(5,5,3,0.2) 0%,rgba(5,5,3,0.6) 45%,rgba(5,5,3,0.97) 100%)" }} />
        {/* Gold vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 100%,rgba(212,175,55,0.06),transparent 60%)" }} />

        {/* ── SLIDE CONTENT ── */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", alignItems: "center",
          textAlign: "center", padding: "0 20px 44px",
        }}>
          {/* Purity label pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 999,
            border: "1px solid rgba(212,175,55,0.3)",
            background: "rgba(5,5,3,0.5)",
            marginBottom: 14,
            animation: "fadeUp 0.5s ease both",
            animationDelay: "0.1s",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4AF37", display: "inline-block" }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: "#C9A84C", textTransform: "uppercase" }}>
              {slide.label}
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "var(--font-playfair,Georgia,serif)",
            fontSize: "clamp(22px,5vw,52px)",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: G,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
            margin: 0,
            animation: "fadeUp 0.55s ease both",
            animationDelay: "0.18s",
          }}>
            {slide.title}
          </h2>

          {/* Ornament */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            margin: "12px auto",
            animation: "fadeUp 0.55s ease both",
            animationDelay: "0.24s",
          }}>
            <div style={{ height: 1, width: "clamp(20px,4vw,40px)", background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.4))" }} />
            <span style={{ color: "#D4AF37", fontSize: 8 }}>◆</span>
            <div style={{ height: 1, width: "clamp(20px,4vw,40px)", background: "linear-gradient(90deg,rgba(212,175,55,0.4),transparent)" }} />
          </div>

          {/* Subtitle */}
          <p style={{
            fontFamily: "var(--font-cormorant,Georgia,serif)",
            fontSize: "clamp(12px,1.8vw,18px)",
            fontStyle: "italic",
            color: "rgba(245,237,214,0.6)",
            letterSpacing: "0.05em",
            margin: 0,
            animation: "fadeUp 0.55s ease both",
            animationDelay: "0.28s",
          }}>
            {slide.subtitle}
          </p>

          {/* CTA */}
          <div style={{
            marginTop: 22,
            animation: "fadeUp 0.55s ease both",
            animationDelay: "0.35s",
          }}>
            {ctaExternal ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "10px 28px", borderRadius: 999,
                  background: G, color: "#0a0806",
                  textDecoration: "none", fontSize: 11,
                  fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                  display: "inline-block",
                }}
              >
                {slide.cta}
              </a>
            ) : (
              <Link
                href={ctaHref}
                style={{
                  padding: "10px 28px", borderRadius: 999,
                  background: G, color: "#0a0806",
                  textDecoration: "none", fontSize: 11,
                  fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                  display: "inline-block",
                }}
              >
                {slide.cta}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── NAV ARROWS ── */}
      <button
        onClick={() => { setPaused(true); go((index - 1 + images.length) % images.length, -1); }}
        aria-label="Previous slide"
        style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          zIndex: 10, background: "rgba(5,5,3,0.6)",
          border: "1px solid rgba(212,175,55,0.25)", borderRadius: "50%",
          width: 40, height: 40, cursor: "pointer", color: "#D4AF37",
          fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.7)"; e.currentTarget.style.background = "rgba(5,5,3,0.85)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; e.currentTarget.style.background = "rgba(5,5,3,0.6)"; }}
      >
        ‹
      </button>

      <button
        onClick={() => { setPaused(true); go((index + 1) % images.length, 1); }}
        aria-label="Next slide"
        style={{
          position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
          zIndex: 10, background: "rgba(5,5,3,0.6)",
          border: "1px solid rgba(212,175,55,0.25)", borderRadius: "50%",
          width: 40, height: 40, cursor: "pointer", color: "#D4AF37",
          fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.7)"; e.currentTarget.style.background = "rgba(5,5,3,0.85)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; e.currentTarget.style.background = "rgba(5,5,3,0.6)"; }}
      >
        ›
      </button>

      {/* ── PROGRESS LINES ── */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        zIndex: 10, display: "flex", gap: 6, alignItems: "center",
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPaused(true); go(i, i > index ? 1 : -1); }}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              height: 2, width: i === index ? 32 : 16,
              border: "none", cursor: "pointer", padding: 0, borderRadius: 999,
              background: i === index
                ? "linear-gradient(90deg,#8B6914,#D4AF37,#F0D060)"
                : "rgba(212,175,55,0.2)",
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>

      {/* ── ANIMATIONS ── */}
      <style>{`
        @keyframes slideOutLeft  { to   { transform: translateX(-100%); opacity: 0; } }
        @keyframes slideOutRight { to   { transform: translateX(100%);  opacity: 0; } }
        @keyframes slideInRight  { from { transform: translateX(60px);  opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft   { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeUp        { from { transform: translateY(14px);  opacity: 0; } to { transform: translateY(0);  opacity: 1; } }
      `}</style>
    </section>
  );
}
