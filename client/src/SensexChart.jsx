import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SensexChart() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [range, setRange] = useState("1D");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5002/api/sensex?range=${range}`
        );

        const result = res.data.chart?.result?.[0];

        if (
          !result ||
          !result.timestamp ||
          !result.indicators?.quote?.[0]?.close
        ) {
          console.error("Invalid data format", res.data);
          setLoading(false);
          return;
        }

        const timestamps = result.timestamp;
        const prices = result.indicators.quote[0].close;

        const formatted = [];

        for (let i = 0; i < timestamps.length; i++) {
          if (prices[i] !== null && prices[i] !== undefined) {
            formatted.push({
              time:
                range === "1D"
                  ? new Date(timestamps[i] * 1000).toLocaleTimeString()
                  : new Date(timestamps[i] * 1000).toLocaleDateString(),
              value: prices[i],
            });
          }
        }

        console.log("Formatted data length:", formatted.length);

        setData(formatted);
        setLoading(false);
      } catch (err) {
        console.error("Sensex Fetch Error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/dashboard")}>
            Dashboard
          </span>
          <span style={styles.link}>Sensex</span>
          <span style={styles.link}>Industries</span>
          <span style={styles.link}>People</span>
          <span style={styles.link}>Insights</span>
          <span style={styles.link} onClick={() => navigate("/information")}>
            Information
          </span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        <h1>BSE Sensex</h1>
        <p style={{ marginBottom: "25px", color: "#666" }}>
          Live market performance of Sensex
        </p>

        {/* RANGE BUTTONS */}
        <div style={styles.rangeButtons}>
          {["1D", "1W", "1M"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                ...styles.rangeBtn,
                background: range === r ? "#007bff" : "white",
                color: range === r ? "white" : "#007bff",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* CHART */}
        <div style={styles.chartBox}>
          {loading ? (
            <p style={{ textAlign: "center", marginTop: "180px", color: "#888" }}>
              Loading Sensex data...
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#007bff"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f5",
    fontFamily: "Poppins, sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 50px",
    background: "#2f4f3e",
    color: "white",
    alignItems: "center",
  },
  logo: {
    fontWeight: "600",
    fontSize: "18px",
  },
  navLinks: {
    display: "flex",
    gap: "25px",
    fontSize: "14px",
  },
  link: {
    cursor: "pointer",
  },
  phoneBtn: {
    marginRight: "12px",
    padding: "8px 16px",
    border: "1px solid white",
    background: "transparent",
    color: "white",
    borderRadius: "6px",
  },
  contactBtn: {
    padding: "8px 16px",
    background: "white",
    color: "#2f4f3e",
    borderRadius: "6px",
    fontWeight: "600",
  },
  body: {
    padding: "50px 80px",
  },
  rangeButtons: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  rangeBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #007bff",
    cursor: "pointer",
  },
  chartBox: {
    height: "450px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};
