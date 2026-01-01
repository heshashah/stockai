import React from "react";

export default function IPOMini() {
  return (
    <div style={styles.card}>
      <h3 style={styles.header}>Upcoming IPO Predictions</h3>
      <p style={styles.text}>IPO predictions module will load here…</p>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    height: "300px",
  },
  header: { margin: 0, marginBottom: "10px" },
  text: { color: "#777", marginTop: "60px", textAlign: "center" },
};
