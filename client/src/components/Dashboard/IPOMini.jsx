import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function IPOMini() {
  const [ipoData, setIpoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = {
        upcoming: [
          { name: "FinTech Innovations", symbol: "FTI", price: "₹1,200-1,250", date: "Mar 15", status: "Upcoming" },
          { name: "Green Energy Corp", symbol: "GEC", price: "₹850-900", date: "Mar 22", status: "Upcoming" },
          { name: "MediCare Solutions", symbol: "MCS", price: "₹450-500", date: "Mar 30", status: "Upcoming" },
          { name: "AI Robotics Ltd", symbol: "ARL", price: "₹1,500-1,600", date: "Apr 5", status: "Upcoming" },
          { name: "Tech Logistics Inc", symbol: "TLI", price: "₹650-700", date: "Apr 12", status: "Upcoming" },
          { name: "Digital Finance Corp", symbol: "DFC", price: "₹1,100-1,200", date: "Apr 18", status: "Upcoming" },
          { name: "Smart Retail Ltd", symbol: "SRL", price: "₹300-350", date: "Apr 25", status: "Upcoming" },
          { name: "Clean Energy Solutions", symbol: "CES", price: "₹900-950", date: "May 3", status: "Upcoming" },
        ],
        recent: [
          { name: "CloudTech Ltd", symbol: "CTL", price: "₹1,200", date: "Mar 1", change: "+42.5%", status: "Listed" },
          { name: "BioPharm Inc", symbol: "BPI", price: "₹950", date: "Feb 15", change: "+18.3%", status: "Listed" },
          { name: "AutoMotive Tech", symbol: "AMT", price: "₹1,100", date: "Feb 1", change: "-5.2%", status: "Listed" },
          { name: "E-Commerce Network", symbol: "ECN", price: "₹850", date: "Jan 20", change: "+32.1%", status: "Listed" },
          { name: "Real Estate Platform", symbol: "REP", price: "₹750", date: "Jan 10", change: "+12.4%", status: "Listed" },
          { name: "Healthcare Analytics", symbol: "HCA", price: "₹1,350", date: "Dec 28", change: "-8.7%", status: "Listed" },
        ]
      };
      setIpoData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case "Upcoming": return "#f59e0b";
      case "Listed": return "#10b981";
      case "Withdrawn": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.card}
    >
      <div style={styles.header}>
        <h2 style={styles.title}>IPO Intelligence</h2>
        <div style={styles.badge}>
          <span style={styles.badgeIcon}>📈</span>
          <span>Live</span>
        </div>
      </div>

      <div style={styles.tabs}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("upcoming")}
          style={{
            ...styles.tabButton,
            background: activeTab === "upcoming" ? "#10b981" : "#f3f4f6",
            color: activeTab === "upcoming" ? "white" : "#374151"
          }}
        >
          Upcoming
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("recent")}
          style={{
            ...styles.tabButton,
            background: activeTab === "recent" ? "#10b981" : "#f3f4f6",
            color: activeTab === "recent" ? "white" : "#374151"
          }}
        >
          Recent
        </motion.button>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Analyzing IPO market...</p>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.scrollableContainer}>
            <div style={styles.ipoList}>
              {ipoData[activeTab]?.map((ipo, index) => (
                <motion.div
                  key={ipo.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                  style={styles.ipoItem}
                >
                  <div style={styles.ipoInfo}>
                    <div style={styles.ipoHeader}>
                      <span style={styles.ipoSymbol}>{ipo.symbol}</span>
                      <span style={{
                        ...styles.ipoStatus,
                        background: getStatusColor(ipo.status)
                      }}>
                        {ipo.status}
                      </span>
                    </div>
                    <p style={styles.ipoName}>{ipo.name}</p>
                    <div style={styles.ipoDetails}>
                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Price Band</span>
                        <span style={styles.detailValue}>{ipo.price}</span>
                      </div>
                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Date</span>
                        <span style={styles.detailValue}>{ipo.date}</span>
                      </div>
                      {ipo.change && (
                        <div style={styles.detail}>
                          <span style={styles.detailLabel}>Change</span>
                          <span style={{
                            ...styles.detailValue,
                            color: ipo.change.startsWith("+") ? "#10b981" : "#ef4444"
                          }}>
                            {ipo.change}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.actionButton}
                  >
                    Analyze
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <span style={styles.footerText}>Powered by AI market analysis</span>
        <span style={styles.updateText}>Updates daily</span>
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
    border: "1px solid #e5e7eb",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    maxHeight: "600px", // Set a max height for the entire card
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
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "#d1fae5",
    color: "#059669",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },
  badgeIcon: {
    fontSize: "12px"
  },
  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px"
  },
  tabButton: {
    flex: 1,
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  loadingContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
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
  content: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  // NEW: Scrollable container wrapper
  scrollableContainer: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "8px", // Space for scrollbar
  },
  ipoList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minHeight: "min-content",
  },
  ipoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "#fafafa",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    transition: "background-color 0.2s",
    flexShrink: 0, // Prevent items from shrinking
  },
  ipoInfo: {
    flex: 1,
    minWidth: 0, // Prevent text overflow
  },
  ipoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  ipoSymbol: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827"
  },
  ipoStatus: {
    padding: "4px 10px",
    color: "white",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600"
  },
  ipoName: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "12px",
    lineHeight: "1.4",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  ipoDetails: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap"
  },
  detail: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: "80px"
  },
  detailLabel: {
    fontSize: "11px",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  detailValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151"
  },
  actionButton: {
    padding: "8px 16px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    marginLeft: "12px",
    flexShrink: 0, // Prevent button from shrinking
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
    flexShrink: 0, // Keep footer fixed
  },
  footerText: {
    fontSize: "12px",
    color: "#6b7280"
  },
  updateText: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "500"
  }
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);