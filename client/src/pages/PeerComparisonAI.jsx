import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PeerComparison() {
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [domain, setDomain] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 NEW STATES FOR COMPARISON
  const [companyA, setCompanyA] = useState("");
  const [companyB, setCompanyB] = useState("");

  // 🔹 load domains dynamically
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/peer-alpha/domains")
      .then((res) => {
        setDomains(["None", ...res.data]);
        setDomain("None");
      });
  }, []);

  // 🔹 analyze when domain changes
  useEffect(() => {
    if (!domain || domain === "None") {
      setData([]);
      setCompanyA("");
      setCompanyB("");
      return;
    }

    setLoading(true);

    axios
      .post("http://localhost:5001/api/peer-alpha/analyze", { domain })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [domain]);

  const selectedA = data.find(c => c.name === companyA);
  const selectedB = data.find(c => c.name === companyB);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span style={styles.link} onClick={() => navigate("/direction")}>Direction</span>
          <span style={styles.link} onClick={() => navigate("/risk")}>Risk</span>
          <span style={styles.link} onClick={() => navigate("/peer-comparison")}>Comparison</span>
          <span style={styles.link} onClick={() => navigate("/information")}>Information</span>
          <span style={styles.link} onClick={() => navigate("/news")}>News</span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
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
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {domain === "None" && (
          <p style={{ fontSize: "13px", color: "#666", marginTop: "8px" }}>
            Please select a domain to view AI comparison.
          </p>
        )}

        {loading && <p>Loading AI analysis...</p>}

        {!loading && data.length > 0 && (
          <>
            {/* MAIN TABLE */}
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

            {/* ---------------- COMPARE TWO COMPANIES ---------------- */}
            <div style={{ marginTop: "50px" }}>
              <h2>Compare Two Companies</h2>

              <div style={{ display: "flex", justifyContent: "center", gap: "20px", margin: "20px 0" }}>
                <select
                  value={companyA}
                  onChange={(e) => setCompanyA(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select Company A</option>
                  {data.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={companyB}
                  onChange={(e) => setCompanyB(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select Company B</option>
                  {data.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {selectedA && selectedB && companyA === companyB && (
                <p style={{ color: "red", marginTop: "15px", fontWeight: "500" }}>
                  Please select two different companies to compare.
                </p>
              )}
              {selectedA && selectedB && companyA !== companyB && (
                <div style={styles.tableCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>{selectedA.name}</th>
                        <th>{selectedB.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>P/E</td><td>{selectedA.pe}</td><td>{selectedB.pe}</td></tr>
                      <tr><td>Profit Growth %</td><td>{selectedA.profit_growth}</td><td>{selectedB.profit_growth}</td></tr>
                      <tr><td>Sales Growth %</td><td>{selectedA.sales_growth}</td><td>{selectedB.sales_growth}</td></tr>
                      <tr><td>ROCE %</td><td>{selectedA.roce}</td><td>{selectedB.roce}</td></tr>
                      <tr><td><b>AI Score</b></td><td><b>{selectedA.ai_score}</b></td><td><b>{selectedB.ai_score}</b></td></tr>
                      <tr><td><b>AI Rating</b></td><td>{selectedA.ai_rating}</td><td>{selectedB.ai_rating}</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: { minHeight: "100vh", background: "#f4f6f5", fontFamily: "Poppins" },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 50px",
    background: "#2f4f3e",
    color: "white",
    alignItems: "center"
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

  body: { padding: "40px", textAlign: "center" },

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
