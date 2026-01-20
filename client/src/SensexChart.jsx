import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine
} from "recharts";

export default function SensexChart() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1W");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://localhost:5001/api/sensex?range=${range}`
        );

        const result = res.data.chart?.result?.[0];

        if (
          !result ||
          !result.timestamp ||
          !result.indicators?.quote?.[0]?.close
        ) {
          setError("No data available for this time range.");
          setLoading(false);
          return;
        }

        const timestamps = result.timestamp;
        const prices = result.indicators.quote[0].close;

        const formatted = [];
        let sum = 0;
        let validCount = 0;

        for (let i = 0; i < timestamps.length; i++) {
          if (prices[i] !== null && prices[i] !== undefined) {
            const date = new Date(timestamps[i] * 1000);
            formatted.push({
              time: date,
              value: prices[i],
              displayTime: range === "1D" ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
            });
            sum += prices[i];
            validCount++;
          }
        }

        if (formatted.length === 0) {
          setError("No market data available.");
          setLoading(false);
          return;
        }

        const latestPrice = formatted[formatted.length - 1].value;
        const earliestPrice = formatted[0].value;
        const change = latestPrice - earliestPrice;
        const changePercent = (change / earliestPrice) * 100;

        setCurrentPrice(latestPrice);
        setPriceChange({ value: change, percent: changePercent });
        setData(formatted);
        setLoading(false);

      } catch (err) {
        console.error("Sensex Fetch Error:", err);
        setError("Failed to load Sensex data.");
        setLoading(false);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, 20000);
    return () => clearInterval(intervalId);
  }, [range]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipTime}>{label}</p>
          <p style={styles.tooltipPrice}>
            ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.page}
    >
      {/* COMPACT NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <h3 style={styles.logo}>StockAI</h3>
          <div style={styles.navLinks}>
            {["Dashboard", "Direction", "Risk", "Comparison", "Information", "News"].map((item) => (
              <motion.span
                key={item}
                whileHover={{ y: -2 }}
                style={{
                  ...styles.link,
                  fontWeight: "400",
                  color: "#374151"
                }}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
        <div style={styles.navRight}>
          <span style={styles.phoneText}>1-800-366-9833</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.contactBtn}
          >
            Contact us
          </motion.button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.content}>
        {/* HEADER */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.header}
        >
          <div>
            <h1 style={styles.title}>BSE Sensex</h1>
            <p style={styles.subtitle}>Live market performance of Sensex Index</p>
          </div>
          
          {currentPrice && priceChange && (
            <div style={styles.priceInfo}>
              <div style={styles.currentPrice}>
                ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{
                ...styles.priceChange,
                color: priceChange.value >= 0 ? "#10b981" : "#ef4444"
              }}>
                {priceChange.value >= 0 ? "+" : ""}{priceChange.value.toFixed(2)} 
                ({priceChange.percent.toFixed(2)}%)
              </div>
            </div>
          )}
        </motion.div>

        {/* CHART CARD */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={styles.chartCard}
        >
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>Market Performance</h2>
            <div style={styles.rangeButtons}>
              {["1W", "1M"].map((r) => (
                <motion.button
                  key={r}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRange(r)}
                  style={{
                    ...styles.rangeBtn,
                    background: range === r ? "#10b981" : "white",
                    color: range === r ? "white" : "#374151",
                    borderColor: range === r ? "#10b981" : "#e5e7eb"
                  }}
                >
                  {r}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={styles.chartContainer}>
            {loading ? (
              <div style={styles.chartLoading}>
                <div style={styles.spinner} />
                <p>Loading market data...</p>
              </div>
            ) : error ? (
              <div style={styles.chartError}>
                <div style={styles.errorIcon}>⚠️</div>
                <p>{error}</p>
              </div>
            ) : data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="displayTime" 
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="none"
                    fill="url(#colorValue)"
                    fillOpacity={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
                  />
                  {currentPrice && (
                    <ReferenceLine 
                      y={currentPrice} 
                      stroke="#10b981" 
                      strokeDasharray="3 3" 
                      strokeOpacity={0.5}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          <div style={styles.chartFooter}>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statLabel}>All Time High</span>
                <span style={styles.statValue}>₹74,245.17</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>52W Low</span>
                <span style={styles.statValue}>₹57,084.91</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>Market Cap</span>
                <span style={styles.statValue}>₹332.4T</span>
              </div>
            </div>
            <div style={styles.updateInfo}>
              <span style={styles.updateText}>Live data • Auto-refreshes every 20s</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
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
    fontSize: "22px",
    fontWeight: "700"
  },
  navLinks: {
    display: "flex",
    gap: "24px",
    fontSize: "14px",
    fontWeight: "500"
  },
  link: {
    cursor: "pointer",
    transition: "all 0.2s",
    padding: "6px 0"
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  phoneText: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500"
  },
  contactBtn: {
    padding: "8px 20px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)"
  },
  content: {
    padding: "32px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px"
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280"
  },
  priceInfo: {
    textAlign: "right"
  },
  currentPrice: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px"
  },
  priceChange: {
    fontSize: "16px",
    fontWeight: "600"
  },
  chartCard: {
    background: "white",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb"
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px"
  },
  chartTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827"
  },
  rangeButtons: {
    display: "flex",
    gap: "12px"
  },
  rangeBtn: {
    padding: "8px 20px",
    border: "2px solid",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  chartContainer: {
    height: "400px",
    marginBottom: "32px"
  },
  chartLoading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#6b7280"
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
  chartError: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#ef4444"
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  tooltip: {
    background: "white",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb"
  },
  tooltipTime: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "4px"
  },
  tooltipPrice: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827"
  },
  chartFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb"
  },
  stats: {
    display: "flex",
    gap: "32px"
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  statLabel: {
    fontSize: "12px",
    color: "#6b7280"
  },
  statValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827"
  },
  updateInfo: {
    textAlign: "right"
  },
  updateText: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "500"
  }
};

// Add CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);