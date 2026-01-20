import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Information() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Investment Planning",
      description: "Tailored investment strategies to help clients grow their wealth with AI-powered insights.",
      icon: "📈",
      color: "#10b981"
    },
    {
      title: "Retirement Planning",
      description: "Comprehensive retirement plans designed for a secure and financially independent future.",
      icon: "🛡️",
      color: "#059669"
    },
    {
      title: "Education Planning",
      description: "Strategic guidance on saving and investing for education expenses with tax-advantaged accounts.",
      icon: "🎓",
      color: "#047857"
    },
    {
      title: "Tax Optimization",
      description: "Advanced tax planning strategies to maximize returns and minimize liabilities.",
      icon: "💰",
      color: "#065f46"
    },
    {
      title: "Portfolio Management",
      description: "Professional portfolio management with real-time monitoring and rebalancing.",
      icon: "📊",
      color: "#064e3b"
    },
    {
      title: "Risk Assessment",
      description: "Comprehensive risk analysis to protect your investments from market volatility.",
      icon: "⚖️",
      color: "#022c22"
    }
  ];

  const industries = [
    "Consumer Markets",
    "Energy, Utilities & Resources",
    "Financial Services",
    "Government & Health Industries",
    "Private Equity & Funds",
    "Technology, Media & Telecommunications",
    "Manufacturing & Industrial",
    "Real Estate & Construction"
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

      {/* HERO SECTION */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={styles.hero}
      >
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Unlock Your Financial Potential with
            <span style={styles.heroHighlight}> AI-Powered Insights</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Comprehensive financial intelligence and consulting services powered by advanced machine learning algorithms
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            style={styles.heroBtn}
          >
            Schedule Free Consultation →
          </motion.button>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>98.7%</div>
            <div style={styles.statLabel}>Prediction Accuracy</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Market Monitoring</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>10k+</div>
            <div style={styles.statLabel}>Data Points Analyzed</div>
          </div>
        </div>
      </motion.div>

      {/* SERVICES SECTION */}
      <div style={styles.section}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={styles.sectionHeader}
        >
          <h2 style={styles.sectionTitle}>Professional Services</h2>
          <p style={styles.sectionSubtitle}>AI-driven financial solutions tailored to your investment goals</p>
        </motion.div>

        <div style={styles.servicesGrid}>
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)" }}
              style={styles.serviceCard}
            >
              <div style={{
                ...styles.serviceIcon,
                background: `${service.color}15`
              }}>
                <span style={{ fontSize: "28px" }}>{service.icon}</span>
              </div>
              <h3 style={styles.serviceTitle}>{service.title}</h3>
              <p style={styles.serviceDescription}>{service.description}</p>
              <motion.button
                whileHover={{ x: 5 }}
                style={{
                  ...styles.serviceBtn,
                  color: service.color
                }}
              >
                Learn more →
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* INDUSTRIES SECTION */}
      <div style={{ ...styles.section, background: "#f8fafc" }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={styles.sectionHeader}
        >
          <h2 style={styles.sectionTitle}>Industry Expertise</h2>
          <p style={styles.sectionSubtitle}>Comprehensive analysis across multiple market sectors</p>
        </motion.div>

        <div style={styles.industriesGrid}>
          {industries.map((industry, index) => (
            <motion.div
              key={industry}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.05, background: "#10b981" }}
              style={styles.industryCard}
            >
              <span style={styles.industryText}>{industry}</span>
              <div style={styles.industryIcon}>📊</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={styles.ctaSection}
      >
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Transform Your Investment Strategy?</h2>
          <p style={styles.ctaText}>
            Join thousands of investors who trust our AI-powered platform for smarter financial decisions
          </p>
          <div style={styles.ctaButtons}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.ctaBtnPrimary}
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.ctaBtnSecondary}
            >
              View Demo
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Information;

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "white",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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

  hero: {
    padding: "60px 32px",
    background: "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)",
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb"
  },

  heroContent: {
    maxWidth: "800px",
    margin: "0 auto 40px"
  },

  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "16px",
    lineHeight: "1.2"
  },

  heroHighlight: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "block"
  },

  heroSubtitle: {
    fontSize: "18px",
    color: "#6b7280",
    marginBottom: "32px",
    lineHeight: "1.6"
  },

  heroBtn: {
    padding: "16px 32px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)"
  },

  heroStats: {
    display: "flex",
    justifyContent: "center",
    gap: "60px",
    marginTop: "60px"
  },

  stat: {
    textAlign: "center"
  },

  statNumber: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#10b981",
    marginBottom: "8px"
  },

  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500"
  },

  section: {
    padding: "80px 32px"
  },

  sectionHeader: {
    textAlign: "center",
    marginBottom: "60px",
    maxWidth: "800px",
    margin: "0 auto 60px"
  },

  sectionTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "16px"
  },

  sectionSubtitle: {
    fontSize: "18px",
    color: "#6b7280",
    lineHeight: "1.6"
  },

  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "32px",
    maxWidth: "1200px",
    margin: "0 auto"
  },

  serviceCard: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
    border: "1px solid #f3f4f6"
  },

  serviceIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px"
  },

  serviceTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "12px"
  },

  serviceDescription: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "20px"
  },

  serviceBtn: {
    background: "transparent",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  industriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto"
  },

  industryCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
    border: "1px solid #e5e7eb",
    cursor: "pointer"
  },

  industryText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    flex: 1
  },

  industryIcon: {
    fontSize: "20px",
    opacity: 0.7
  },

  ctaSection: {
    padding: "80px 32px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    textAlign: "center"
  },

  ctaContent: {
    maxWidth: "800px",
    margin: "0 auto"
  },

  ctaTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "white",
    marginBottom: "16px"
  },

  ctaText: {
    fontSize: "18px",
    color: "#d1fae5",
    marginBottom: "32px",
    lineHeight: "1.6"
  },

  ctaButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center"
  },

  ctaBtnPrimary: {
    padding: "16px 32px",
    background: "white",
    color: "#059669",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
  },

  ctaBtnSecondary: {
    padding: "16px 32px",
    background: "transparent",
    color: "white",
    border: "2px solid white",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer"
  }
};