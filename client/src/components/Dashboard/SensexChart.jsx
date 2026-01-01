import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1D");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5001/api/sensex?range=${range}`
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

        const formatted = timestamps.map((t, i) => ({
          time:
            range === "1D"
              ? new Date(t * 1000).toLocaleTimeString()
              : new Date(t * 1000).toLocaleDateString(),

          value: prices[i],
        }));

        setData(formatted.filter((d) => d.value != null));
        setLoading(false);
      } catch (err) {
        console.error("Sensex Fetch Error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>📊 BSE Sensex</h2>
        <div style={styles.rangeButtons}>
          {["1D", "1W", "1M", "3M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                ...styles.rangeBtn,
                background: range === r ? "#2563eb" : "white",
                color: range === r ? "white" : "#2563eb",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: "330px" }}>
        {loading ? (
          <p style={styles.loading}>Loading Sensex data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

/* ========== Card Styling for Dashboard Integration ========== */

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    marginBottom: "25px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    alignItems: "center",
  },
  rangeButtons: {
    display: "flex",
    gap: "10px",
  },
  rangeBtn: {
    padding: "6px 14px",
    border: "1px solid #2563eb",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "12px",
  },
  loading: {
    textAlign: "center",
    marginTop: "120px",
    color: "#6b7280",
  },
};
