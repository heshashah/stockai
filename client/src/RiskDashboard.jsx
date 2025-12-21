import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RiskDashboard() {
  const [risk, setRisk] = useState(null);
  const [selectedIPO, setSelectedIPO] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [ipoData, setIpoData] = useState(null);
  const [loadingIPO, setLoadingIPO] = useState(false);

  const navigate = useNavigate();

  //  UPDATED IPO LIST (WITH KEY + NAME)
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

  //  OPEN IPO POPUP
  const openIPO = (ipo) => {
    setSelectedIPO(ipo);   // now storing full object {name, key}
    setShowPopup(true);
    setLoadingIPO(true);
    setIpoData(null);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedIPO(null);
    setIpoData(null);
  };

  //  FETCH IPO DETAILS WHEN selectedIPO CHANGES
  useEffect(() => {
    if (selectedIPO) {
      axios
        .get(`http://localhost:5001/api/ipo?key=${selectedIPO.key}`)
        .then((res) => {
          setIpoData(res.data);
          setLoadingIPO(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingIPO(false);
        });
    }
  }, [selectedIPO]);

  //  UI RENDER
  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span style={styles.link} onClick={() => navigate("/sensex")}>Sensex</span>
          <span style={styles.link} onClick={() => navigate("/risk")}>Risk</span>
          <span style={styles.link}>Industries</span>
          <span style={styles.link}>People</span>
          <span style={styles.link}>Insights</span>
          <span style={styles.link} onClick={() => navigate("/information")}>Information</span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* BODY CONTENT */}
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

      {/* POPUP WINDOW */}
      {showPopup && selectedIPO && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>

            <h2>{selectedIPO.name}</h2>

            {/* LOADING TEXT */}
            {loadingIPO && <p>Loading IPO details...</p>}

            {/* IPO DATA FROM BACKEND */}
            {ipoData && (
              <div style={{ textAlign: "left", marginTop: "15px" }}>
                <h3>📌 IPOWatch Data</h3>
                <p><b>GMP:</b> {ipoData.ipowatch?.gmp || "N/A"}</p>
                <p><b>IPO Price:</b> {ipoData.ipowatch?.ipo_price || "N/A"}</p>
                <p><b>Listing Gain:</b> {ipoData.ipowatch?.listing_gain || "N/A"}</p>
                <p><b>IPO Type:</b> {ipoData.ipowatch?.ipo_type || "N/A"}</p>

                <hr style={{ margin: "15px 0" }} />

                <h3>📌 Market Data</h3>
                <p><b>Market Price:</b> {ipoData.market?.market_price || "N/A"}</p>
                <p><b>Market Cap:</b> {ipoData.market?.market_cap || "N/A"}</p>
                <p><b>Last Quarter Revenue:</b> {ipoData.market?.last_quarter_revenue || "N/A"}</p>
                <p><b>Sector:</b> {ipoData.market?.sector || "N/A"}</p>
                <p><b>Industry:</b> {ipoData.market?.industry || "N/A"}</p>
              </div>
            )}

            <button style={styles.closeBtn} onClick={closePopup}>Close</button>

          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */
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
    padding: "40px",
    textAlign: "center",
  },

  ipoGrid: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  ipoCard: {
    padding: "20px",
    background: "#2f4f3e",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    width: "260px",
    textAlign: "center",
    fontWeight: "600",
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  ipoImage: {
    width: "70px",
    height: "70px",
    background: "#cce1d2",
    borderRadius: "50%",
    marginBottom: "10px",
    border: "2px solid white",
  },

  ipoName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
  },

  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  popup: {
    background: "white",
    width: "420px",
    maxHeight: "80vh",
    overflowY: "auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  closeBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#2f4f3e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
