import React from "react";
import { useNavigate } from "react-router-dom";

function Information() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* ✅ NAVBAR */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          {/* ✅ DASHBOARD REDIRECT */}
          <span
            style={styles.link}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </span>

          {/* ✅ UPDATE REDIRECTS */}
          <span
            style={styles.link}
            onClick={() => navigate("/update")}
          >
            Daily Updates
          </span>

          <span style={styles.link}>Industries</span>
          <span style={styles.link}>People</span>
          <span style={styles.link}>Insights</span>

          {/* ✅ ACTIVE PAGE */}
          <span style={styles.activeLink}>Information</span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* ✅ HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1>Unlock your financial potential with expert guidance</h1>
          <p>
            Comprehensive financial consulting services tailored to your needs
          </p>
          <button style={styles.heroBtn}>
            Schedule a free consultation
          </button>
        </div>
      </div>

      {/* ✅ SERVICES TITLE */}
      <div style={styles.servicesTitle}>
        <h4>Services</h4>
        <h2>To meet your needs</h2>
        <p>CFO, Tax, Payroll, Accounting and Bookkeeping Services</p>
      </div>

      {/* ✅ SERVICES SECTION */}
      <div style={styles.servicesSection}>
        <div style={styles.serviceCard}>
          <h3>Investment planning</h3>
          <p>
            Tailored investment strategies to help clients grow their wealth.
          </p>
        </div>

        <div style={styles.serviceCard}>
          <h3>Retirement planning</h3>
          <p>
            Comprehensive retirement plans designed for a secure future.
          </p>
        </div>

        <div style={styles.serviceCard}>
          <h3>Education planning</h3>
          <p>
            Guidance on saving and investing for education expenses.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
          alt="person"
          style={styles.serviceImage}
        />
      </div>

      {/* ✅ INDUSTRIES */}
      <div style={styles.industries}>
        <h3>Industries</h3>
        <div style={styles.industryGrid}>
          <span>Consumer markets</span>
          <span>Energy, utilities and resources</span>
          <span>Financial services</span>
          <span>Government and health industries</span>
          <span>Private equity and funds</span>
          <span>Technology, media and telecommunications</span>
        </div>
      </div>
    </div>
  );
}

export default Information;

/* ✅ INTERNAL CSS */
const styles = {
  page: {
    fontFamily: "Poppins, sans-serif",
    background: "#ffffff",
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
  },

  navLinks: {
    display: "flex",
    gap: "25px",
    fontSize: "14px",
    alignItems: "center",
  },

  link: {
    cursor: "pointer",
    opacity: 0.9,
  },

//   activeLink: {
//     cursor: "default",
//     fontWeight: "700",
//     textDecoration: "underline",
//   },

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
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },

  hero: {
    height: "420px",
    background:
      "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1523958203904-cdcb402031fd)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    paddingLeft: "80px",
    color: "white",
  },

  heroText: {
    maxWidth: "520px",
  },

  heroBtn: {
    marginTop: "20px",
    padding: "12px 22px",
    background: "white",
    color: "#2f4f3e",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },

  servicesTitle: {
    padding: "70px 80px 40px",
  },

  servicesSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "25px",
    padding: "40px 80px",
    background: "#eef1e7",
    alignItems: "center",
  },

  serviceCard: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  serviceImage: {
    width: "100%",
    borderRadius: "16px",
  },

  industries: {
    padding: "70px 80px",
  },

  industryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "15px",
    marginTop: "20px",
  },
};
