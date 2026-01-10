import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MarketHeatmap({ symbol }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) return;

    setLoading(true);
    setError("");

    axios
      .get(`http://localhost:5007/api/market-heatmap?symbol=${symbol}`, {
        timeout: 8000, // ⏱ prevent infinite loading
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Heatmap error:", err);
        setError("Failed to load heatmap");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [symbol]);

  // --------------------
  // UI STATES
  // --------------------
  if (loading) return <p>Loading heatmap...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!data || !data.heatmap)
    return <p>No heatmap data available.</p>;

  const getColor = (d) => {
    if (d === "BULLISH") return "#16a34a";
    if (d === "BEARISH") return "#dc2626";
    return "#ca8a04";
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "30px",
      }}
    >
      <h2>Market Direction Heatmap</h2>
      <p style={{ color: "#555" }}>
        Sector: <strong>{data.sector}</strong>
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {Object.entries(data.heatmap).map(([sym, dir]) => (
          <div
            key={sym}
            style={{
              background: getColor(dir),
              color: "white",
              padding: "14px 18px",
              borderRadius: "10px",
              minWidth: "110px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {sym}
            <br />
            <span style={{ fontSize: "13px", fontWeight: "400" }}>
              {dir}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
