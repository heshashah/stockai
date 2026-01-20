import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

export default function SectorPerformance() {
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSector, setHoveredSector] = useState(null);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const res = await axios.get("http://localhost:5003/sector");
        setSectorData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Sector Fetch Error:", err);
        setError("Failed to load sector performance data");
        setLoading(false);
      }
    };

    fetchSectorData();
    const interval = setInterval(fetchSectorData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getColor = (value) => {
    if (value >= 8) return "#059669"; // Dark green for high performance
    if (value >= 4) return "#10b981"; // Green for good performance
    if (value >= 0) return "#f59e0b"; // Yellow for neutral
    if (value >= -4) return "#f97316"; // Orange for negative
    return "#ef4444"; // Red for very negative
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipLabel}>{label}</p>
          <p style={styles.tooltipValue}>
            Performance: <span style={{ color: getColor(payload[0].value), fontWeight: 700 }}>
              {payload[0].value}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={styles.card}
    >
      <div style={styles.header}>
        <h2 style={styles.title}>Sector Performance</h2>
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: "#059669" }} />
            <span>Strong</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: "#ef4444" }} />
            <span>Weak</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading sector data...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>{error}</p>
        </div>
      ) : (
        <>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="sector"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  label={{ 
                    value: 'Performance %', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="performance"
                  radius={[6, 6, 0, 0]}
                  onMouseEnter={(data) => setHoveredSector(data.sector)}
                  onMouseLeave={() => setHoveredSector(null)}
                >
                  {sectorData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColor(entry.performance)}
                      opacity={hoveredSector === entry.sector ? 1 : 0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {hoveredSector && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.hoverInfo}
            >
              <strong>{hoveredSector}</strong> - {
                sectorData.find(s => s.sector === hoveredSector)?.performance || 0
              }% performance
            </motion.div>
          )}
        </>
      )}

      <div style={styles.footer}>
        <span style={styles.footerText}>Real-time sector analysis</span>
        <span style={styles.updateTime}>Updated just now</span>
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
    alignItems: "flex-start",
    marginBottom: "24px"
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    margin: 0
  },
  legend: {
    display: "flex",
    gap: "16px"
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#6b7280"
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "300px"
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
    height: "300px"
  },
  errorIcon: {
    fontSize: "32px",
    marginBottom: "12px"
  },
  errorText: {
    fontSize: "14px",
    color: "#ef4444"
  },
  chartContainer: {
    height: "300px",
    marginBottom: "20px"
  },
  tooltip: {
    background: "white",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb"
  },
  tooltipLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px"
  },
  tooltipValue: {
    fontSize: "14px",
    color: "#6b7280"
  },
  hoverInfo: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#374151",
    textAlign: "center",
    marginTop: "12px"
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
    color: "#6b7280"
  },
  updateTime: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "500"
  }
};