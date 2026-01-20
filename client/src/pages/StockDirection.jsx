import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import MarketHeatmap from "../components/MarketHeatmap";
import AccuracyWidget from "../components/AccuracyWidget";
import StockDirectionCard from "../components/StockDirectionCard";

export default function StockDirection() {
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState("");
  const [heatmapSymbol, setHeatmapSymbol] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stockOptions = [
    { value: "AAPL", name: "Apple Inc.", sector: "Tech" },
    { value: "MSFT", name: "Microsoft", sector: "Tech" },
    { value: "GOOGL", name: "Alphabet", sector: "Tech" },
    { value: "AMZN", name: "Amazon", sector: "Retail" },
    { value: "TSLA", name: "Tesla", sector: "Auto" },
    { value: "META", name: "Meta", sector: "Tech" },
    { value: "NFLX", name: "Netflix", sector: "Media" },
    { value: "NVDA", name: "NVIDIA", sector: "Tech" }
  ];

  const predictDirection = async () => {
    if (!symbol) {
      setError("Please select a stock first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await axios.post("http://localhost:5001/api/direction", {
        symbol
      });

      setResult(res.data);
      setHeatmapSymbol(symbol);
    } catch {
      setError("Prediction failed. Backend not running.");
    } finally {
      setLoading(false);
    }
  };

  const selectedStock = stockOptions.find(s => s.value === symbol);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.page}
    >

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        style={styles.navbar}
      >
        <div style={styles.navLeft}>
          <motion.h3
            whileHover={{ scale: 1.05 }}
            style={styles.logo}
            onClick={() => navigate("/dashboard")}
          >
            StockAI
          </motion.h3>

          <div style={styles.navLinks}>
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Direction", path: "/direction" },
              { label: "Risk", path: "/risk" },
              { label: "Comparison", path: "/peer-comparison" },
              { label: "Information", path: "/information" },
              { label: "News", path: "/news" }
            ].map((item) => (
              <motion.span
                key={item.label}
                whileHover={{ scale: 1.05, color: "#4ade80" }}
                whileTap={{ scale: 0.95 }}
                style={styles.link}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </motion.span>
            ))}
          </div>
        </div>

        <div style={styles.navRight}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.phoneBtn}
          >
            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            1-800-366-9833
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(45, 212, 191, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            style={styles.contactBtn}
          >
            Contact us
          </motion.button>
        </div>
      </motion.nav>

      {/* BODY */}
      <div style={styles.body}>

        <h1 style={styles.title}>AI Stock Direction Predictor</h1>

        <div style={styles.grid}>

          {/* LEFT */}
          <div style={styles.card}>
            <h3>Select Stock</h3>

            <div style={styles.stockGrid}>
              {stockOptions.map(stock => (
                <div
                  key={stock.value}
                  style={{
                    ...styles.stockBox,
                    borderColor: symbol === stock.value ? "#10b981" : "#e5e7eb"
                  }}
                  onClick={() => {
                    setSymbol(stock.value);
                    setError("");
                  }}
                >
                  <b>{stock.value}</b>
                  <div style={{ fontSize: 12 }}>{stock.name}</div>
                </div>
              ))}
            </div>

            {selectedStock && (
              <div style={styles.selected}>
                {selectedStock.name} ({selectedStock.sector})
              </div>
            )}

            <button onClick={predictDirection} style={styles.predictBtn}>
              {loading ? "Predicting..." : "Predict"}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </div>

          {/* RIGHT */}
          <div style={styles.card}>
            <h3>Market Heatmap</h3>
            {heatmapSymbol ? (
              <MarketHeatmap symbol={heatmapSymbol} />
            ) : (
              <p>Select a stock to view heatmap</p>
            )}
          </div>

        </div>

        {result && <StockDirectionCard data={result} />}

      </div>
    </motion.div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Inter, sans-serif"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    height: "70px",
    background: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "40px"
  },

  logo: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "24px",
    fontWeight: "700",
    cursor: "pointer"
  },

  navLinks: {
    display: "flex",
    gap: "24px",
    fontSize: "14px",
    fontWeight: "500"
  },

  link: {
    color: "#4b5563",
    cursor: "pointer",
    transition: "color 0.2s",
    position: "relative",
    padding: "8px 0"
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },

  phoneBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    border: "1px solid #10b981",
    background: "transparent",
    color: "#10b981",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer"
  },

  contactBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)"
  },

  icon: {
    width: "16px",
    height: "16px"
  },

  body: {
    padding: "40px",
    maxWidth: 1200,
    margin: "auto"
  },

  title: {
    marginBottom: 20
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30
  },

  card: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },

  stockGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10
  },

  stockBox: {
    padding: 12,
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "center"
  },

  selected: {
    marginTop: 12,
    fontSize: 14,
    color: "#10b981"
  },

  predictBtn: {
    marginTop: 15,
    padding: "10px 20px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },

  error: {
    marginTop: 10,
    color: "red"
  }
};
