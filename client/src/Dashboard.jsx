import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate(); // ✅ for routing

  return (
    <div style={styles.page}>
      {/* ✅ NAVBAR */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          <span style={styles.link}>Dashboard</span>
          <span style={styles.link}>Industries</span>
          <span style={styles.link}>People</span>
          <span style={styles.link}>Insights</span>

          {/* ✅ THIS NOW REDIRECTS */}
          <span
            style={styles.link}
            onClick={() => navigate("/information")}
          >
            Information
          </span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* ✅ DASHBOARD BODY */}
      <div style={styles.body}>
        <h1>Dashboard</h1>
        <p>You have successfully logged in!</p>
      </div>
    </div>
  );
}

export default Dashboard;

/* ✅ INTERNAL CSS */
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
    padding: "60px",
    textAlign: "center",
  },
};
