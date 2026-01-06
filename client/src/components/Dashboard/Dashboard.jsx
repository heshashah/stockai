import React from "react";
import { useNavigate } from "react-router-dom";

// Import Dashboard widgets
import MarketCards from "./MarketCards";
import SensexChart from "./SensexChart";
import TopGainersLosers from "../TopGainersLosers";
import SectorPerformance from "../SectorPerformance";
import IPOMini from "../IPOmini";
import AIStockPicks from "../AIStockPicks";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/dashboard")}>Dashboard</span>
          {/* <span style={styles.link} onClick={() => navigate("/sensex")}>Sensex</span> */}
          <span style={styles.link} onClick={() => navigate("/direction")}>Direction</span>
          <span style={styles.link} onClick={() => navigate("/risk")}>Risk</span>
          {/* <span style={styles.link} onClick={() => navigate("/sentiment")}>Sentiment</span> */}
          <span style={styles.link} onClick={() => navigate("/peer-comparison")}>Comparison</span>
          <span style={styles.link} onClick={() => navigate("/information")}>Information</span>
          <span style={styles.link} onClick={() => navigate("/news")}>News</span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <div style={styles.body}>

        {/* 🔹 1 — Summary Cards */}
        <MarketCards />

        {/* 🔹 2 — Sensex Chart */}
        <div style={styles.fullRow}>
          <SensexChart />
        </div>

        {/* 🔹 3 — Sector Performance + Market Movers */}
        <div style={styles.twoCol}>
          <SectorPerformance />     {/* LIVE from Python port 5003 */}
          <TopGainersLosers />      {/* LIVE from Python port 5004 */}
        </div>

        {/* 🔹 4 — IPO Section + AI Picks */}
        <div style={styles.twoCol}>
          <IPOMini />
          <AIStockPicks />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

/* ========================= DASHBOARD STYLES ========================= */

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
    transition: "0.2s",
  },

  phoneBtn: {
    marginRight: "12px",
    padding: "8px 16px",
    border: "1px solid white",
    background: "transparent",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },

  contactBtn: {
    padding: "8px 16px",
    background: "white",
    color: "#2f4f3e",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },

  body: {
    padding: "45px 60px",
  },

  fullRow: {
    marginTop: "25px",
    marginBottom: "35px",
  },

  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    marginBottom: "40px",
  },
};
