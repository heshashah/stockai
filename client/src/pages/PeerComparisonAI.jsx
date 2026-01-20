import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PeerComparison() {
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [domain, setDomain] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companyA, setCompanyA] = useState("");
  const [companyB, setCompanyB] = useState("");

  // Load domains dynamically
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/peer-alpha/domains")
      .then((res) => {
        setDomains(["None", ...res.data]);
        setDomain("None");
      });
  }, []);

  // Analyze when domain changes
  useEffect(() => {
    if (!domain || domain === "None") {
      setData([]);
      setCompanyA("");
      setCompanyB("");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      axios
        .post("http://localhost:5001/api/peer-alpha/analyze", { domain })
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 800);
  }, [domain]);

  const selectedA = data.find(c => c.name === companyA);
  const selectedB = data.find(c => c.name === companyB);

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

      {/* MAIN CONTENT */}
      <div style={styles.mainContainer}>
        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>AI Peer Comparison</h1>
          <p style={styles.subtitle}>Compare companies within the same industry using AI-driven metrics</p>
        </div>

        {/* DOMAIN SELECTION - COMPACT */}
        <div style={styles.selectionCard}>
          <div style={styles.selectionHeader}>
            <div style={styles.selectionInfo}>
              <h3 style={styles.selectionLabel}>Select Industry Domain</h3>
              <p style={styles.selectionDescription}>Choose an industry to analyze peer companies</p>
            </div>
            <div style={styles.domainBadge}>{domain !== "None" ? "Active" : "Select"}</div>
          </div>

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            style={styles.domainSelect}
          >
            {domains.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* LOADING STATE */}
        <AnimatePresence>
          {loading && (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Analyzing industry data...</p>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN TABLE - OPTIMIZED */}
        {!loading && data.length > 0 && (
          <>
            <div style={styles.tableContainer}>
              <div style={styles.tableHeader}>
                <h2 style={styles.tableTitle}>Industry Rankings ({data.length} companies)</h2>
                <div style={styles.tableStats}>
                  <span style={styles.statItem}>AI Scoring Active</span>
                </div>
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeaderCell}>Rank</th>
                      <th style={styles.tableHeaderCell}>Company</th>
                      <th style={styles.tableHeaderCell}>P/E</th>
                      <th style={styles.tableHeaderCell}>Profit Δ</th>
                      <th style={styles.tableHeaderCell}>Sales Δ</th>
                      <th style={styles.tableHeaderCell}>ROCE</th>
                      <th style={styles.tableHeaderCell}>AI Score</th>
                      <th style={styles.tableHeaderCell}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((c, i) => (
                      <tr
                        key={i}
                        style={{
                          ...styles.tableRow,
                          background: i % 2 === 0 ? "#fafafa" : "white"
                        }}
                      >
                        <td style={styles.rankCell}>
                          <div style={i < 3 ? styles.topRankBadge : styles.rankBadge}>
                            #{i + 1}
                          </div>
                        </td>
                        <td style={styles.companyCell}>
                          <div style={styles.companyInfo}>
                            <div style={styles.companyAvatar}>
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <div style={styles.companyName}>{c.name}</div>
                              {c.ticker && <div style={styles.ticker}>{c.ticker}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={styles.metricCell}>{c.pe?.toFixed(1)}</td>
                        <td style={getGrowthStyle(c.profit_growth)}>
                          {c.profit_growth > 0 ? "+" : ""}{c.profit_growth?.toFixed(1)}%
                        </td>
                        <td style={getGrowthStyle(c.sales_growth)}>
                          {c.sales_growth > 0 ? "+" : ""}{c.sales_growth?.toFixed(1)}%
                        </td>
                        <td style={styles.metricCell}>{c.roce?.toFixed(1)}%</td>
                        <td style={styles.scoreCell}>
                          <div style={styles.scoreBadge}>
                            {c.ai_score}
                          </div>
                        </td>
                        <td style={ratingCellStyle(c.ai_rating)}>
                          {c.ai_rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* COMPARISON SECTION - COMPACT */}
            <div style={styles.comparisonContainer}>
              <div style={styles.comparisonHeader}>
                <h2 style={styles.comparisonTitle}>Direct Comparison</h2>
                <p style={styles.comparisonSubtitle}>Select two companies for detailed analysis</p>
              </div>

              <div style={styles.companySelectors}>
                <div style={styles.selectorContainer}>
                  <label style={styles.selectorLabel}>Company A</label>
                  <select
                    value={companyA}
                    onChange={(e) => setCompanyA(e.target.value)}
                    style={styles.companySelect}
                  >
                    <option value="">Select Company</option>
                    {data.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.vsBadge}>
                  VS
                </div>

                <div style={styles.selectorContainer}>
                  <label style={styles.selectorLabel}>Company B</label>
                  <select
                    value={companyB}
                    onChange={(e) => setCompanyB(e.target.value)}
                    style={styles.companySelect}
                  >
                    <option value="">Select Company</option>
                    {data.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* COMPARISON TABLE - OPTIMIZED */}
              {selectedA && selectedB && companyA !== companyB && (
                <div style={styles.comparisonTableContainer}>
                  <div style={styles.comparisonTable}>
                    {[
                      { label: "P/E Ratio", a: selectedA.pe?.toFixed(1), b: selectedB.pe?.toFixed(1), better: selectedA.pe < selectedB.pe ? "A" : "B" },
                      { label: "Profit Growth", a: `${selectedA.profit_growth?.toFixed(1)}%`, b: `${selectedB.profit_growth?.toFixed(1)}%`, better: selectedA.profit_growth > selectedB.profit_growth ? "A" : "B" },
                      { label: "Sales Growth", a: `${selectedA.sales_growth?.toFixed(1)}%`, b: `${selectedB.sales_growth?.toFixed(1)}%`, better: selectedA.sales_growth > selectedB.sales_growth ? "A" : "B" },
                      { label: "ROCE", a: `${selectedA.roce?.toFixed(1)}%`, b: `${selectedB.roce?.toFixed(1)}%`, better: selectedA.roce > selectedB.roce ? "A" : "B" },
                      { label: "AI Score", a: selectedA.ai_score, b: selectedB.ai_score, better: selectedA.ai_score > selectedB.ai_score ? "A" : "B" },
                      { label: "AI Rating", a: selectedA.ai_rating, b: selectedB.ai_rating },
                    ].map((metric, index) => (
                      <div key={metric.label} style={styles.comparisonRow}>
                        <div style={styles.metricLabel}>{metric.label}</div>
                        <div style={styles.metricValues}>
                          <div style={styles.valueContainer}>
                            <span style={{
                              ...styles.value,
                              fontWeight: metric.better === "A" ? "700" : "500",
                              color: metric.better === "A" ? "#059669" : "#111827"
                            }}>
                              {metric.a}
                            </span>
                            {metric.better === "A" && <span style={styles.betterBadge}>✓</span>}
                          </div>
                          <div style={styles.valueDivider} />
                          <div style={styles.valueContainer}>
                            <span style={{
                              ...styles.value,
                              fontWeight: metric.better === "B" ? "700" : "500",
                              color: metric.better === "B" ? "#059669" : "#111827"
                            }}>
                              {metric.b}
                            </span>
                            {metric.better === "B" && <span style={styles.betterBadge}>✓</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Helper functions
const getGrowthStyle = (value) => ({
  color: value > 0 ? "#10b981" : value < 0 ? "#ef4444" : "#6b7280",
  fontWeight: "500",
  fontSize: "13px"
});

const ratingCellStyle = (rating) => ({
  color: rating === "Strong Buy" ? "#059669" :
    rating === "Good" ? "#10b981" :
      rating === "Average" ? "#f59e0b" : "#dc2626",
  fontWeight: "600",
  fontSize: "13px",
  whiteSpace: "nowrap"
});

// STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Inter', sans-serif"
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

  contactBtn: {
    padding: "6px 12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "13px",
    cursor: "pointer"
  },
  
  mainContainer: {
    padding: "20px 24px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  header: {
    textAlign: "center",
    marginBottom: "24px"
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px"
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280"
  },
  selectionCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    marginBottom: "24px"
  },
  selectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px"
  },
  selectionInfo: {
    flex: 1
  },
  selectionLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px"
  },
  selectionDescription: {
    fontSize: "13px",
    color: "#6b7280"
  },
  domainBadge: {
    padding: "4px 10px",
    background: domain => domain !== "None" ? "#10b981" : "#6b7280",
    color: "white",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600"
  },
  domainSelect: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    background: "white",
    cursor: "pointer",
    outline: "none"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px"
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
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500"
  },
  tableContainer: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    marginBottom: "24px"
  },
  tableHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  tableTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827"
  },
  tableStats: {
    display: "flex",
    gap: "12px"
  },
  statItem: {
    padding: "4px 10px",
    background: "#f0fdf4",
    color: "#059669",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500"
  },
  tableWrapper: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px"
  },
  tableHeaderCell: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #f3f4f6",
    whiteSpace: "nowrap"
  },
  tableRow: {
    borderBottom: "1px solid #f3f4f6"
  },
  rankCell: {
    padding: "12px 16px",
    width: "60px"
  },
  topRankBadge: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "12px"
  },
  rankBadge: {
    background: "#f3f4f6",
    color: "#6b7280",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "12px"
  },
  companyCell: {
    padding: "12px 16px"
  },
  companyInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  companyAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#059669",
    fontWeight: "600",
    fontSize: "14px",
    flexShrink: 0
  },
  companyName: {
    fontWeight: "500",
    color: "#111827",
    fontSize: "14px"
  },
  ticker: {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "2px"
  },
  metricCell: {
    padding: "12px 16px",
    color: "#374151",
    fontWeight: "500",
    whiteSpace: "nowrap"
  },
  scoreCell: {
    padding: "12px 16px"
  },
  scoreBadge: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block",
    minWidth: "40px",
    textAlign: "center"
  },
  comparisonContainer: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
  },
  comparisonHeader: {
    textAlign: "center",
    marginBottom: "20px"
  },
  comparisonTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px"
  },
  comparisonSubtitle: {
    fontSize: "13px",
    color: "#6b7280"
  },
  companySelectors: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "20px"
  },
  selectorContainer: {
    flex: 1,
    maxWidth: "240px"
  },
  selectorLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px"
  },
  companySelect: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#111827",
    background: "white",
    cursor: "pointer",
    outline: "none"
  },
  vsBadge: {
    padding: "6px 16px",
    background: "#10b981",
    color: "white",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "12px",
    marginTop: "22px"
  },
  comparisonTableContainer: {
    background: "#f8fafc",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "16px"
  },
  comparisonTable: {
    padding: "16px"
  },
  comparisonRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb"
  },
  metricLabel: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    flex: 1
  },
  metricValues: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flex: 2
  },
  valueContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px"
  },
  value: {
    fontSize: "14px",
    color: "#111827"
  },
  betterBadge: {
    width: "20px",
    height: "20px",
    background: "#10b981",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700"
  },
  valueDivider: {
    width: "1px",
    height: "20px",
    background: "#e5e7eb"
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