"use client";

import { siteConfig } from "@/config/siteConfig";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const G = "linear-gradient(135deg,#8B6914,#D4AF37,#F0D060,#C9A84C)";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close drawer on outside click
  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  const wa = siteConfig.whatsapp.replace(/\D/g, "");

  const nav = [
    { href: "/",        label: "Home" },
    { href: "/shop",    label: "Collection" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* ── ANNOUNCEMENT TICKER ── */}
      <div style={{
        background: G,
        padding: "7px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}>
        <div style={{
          display: "inline-block",
          animation: "ticker 28s linear infinite",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#0a0806",
        }}>
          {Array(4).fill("◆  Gold Mania Hyderabad  ·  Certified Hallmarked Gold  ·  Live Rates Updated Every 10 Minutes  ·  Custom Jewellery Orders Welcome  ·  Call +91 7981757384  ").join("")}
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header ref={drawerRef} style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: scrolled ? "rgba(5,5,3,0.98)" : "rgba(5,5,3,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(212,175,55,0.08)",
        transition: "all 0.35s ease",
        fontFamily: "var(--font-inter,system-ui,sans-serif)",
      }}>
        <div style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 20px",
          height: 66,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>

          {/* BRAND */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              fontFamily: "var(--font-playfair,Georgia,serif)",
              fontSize: "clamp(16px,3vw,22px)",
              fontWeight: 900,
              background: G,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              {siteConfig.brandName}
            </div>
            <div style={{
              fontFamily: "var(--font-cormorant,Georgia,serif)",
              fontSize: 9,
              fontStyle: "italic",
              color: "#4a3e28",
              letterSpacing: "0.2em",
              marginTop: 3,
            }}>
              HYDERABAD
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="hdr-desktop">
            {nav.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{
                  color: active ? "#0a0806" : "#6B5C3A",
                  background: active ? G : "transparent",
                  padding: "7px 16px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  border: active ? "none" : "1px solid transparent",
                  transition: "all 0.28s ease",
                  display: "inline-block",
                }}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"
              className="hdr-wa"
              style={{
                background: "linear-gradient(135deg,#128C7E,#25D366)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
              WhatsApp
            </a>

            {/* HAMBURGER */}
            {mounted && (
              <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                className="hdr-burger"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,175,55,0.25)",
                  borderRadius: 8,
                  color: "#D4AF37",
                  width: 40,
                  height: 40,
                  cursor: "p