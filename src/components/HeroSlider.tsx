"use client";

import { useEffect, useState } from "react";

const images = ["/gold1.png",  "/gold3.jpg"];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(t);
  }, []);

  return (
    <section
      style={{
        marginTop: 14,
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #ddd",
      }}
    >
      <img
        src={images[index]}
        alt="Gold"
        style={{
          width: "100%",
          height: 260,
          objectFit: "cover",
          display: "block",
        }}
      />
    </section>
  );
}
