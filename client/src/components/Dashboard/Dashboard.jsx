import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Import Dashboard widgets
import MarketCards from "./MarketCards";
import SensexChart from "./SensexChart";
import TopGainersLosers from "../TopGainersLosers";
import SectorPerformance from "../SectorPerformance";
import IPOMini from "./IPOMini";
import AIStockPicks from "../AIStockPicks";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Users", value: "15.2K", change: "+12.5%", icon: "👥" },
    { label: "Active Trades", value: "8,742", change: "+8.3%", icon: "💼" },
    { label: "AI Accuracy", value: "87.4%", change: "+2.1%", icon: "🎯" },
    { label: "Avg. Returns", value: "24.8%", change: "+5.7%", icon: "💰" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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

      {/* DASHBOARD CONTENT */}
      <div style={styles.content}>
        {/* HEADER */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.header}
        >
          <div>
            <h1 style={styles.title}>Market Intelligence Dashboard</h1>
            <p style={styles.subtitle}>Real-time insights and AI-powered analysis</p>
          </div>
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
                style={styles.statCard}
              >
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{stat.value}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                  <div style={styles.statChange}>{stat.change}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* MARKET CARDS */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={styles.marketCardsSection}
        >
          <MarketCards />
        </motion.div>

        {/* MAIN CHART */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={styles.chartSection}
        >
          <SensexChart />
        </motion.div>

        {/* ANALYTICS GRID */}
        <div style={styles.analyticsGrid}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={styles.gridItem}
          >
            <SectorPerformance />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
            style={styles.gridItem}
          >
            <TopGainersLosers />
          </motion.div>
        </div>

        {/* AI INSIGHTS GRID */}
        <div style={styles.insightsGrid}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={styles.gridItem}
          >
            <AIStockPicks />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.75 }}
            style={styles.gridItem}
          >
            <IPOMini />
          </motion.div>
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={styles.footer}
        >
          <p style={styles.footerText}>
            StockAI Dashboard • All data is updated in real-time • AI analysis powered by machine learning
          </p>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink}>Privacy Policy</span>
            <span style={styles.footerLink}>Terms of Service</span>
            <span style={styles.footerLink}>Data Sources</span>
            <span style={styles.footerLink}>API Documentation</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    overflowX: "hidden"
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
  content: {
    padding: "32px",
    maxWidth: "1400px",
    margin: "0 auto"
  },
  header: {
    marginBottom: "32px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "8px",
    background: "linear-gradient(135deg, #111827 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "32px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginTop: "24px"
  },
  statCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  statIcon: {
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px"
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "4px"
  },
  statChange: {
    fontSize: "12px",
    color: "#10b981",
    fontWeight: "600"
  },
  marketCardsSection: {
    marginBottom: "32px"
  },
  chartSection: {
    marginBottom: "32px"
  },
  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "24px"
  },
  insightsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "40px"
  },
  gridItem: {
    height: "100%"
  },
  footer: {
    padding: "24px",
    background: "white",
    borderRadius: "16px",
    textAlign: "center",
    border: "1px solid #e5e7eb"
  },
  footerText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "16px"
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    fontSize: "13px"
  },
  footerLink: {
    color: "#10b981",
    cursor: "pointer",
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