"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/siteConfig";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const images = siteConfig.heroImages;

  useEffect(() => {
    if (!autoPlay) return;
    
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(t);
  }, [autoPlay, images.length]);

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    setAutoPlay(false);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
    setAutoPlay(false);
  };

  const goToSlide = (i: number) => {
    setIndex(i);
    setAutoPlay(false);
  };

  return (
    <section
      style={{
        marginTop: 16,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        position: "relative",
        backgroundColor: "#f5f5f5",
      }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Main image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={images[index]?.url || "/banner.png"}
          alt={images[index]?.title || "Slide"}
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            display: "block",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        />

        {/* Overlay text */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
            padding: "24px 16px",
            color: "white",
          }}
        >
          <h2 style={{ margin: "0 0 4px 0", fontSize: 22, fontWeight: 700 }}>
            {images[index]?.title || "Premium Jewelry"}
          </h2>
          <p style={{ margin: "0 0 12px 0", fontSize: 14, opacity: 0.9 }}>
            {images[index]?.subtitle || "Quality jewelry collection"}
          </p>
          {images[index]?.cta && (
            <a
              href="/shop"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#ffd700",
                color: "#000",
                textDecoration: "none",
                borderRadius: 4,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {images[index].cta} →
            </a>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "none",
          width: 40,
          height: 40,
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: 20,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s",
          zIndex: 10,
        }}
        onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "white")}
        onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.8)")}
        title="Previous slide"
      >
        ◀
      </button>

      <button
        onClick={next}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "none",
          width: 40,
          height: 40,
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: 20,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s",
          zIndex: 10,
        }}
        onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "white")}
        onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.8)")}
        title="Next slide"
      >
        ▶
      </button>

      {/* Dots indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            style={{
              width: i === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              backgroundColor: i === index ? "#ffd700" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            title={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0.8;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
