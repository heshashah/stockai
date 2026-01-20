import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function RiskDashboard() {
  const [selectedIPO, setSelectedIPO] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [ipoData, setIpoData] = useState(null);
  const [loadingIPO, setLoadingIPO] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // IPO LIST
  const ipoList = [
    { name: "MARC Technocrats", key: "marc_technocrats" },
    { name: "Wakefit Innovations Ltd", key: "wakefit" },
    { name: "Sundrex Oil", key: "sundrex_oil" },
    { name: "TATA Capital Ltd", key: "tata_capital" },
    { name: "LG Electronics India Ltd", key: "lg_electronics" },
    { name: "Stanbik Agro", key: "stanbik_agro" },
    { name: "Studs", key: "studs" },
    { name: "Tenneco Clean Air India Ltd", key: "tenneco" },
    { name: "Bai Kakaji Polymers", key: "bai_kakaji" },
    { name: "ICICI Prudential AMC", key: "icici_prudential" },
    { name: "Corona Remedies", key: "corona_remedies" },
    { name: "Riddhi Display", key: "riddhi_display" },
    { name: "Gujarat Kidney & Super Speciality Ltd", key: "gujarat_kidney_speciality" },
    { name: "Admach Systems Ltd", key: "admach_systems" },
    { name: "Dachepalli Publishers Ltd", key: "dachepalli_publishers" },
    { name: "EPW India Ltd", key: "epw_india" },
    { name: "Shyam Dhani Industries", key: "shyam_dhani_industries" },
    { name: "Phytochem Remedies (India) Ltd", key: "phytochem_remedies" },
    { name: "Apollo Techno Industries", key: "apollo_techno_industries" },
    { name: "Nanta Tech Ltd", key: "nanta_tech" }
  ];

  // Filter IPOs based on search
  const filteredIPOs = ipoList.filter(ipo =>
    ipo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // OPEN POPUP + FETCH IPO DATA
  const openIPO = (ipo) => {
    setSelectedIPO(ipo);
    setShowPopup(true);
    setLoadingIPO(true);
    setIpoData(null);
    setAiData(null);

    axios
      .get(`http://localhost:5001/api/ipo?key=${ipo.key}`)
      .then((res) => {
        setIpoData(res.data);
        setLoadingIPO(false);
      })
      .catch(() => setLoadingIPO(false));
  };

  // CLOSE POPUP
  const closePopup = () => {
    setShowPopup(false);
    setSelectedIPO(null);
    setIpoData(null);
    setAiData(null);
  };

  // FETCH AI ANALYSIS AFTER IPO DATA ARRIVES
  useEffect(() => {
    if (!ipoData) return;

    const payload = {
      sentiment: Math.random(),
      financial_ratio: Math.random(),
      subscription: Math.random(),
      peer_strength: Math.random(),
      prices: [100, 102, 98, 101, 99, 105],
    };

    axios
      .post("http://localhost:5001/api/ipo/ai", payload)
      .then((res) => setAiData(res.data))
      .catch((err) => console.error("AI ERROR:", err));
  }, [ipoData]);

  const getRiskColor = (score) => {
    if (score < 0.4) return "#10b981";
    if (score < 0.7) return "#f59e0b";
    return "#ef4444";
  };

  const getRiskLevel = (score) => {
    if (score < 0.4) return "Low Risk";
    if (score < 0.7) return "Medium Risk";
    return "High Risk";
  };

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


      {/* BODY */}
      <div style={styles.body}>
        {/* HEADER */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.header}
        >
          <div>
            <h1 style={styles.title}>IPO Risk Dashboard</h1>
            <p style={styles.subtitle}>AI-powered risk assessment for upcoming IPOs</p>
          </div>
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <span style={styles.statValue}>{ipoList.length}</span>
              <span style={styles.statLabel}>Total IPOs</span>
            </div>
            <div style={styles.statCard}>
              <span style={{ ...styles.statValue, color: "#10b981" }}>8</span>
              <span style={styles.statLabel}>Low Risk</span>
            </div>
            <div style={styles.statCard}>
              <span style={{ ...styles.statValue, color: "#f59e0b" }}>7</span>
              <span style={styles.statLabel}>Medium Risk</span>
            </div>
          </div>
        </motion.div>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={styles.searchContainer}
        >
          <div style={styles.searchWrapper}>
            <svg style={styles.searchIcon} fill="none" stroke="#6b7280" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search IPOs by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchTerm("")}
                style={styles.clearButton}
              >
                ✕
              </motion.button>
            )}
          </div>
          <div style={styles.filterTags}>
            <span style={styles.filterTag}>All</span>
            <span style={styles.filterTag}>Low Risk</span>
            <span style={styles.filterTag}>High Growth</span>
            <span style={styles.filterTag}>Technology</span>
          </div>
        </motion.div>

        {/* IPO GRID */}
        <div style={styles.ipoGrid}>
          <AnimatePresence>
            {filteredIPOs.map((ipo, index) => (
              <motion.div
                key={ipo.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                style={styles.ipoCard}
                onClick={() => openIPO(ipo)}
              >
                <div style={styles.ipoCardHeader}>
                  <div style={styles.ipoAvatar}>
                    {ipo.name.charAt(0)}
                  </div>
                  <div style={styles.ipoStatus}>
                    <div style={styles.liveIndicator} />
                    <span style={styles.liveText}>Upcoming</span>
                  </div>
                </div>

                <div style={styles.ipoCardBody}>
                  <h3 style={styles.ipoName}>{ipo.name}</h3>
                  <div style={styles.ipoMeta}>
                    <span style={styles.ipoKey}>{ipo.key.replace(/_/g, " ")}</span>
                  </div>
                </div>

                <div style={styles.ipoCardFooter}>
                  <div style={styles.riskIndicator}>
                    <div style={styles.riskLabel}>Risk Level</div>
                    <div style={{
                      ...styles.riskBadge,
                      background: getRiskColor(Math.random())
                    }}>
                      {getRiskLevel(Math.random())}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    style={styles.viewButton}
                  >
                    <svg style={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredIPOs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.noResults}
          >
            <svg style={styles.noResultsIcon} fill="none" stroke="#6b7280" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={styles.noResultsText}>No IPOs found matching "{searchTerm}"</p>
          </motion.div>
        )}
      </div>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {showPopup && selectedIPO && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}
              <div style={styles.modalHeader}>
                <div style={styles.modalTitleSection}>
                  <div style={styles.modalAvatar}>
                    {selectedIPO.name.charAt(0)}
                  </div>
                  <div>
                    <h2 style={styles.modalTitle}>{selectedIPO.name}</h2>
                    <p style={styles.modalSubtitle}>
                      {selectedIPO.key.replace(/_/g, " ").toUpperCase()}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  style={styles.closeModalButton}
                  onClick={closePopup}
                >
                  ✕
                </motion.button>
              </div>

              {/* LOADING STATE */}
              <AnimatePresence>
                {loadingIPO ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.modalLoading}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={styles.modalSpinner}
                    />
                    <p style={styles.modalLoadingText}>Analyzing IPO data...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={styles.modalWrapper}
                  >
                    {/* Fixed height content area with scrolling */}
                    <div style={styles.modalContent}>
                      {/* IPO DATA SECTION */}
                      <div style={styles.dataSection}>
                        <h3 style={styles.sectionTitle}>
                          <svg style={styles.sectionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          IPO Watch Data
                        </h3>
                        <div style={styles.dataGrid}>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>GMP</span>
                            <span style={styles.dataValue}>{ipoData?.ipowatch?.gmp || "N/A"}</span>
                          </div>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>IPO Price</span>
                            <span style={styles.dataValue}>{ipoData?.ipowatch?.ipo_price || "N/A"}</span>
                          </div>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Listing Gain</span>
                            <span style={{
                              ...styles.dataValue,
                              color: ipoData?.ipowatch?.listing_gain?.includes("-") ? "#ef4444" : "#10b981"
                            }}>
                              {ipoData?.ipowatch?.listing_gain || "N/A"}
                            </span>
                          </div>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>IPO Type</span>
                            <span style={styles.dataValue}>{ipoData?.ipowatch?.ipo_type || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* MARKET DATA SECTION */}
                      <div style={styles.dataSection}>
                        <h3 style={styles.sectionTitle}>
                          <svg style={styles.sectionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Market Data
                        </h3>
                        <div style={styles.dataGrid}>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Market Price</span>
                            <span style={styles.dataValue}>{ipoData?.market?.market_price || "N/A"}</span>
                          </div>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Market Cap</span>
                            <span style={styles.dataValue}>{ipoData?.market?.market_cap || "N/A"}</span>
                          </div>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Revenue (Last Q)</span>
                            <span style={styles.dataValue}>{ipoData?.market?.last_quarter_revenue || "N/A"}</span>
                          </div>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Sector</span>
                            <span style={styles.dataValue}>{ipoData?.market?.sector || "N/A"}</span>
                          </div>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Industry</span>
                            <span style={styles.dataValue}>{ipoData?.market?.industry || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI ANALYSIS SECTION */}
                      {aiData && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          style={styles.aiSection}
                        >
                          <h3 style={styles.sectionTitle}>
                            <svg style={styles.sectionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            AI Risk Analysis
                          </h3>
                          <div style={styles.riskScoreContainer}>
                            <div style={styles.riskScoreCard}>
                              <span style={styles.riskScoreLabel}>Risk Score</span>
                              <div style={{
                                ...styles.riskScoreCircle,
                                background: `conic-gradient(${getRiskColor(aiData.risk_score)} ${aiData.risk_score * 100}%, #e5e7eb ${aiData.risk_score * 100}%)`
                              }}>
                                <span style={styles.riskScoreValue}>
                                  {(aiData.risk_score * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div style={{
                                ...styles.riskLevelBadge,
                                background: getRiskColor(aiData.risk_score)
                              }}>
                                {getRiskLevel(aiData.risk_score)}
                              </div>
                            </div>
                            <div style={styles.aiMetrics}>
                              <div style={styles.aiMetric}>
                                <span style={styles.aiMetricLabel}>Volatility</span>
                                <span style={styles.aiMetricValue}>{aiData.volatility}</span>
                              </div>
                              <div style={styles.aiMetric}>
                                <span style={styles.aiMetricLabel}>Logistic Score</span>
                                <span style={styles.aiMetricValue}>{aiData.logistic}</span>
                              </div>
                              <div style={styles.aiMetric}>
                                <span style={styles.aiMetricLabel}>Random Forest</span>
                                <span style={styles.aiMetricValue}>{aiData.random_forest}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{
                            ...styles.recommendation,
                            background: getRiskColor(aiData.risk_score) + "20"
                          }}>
                            <span style={styles.recommendationText}>
                              {aiData.risk_score < 0.4
                                ? "🟢 Low Risk — Good investment opportunity"
                                : aiData.risk_score < 0.7
                                  ? "🟡 Medium Risk — Consider with caution"
                                  : "🔴 High Risk — Requires thorough due diligence"}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Fixed action buttons at bottom */}
                    <div style={styles.modalActionsFixed}>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
                        whileTap={{ scale: 0.95 }}
                        style={styles.sentimentButton}
                        onClick={() => navigate(`/sentiment/${selectedIPO.key}`)}
                      >
                        <svg style={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        View Sentiment Analysis
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={styles.closeButton}
                        onClick={closePopup}
                      >
                        Close
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)",
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

  body: {
    padding: "32px 40px",
    maxWidth: "1400px",
    margin: "0 auto"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px"
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    fontWeight: "400"
  },

  statsContainer: {
    display: "flex",
    gap: "16px"
  },

  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 24px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    minWidth: "100px"
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px"
  },

  statLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500"
  },

  searchContainer: {
    marginBottom: "32px"
  },

  searchWrapper: {
    position: "relative",
    maxWidth: "500px",
    marginBottom: "16px"
  },

  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px"
  },

  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#111827",
    background: "white",
    outline: "none",
    transition: "all 0.2s"
  },

  clearButton: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: "16px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%"
  },

  filterTags: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },

  filterTag: {
    padding: "6px 12px",
    background: "white",
    color: "#6b7280",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #e5e7eb"
  },

  ipoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px"
  },

  ipoCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  ipoCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },

  ipoAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#059669",
    fontWeight: "600",
    fontSize: "20px"
  },

  ipoStatus: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },

  liveIndicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#10b981",
    animation: "pulse 2s infinite"
  },

  liveText: {
    fontSize: "12px",
    color: "#10b981",
    fontWeight: "500"
  },

  ipoCardBody: {
    flex: 1
  },

  ipoName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
    lineHeight: "1.4"
  },

  ipoMeta: {
    display: "flex",
    gap: "8px"
  },

  ipoKey: {
    fontSize: "12px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "4px 8px",
    borderRadius: "6px"
  },

  ipoCardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #f3f4f6"
  },

  riskIndicator: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },

  riskLabel: {
    fontSize: "12px",
    color: "#6b7280"
  },

  riskBadge: {
    padding: "4px 12px",
    color: "white",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  },

  viewButton: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#10b981",
    cursor: "pointer"
  },

  arrowIcon: {
    width: "16px",
    height: "16px"
  },

  noResults: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "16px"
  },

  noResultsIcon: {
    width: "64px",
    height: "64px",
    marginBottom: "16px",
    opacity: 0.5
  },

  noResultsText: {
    fontSize: "16px",
    color: "#6b7280",
    fontWeight: "500"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 2000
  },

  modal: {
    background: "white",
    borderRadius: "20px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "80vh",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "32px 32px 0",
    borderBottom: "1px solid #f3f4f6",
    paddingBottom: "24px",
    flexShrink: 0
  },

  modalTitleSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },

  modalAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#059669",
    fontWeight: "600",
    fontSize: "24px"
  },

  modalTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px"
  },

  modalSubtitle: {
    fontSize: "14px",
    color: "#6b7280"
  },

  closeModalButton: {
    background: "none",
    border: "none",
    color: "#9ca3af",
    fontSize: "24px",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.2s"
  },

  modalLoading: {
    padding: "60px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },

  modalSpinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    marginBottom: "20px"
  },

  modalLoadingText: {
    color: "#6b7280",
    fontSize: "16px",
    fontWeight: "500"
  },

  modalWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: 1
  },

  modalContent: {
    flex: 1,
    padding: "32px",
    overflowY: "auto",
    maxHeight: "calc(70vh - 140px)"
  },

  modalActionsFixed: {
    display: "flex",
    gap: "16px",
    padding: "24px 32px",
    background: "white",
    borderTop: "1px solid #f3f4f6",
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    flexShrink: 0
  },

  dataSection: {
    marginBottom: "32px"
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "20px"
  },

  sectionIcon: {
    width: "20px",
    height: "20px"
  },

  dataGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "16px"
  },

  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },

  dataLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500"
  },

  dataValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827"
  },

  aiSection: {
    background: "#f8fafc",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px"
  },

  riskScoreContainer: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    marginBottom: "24px"
  },

  riskScoreCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px"
  },

  riskScoreLabel: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500"
  },

  riskScoreCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    background: "conic-gradient(#e5e7eb 100%, #e5e7eb 100%)"
  },

  riskScoreValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827"
  },

  riskLevelBadge: {
    padding: "6px 16px",
    color: "white",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600"
  },

  aiMetrics: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px"
  },

  aiMetric: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },

  aiMetricLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500"
  },

  aiMetricValue: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827"
  },

  recommendation: {
    padding: "16px",
    borderRadius: "12px",
    borderLeft: "4px solid #10b981"
  },

  recommendationText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111827",
    lineHeight: "1.5"
  },

  sentimentButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer"
  },

  buttonIcon: {
    width: "20px",
    height: "20px"
  },

  closeButton: {
    padding: "16px 32px",
    background: "transparent",
    color: "#6b7280",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer"
  }
};