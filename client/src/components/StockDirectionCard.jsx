import React from "react";
import { motion } from "framer-motion";

export default function StockDirectionCard({ data }) {
  if (!data) return null;

  const { direction, confidence, reasons } = data.prediction;
  
  const getDirectionColor = () => {
    switch(direction) {
      case "BULLISH": return "#10b981";
      case "BEARISH": return "#ef4444";
      default: return "#f59e0b";
    }
  };

  const color = getDirectionColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={styles.card}
    >
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>AI Prediction Result</h3>
        <p style={styles.cardSubtitle}>Advanced ML market analysis</p>
      </div>

      <div style={styles.predictionGrid}>
        {/* Direction */}
        <div style={styles.predictionSection}>
          <div style={styles.sectionLabel}>Direction</div>
          <div style={{
            ...styles.directionBadge,
            background: color
          }}>
            {direction === "BULLISH" ? "📈" : direction === "BEARISH" ? "📉" : "➡️"} {direction}
          </div>
        </div>

        {/* Confidence */}
        <div style={styles.predictionSection}>
          <div style={styles.sectionLabel}>Confidence</div>
          <div style={styles.confidenceSection}>
            <div style={styles.confidenceValue}>{confidence}%</div>
            <div style={styles.confidenceMeter}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                style={{
                  ...styles.confidenceFill,
                  background: color
                }}
              />
            </div>
          </div>
        </div>

        {/* Factors */}
        <div style={styles.factorsSection}>
          <div style={styles.sectionLabel}>Key Factors</div>
          <div style={styles.factorsList}>
            {reasons.slice(0, 3).map((reason, index) => (
              <div key={index} style={styles.factorItem}>
                <span style={styles.factorNumber}>{index + 1}.</span>
                <span style={styles.factorText}>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>Method:</span>
          <span style={styles.footerValue}>LSTM Neural Network</span>
        </div>
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>Strength:</span>
          <span style={{
            ...styles.footerValue,
            color: confidence > 70 ? "#10b981" : confidence > 50 ? "#f59e0b" : "#ef4444"
          }}>
            {confidence > 70 ? "Strong" : confidence > 50 ? "Moderate" : "Weak"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
  },
  cardHeader: {
    marginBottom: "20px"
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px"
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "#6b7280"
  },
  predictionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "20px"
  },
  predictionSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  sectionLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500"
  },
  directionBadge: {
    padding: "10px 16px",
    color: "white",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    textAlign: "center"
  },
  confidenceSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  confidenceValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827"
  },
  confidenceMeter: {
    height: "6px",
    background: "#e5e7eb",
    borderRadius: "3px",
    overflow: "hidden"
  },
  confidenceFill: {
    height: "100%",
    borderRadius: "3px"
  },
  factorsSection: {
    gridColumn: "span 2",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  factorsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  factorItem: {
    display: "flex",
    gap: "8px",
    fontSize: "13px",
    color: "#374151"
  },
  factorNumber: {
    fontWeight: "600",
    color: "#10b981"
  },
  factorText: {
    flex: 1
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb"
  },
  footerItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  footerLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500"
  },
  footerValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827"
  }
};