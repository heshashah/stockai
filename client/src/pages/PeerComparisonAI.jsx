import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PeerComparison() {
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [domain, setDomain] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 load domains dynamically
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/peer-alpha/domains")
      .then((res) => {
        setDomains(res.data);
        setDomain(res.data[0]);
      });
  }, []);

  // 🔹 analyze when domain changes
  useEffect(() => {
    if (!domain) return;

    setLoading(true);

    axios
      .post("http://localhost:5001/api/peer-alpha/analyze", { domain })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [domain]);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span style={styles.link} onClick={() => navigate("/direction")}>Direction</span>
          <span style={styles.link} onClick={() => navigate("/risk")}>Risk</span>
          <span style={styles.link} onClick={() => navigate("/peer-comparison")}>Peer AI</span>
          <span style={styles.link} onClick={() => navigate("/information")}>Information</span>
          <span style={styles.link} onClick={() => navigate("/news")}>News</span>
        </div>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        <h1>AI Peer Comparison</h1>

        {/* DOMAIN DROPDOWN */}
        <div style={styles.dropdownBox}>
          <label><b>Select Domain:</b></label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            style={styles.select}
          >
            {domains.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {loading && <p>Loading AI analysis...</p>}

        {!loading && (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Company</th>
                  <th>P/E</th>
                  <th>Profit Growth %</th>
                  <th>Sales Growth %</th>
                  <th>ROCE %</th>
                  <th>AI Score</th>
                  <th>AI Rating</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c, i) => (
                  <tr key={i}>
                    <td><b>#{i + 1}</b></td>
                    <td>{c.name}</td>
                    <td>{c.pe?.toFixed(1)}</td>
                    <td>{c.profit_growth?.toFixed(1)}</td>
                    <td>{c.sales_growth?.toFixed(1)}</td>
                    <td>{c.roce?.toFixed(1)}</td>
                    <td><b>{c.ai_score}</b></td>
                    <td style={ratingStyle(c.ai_rating)}>{c.ai_rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
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

  phoneBtn: {
    marginRight: "12px",
    padding: "8px 16px",
    border: "1px solid white",
    background: "transparent",
    color: "white",
    borderRadius: "6px"
  },

  contactBtn: {
    padding: "8px 16px",
    background: "white",
    color: "#2f4f3e",
    borderRadius: "6px",
    fontWeight: "600"
  },

  body: {
    padding: "40px",
    textAlign: "center"
  },

  dropdownBox: {
    margin: "20px auto",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    justifyContent: "center"
  },

  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  note: {
    fontSize: "13px",
    color: "#555"
  },

  tableCard: {
    marginTop: "20px",
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};

const ratingStyle = (r) => ({
  fontWeight: "bold",
  color:
    r === "Strong Buy" ? "green" :
    r === "Good" ? "blue" :
    r === "Average" ? "orange" : "red"
});
