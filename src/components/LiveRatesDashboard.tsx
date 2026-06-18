"use client";

import { useEffect, useState } from "react";

export default function LiveRatesDashboard() {
  const [data, setData] = useState<any>(null);
  const [prev, setPrev] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/rates");

      const json = await res.json();

      // ❗ HANDLE API ERROR RESPONSE
      if (!res.ok || !json.gold) {
        setError(json.error || "Failed to load rates");
        return;
      }

      setError(null);
      setPrev(data);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  function getChange(curr: number, key: string) {
    if (!prev) return null;
    const old = prev?.gold?.[key];
    if (!old) return null;

    return curr > old ? "up" : curr < old ? "down" : "same";
  }

  if (error) {
    return (
      <div style={{ color: "red", padding: 20 }}>
        ⚠️ {error}
      </div>
    );
  }

  if (!data?.gold) {
    return <div>Loading live rates...</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16, background: "#111", color: "#fff", borderRadius: 12 }}>
      <h2 style={{ color: "#D4AF37" }}>
        💎 Live Gold Rates - {data.city}
      </h2>

      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Updated: {new Date(data.updatedAt).toLocaleTimeString()}{" "}
        {data.cached ? "(cached)" : "(live)"}
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {Object.entries(data.gold).map(([key, value]: any) => {
          const change = getChange(value, key);

          return (
            <div key={key} style={{ padding: 12, borderRadius: 10, background: "#1a1a1a", display: "flex", justifyContent: "space-between" }}>
              <span>{key}</span>

              <span>
                ₹ {value} {change === "up" && "▲"} {change === "down" && "▼"}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 15, opacity: 0.8 }}>
        Silver (1kg): ₹ {data.silver?.["1kg"] ?? "N/A"}
      </div>
    </div>
  );
}