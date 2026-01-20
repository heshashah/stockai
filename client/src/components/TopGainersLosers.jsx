import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function TopGainersLosers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gainers");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5004/gainers-losers");
        setData(res.data);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load market movers:", e);
        setData(null);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatChange = (change) => {
    const num = parseFloat(change);
    return num > 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.card}
    >
      <div style={styles.header}>
        <h2 style={styles.title}>Market Movers</h2>
        <div style={styles.tabs}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("gainers")}
            style={{
              ...styles.tabButton,
              background: activeTab === "gainers" ? "#10b981" : "#f3f4f6",
              color: activeTab === "gainers" ? "white" : "#374151"
            }}
          >
            Gainers
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("losers")}
            style={{
              ...styles.tabButton,
              background: activeTab === "losers" ? "#ef4444" : "#f3f4f6",
              color: activeTab === "losers" ? "white" : "#374151"
            }}
          >
            Losers
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading market data...</p>
        </div>
      ) : !data ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>Failed to load data</p>
        </div>
      ) : (
        <div style={styles.content}>
          {activeTab === "gainers" ? (
            <div style={styles.listContainer}>
              {data.gainers.map((g, index) => (
                <motion.div
                  key={g.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "#f0fdf4" }}
                  style={styles.listItem}
                >
                  <div style={styles.symbolContainer}>
                    <div style={styles.rankBadge}>#{index + 1}</div>
                    <span style={styles.symbol}>{g.symbol}</span>
                  </div>
                  <div style={styles.changeContainer}>
                    <span style={styles.changePositive}>
                      {formatChange(g.change)}
                    </span>
                    <div style={styles.price}>{g.price ? `$${parseFloat(g.price).toFixed(2)}` : 'N/A'}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={styles.listContainer}>
              {data.losers.map((l, index) => (
                <motion.div
                  key={l.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "#fef2f2" }}
                  style={styles.listItem}
                >
                  <div style={styles.symbolContainer}>
                    <div style={styles.rankBadge}>#{index + 1}</div>
                    <span style={styles.symbol}>{l.symbol}</span>
                  </div>
                  <div style={styles.changeContainer}>
                    <span style={styles.changeNegative}>
                      {formatChange(l.change)}
                    </span>
                    <div style={styles.price}>{l.price ? `$${parseFloat(l.price).toFixed(2)}` : 'N/A'}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={styles.footer}>
        <span style={styles.footerText}>Updated just now</span>
        <span style={styles.refreshIcon}>⟳</span>
      </div>
    </motion.div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    margin: 0
  },
  tabs: {
    display: "flex",
    gap: "8px"
  },
  tabButton: {
    padding: "6px 16px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    marginBottom: "16px",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    fontSize: "14px",
    color: "#6b7280"
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0"
  },
  errorIcon: {
    fontSize: "32px",
    marginBottom: "12px"
  },
  errorText: {
    fontSize: "14px",
    color: "#ef4444"
  },
  content: {
    minHeight: "200px"
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderRadius: "10px",
    background: "#fafafa",
    cursor: "pointer",
    transition: "background-color 0.2s"
  },
  symbolContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  rankBadge: {
    width: "28px",
    height: "28px",
    background: "#f3f4f6",
    color: "#6b7280",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600"
  },
  symbol: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827"
  },
  changeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px"
  },
  changePositive: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#10b981"
  },
  changeNegative: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#ef4444"
  },
  price: {
    fontSize: "12px",
    color: "#6b7280"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb"
  },
  footerText: {
    fontSize: "12px",
    color: "#9ca3af"
  },
  refreshIcon: {
    fontSize: "14px",
    color: "#9ca3af",
    cursor: "pointer"
  }
};