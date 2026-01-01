import React from "react";

export default function NewsFeed() {
  return (
    <div style={styles.card}>
      <h3 style={styles.header}>Latest Market News</h3>
      <p style={styles.text}>Live news feed will appear here…</p>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    height: "330px",
  },
  header: { margin: 0, marginBottom: "10px" },
  text: { color: "#777", marginTop: "80px", textAlign: "center" },
};
