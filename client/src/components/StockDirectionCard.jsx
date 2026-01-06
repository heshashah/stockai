import React from "react";

export default function StockDirectionCard({ data }) {
  if (!data) return null;

  const { direction, confidence, reasons } = data.prediction;

  const color =
    direction === "BULLISH"
      ? "#16a34a"
      : direction === "BEARISH"
      ? "#dc2626"
      : "#ca8a04";

  return (
    <div style={{
      background: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
    }}>
      <h2 style={{ color }}>{direction}</h2>
      <p><strong>Confidence:</strong> {confidence}%</p>

      <h4>Reasons:</h4>
      <ul>
        {reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
