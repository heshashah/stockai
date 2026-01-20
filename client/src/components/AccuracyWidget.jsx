import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AccuracyWidget() {
  const [acc, setAcc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccuracy = async () => {
      try {
        const res = await axios.get("http://localhost:5008/api/accuracy-this-month");
        setAcc(res.data);
      } catch (error) {
        console.warn("Failed to fetch accuracy:", error);
        setAcc(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccuracy();
    const interval = setInterval(fetchAccuracy, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return "#10b981";
    if (accuracy >= 70) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Model Accuracy</h3>
        <span style={styles.subtitle}>This Month</span>
      </div>
      
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
        </div>
      ) : acc && acc.accuracy !== null ? (
        <div style={styles.content}>
          <div style={styles.mainMetric}>
            <div style={{
              ...styles.accuracyValue,
              color: getAccuracyColor(acc.accuracy)
            }}>
              {acc.accuracy}%
            </div>
            <div style={styles.statsRow}>
              <div style={styles.statMini}>
                <span style={styles.statLabel}>Total</span>
                <span style={styles.statNumber}>{acc.total_predictions || 0}</span>
              </div>
              <div style={styles.statMini}>
                <span style={styles.statLabel}>Correct</span>
                <span style={styles.statNumber}>{acc.correct_predictions || 0}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.empty}>
          No data yet
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "white",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    minWidth: "180px"
  },
  header: {
    marginBottom: "12px"
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "2px"
  },
  subtitle: {
    fontSize: "12px",
    color: "#6b7280"
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: "20px"
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  mainMetric: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  accuracyValue: {
    fontSize: "32px",
    fontWeight: "700"
  },
  statsRow: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  statMini: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  statLabel: {
    fontSize: "11px",
    color: "#6b7280"
  },
  statNumber: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827"
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "20px 0",
    fontSize: "14px"
  }
};