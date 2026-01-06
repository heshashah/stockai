import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RiskDashboard() {
  const [selectedIPO, setSelectedIPO] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [ipoData, setIpoData] = useState(null);
  const [loadingIPO, setLoadingIPO] = useState(false);

  const [aiData, setAiData] = useState(null);

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

  return (
    <div style={styles.page}>

      {/* ✅ NEW NAVBAR INSERTED HERE */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/dashboard")}>Dashboard</span>
          {/* <span style={styles.link} onClick={() => navigate("/sensex")}>Sensex</span> */}
          <span style={styles.link} onClick={() => navigate("/direction")}>Direction</span>
          <span style={styles.link} onClick={() => navigate("/risk")}>Risk</span>
          {/* <span style={styles.link} onClick={() => navigate("/sentiment")}>Sentiment</span> */}
          <span style={styles.link} onClick={() => navigate("/information")}>Information</span>
          <span style={styles.link} onClick={() => navigate("/news")}>News</span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>
      {/* ✅ NEW NAVBAR ENDS */}

      {/* BODY */}
      <div style={styles.body}>
        <h1 style={{ marginTop: "40px", fontSize: "28px" }}>Available IPOs</h1>

        <div style={styles.ipoGrid}>
          {ipoList.map((ipo) => (
            <div key={ipo.key} style={styles.ipoCard} onClick={() => openIPO(ipo)}>
              <div style={styles.ipoImage}></div>
              <div style={styles.ipoName}>{ipo.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP */}
      {
        showPopup && selectedIPO && (
          <div style={styles.popupOverlay}>
            <div style={styles.popup}>
              <h2>{selectedIPO.name}</h2>

              {loadingIPO && <p>Loading IPO details...</p>}

              {ipoData && (
                <>
                  <h3>📌 IPOWatch Data</h3>
                  <p><b>GMP:</b> {ipoData.ipowatch?.gmp}</p>
                  <p><b>IPO Price:</b> {ipoData.ipowatch?.ipo_price}</p>
                  <p><b>Listing Gain:</b> {ipoData.ipowatch?.listing_gain}</p>
                  <p><b>IPO Type:</b> {ipoData.ipowatch?.ipo_type}</p>

                  {/* ⭐ SENTIMENT PREVIEW ADDED HERE */}
                  {/* <h3 style={{ marginTop: "15px" }}>🧠 Sentiment (AI)</h3>

              <div>
                <span style={{ fontWeight: "bold" }}>Sentiment:</span>{" "}
                <span
                  style={{
                    color:
                      ipoData.sentiment === "Positive"
                        ? "green"
                        : ipoData.sentiment === "Negative"
                          ? "red"
                          : "orange",
                  }}
                >
                  {ipoData.sentiment}
                </span>
              </div>

              <p><b>Sentiment Score:</b> {ipoData.sentiment_score}</p> */}

                  <hr />

                  <h3>📌 Market Data</h3>
                  <p><b>Market Price:</b> {ipoData.market?.market_price}</p>
                  <p><b>Market Cap:</b> {ipoData.market?.market_cap}</p>
                  <p><b>Last Quarter Revenue:</b> {ipoData.market?.last_quarter_revenue}</p>
                  <p><b>Sector:</b> {ipoData.market?.sector}</p>
                  <p><b>Industry:</b> {ipoData.market?.industry}</p>
                </>
              )}

              {aiData && (
                <>
                  <hr />
                  <h3>🤖 AI Risk Analysis</h3>

                  <p><b>Risk Score:</b> {aiData.risk_score}</p>
                  <p><b>Volatility:</b> {aiData.volatility}</p>
                  <p><b>Logistic Score:</b> {aiData.logistic}</p>
                  <p><b>Random Forest Score:</b> {aiData.random_forest}</p>

                  <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                    {aiData.risk_score < 0.4
                      ? "🟢 Low Risk — Good Buy"
                      : aiData.risk_score < 0.7
                        ? "🟡 Medium Risk — Caution"
                        : "🔴 High Risk — Avoid"}
                  </p>
                </>
              )}

              {/* 🔗 LINK TO SENTIMENT PAGE */}
              <button
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  padding: "8px 16px",
                  background: "#f4f6f5",
                  border: "1px solid #2f4f3e",
                  color: "#2f4f3e",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
                onClick={() => navigate(`/sentiment/${selectedIPO.key}`)}

              >
                View Sentiment →
              </button>

              <button style={styles.closeBtn} onClick={closePopup}>Close</button>
            </div>
          </div>
        )
      }
    </div >
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  page: { minHeight: "100vh", background: "#f4f6f5", fontFamily: "Poppins" },
  navbar: {
    display: "flex", justifyContent: "space-between", padding: "20px 50px",
    background: "#2f4f3e", color: "white", alignItems: "center"
  },
  logo: { fontWeight: "600", fontSize: "18px" },
  navLinks: { display: "flex", gap: "25px", fontSize: "14px" },
  link: { cursor: "pointer" },
  phoneBtn: { marginRight: "12px", padding: "8px 16px", border: "1px solid white", background: "transparent", color: "white", borderRadius: "6px" },
  contactBtn: { padding: "8px 16px", background: "white", color: "#2f4f3e", borderRadius: "6px", fontWeight: "600" },
  body: { padding: "40px", textAlign: "center" },
  ipoGrid: { marginTop: "30px", display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" },
  ipoCard: {
    padding: "20px", background: "#2f4f3e", color: "white",
    borderRadius: "10px", width: "260px", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center"
  },
  ipoImage: { width: "70px", height: "70px", background: "#cce1d2", borderRadius: "50%", marginBottom: "10px" },
  popupOverlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
  },
  popup: {
    background: "white", width: "420px", padding: "30px",
    borderRadius: "12px", maxHeight: "80vh", overflowY: "auto", textAlign: "left"
  },
  closeBtn: {
    marginTop: "20px", padding: "10px 20px",
    background: "#2f4f3e", color: "white", borderRadius: "6px", cursor: "pointer"
  }
};
