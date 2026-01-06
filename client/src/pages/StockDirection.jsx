import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StockDirection() {
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState("AAPL");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predictDirection = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await axios.post("http://localhost:5001/api/direction", {
        symbol,
      });

      setResult(res.data);
    } catch (err) {
      setError("Prediction failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

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
          <span style={styles.link} onClick={() => navigate("/stock-direction")}>Direction</span>
          <span style={styles.link} onClick={() => navigate("/news")}>News</span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        <div style={styles.card}>
          <h2 style={styles.heading}>AI Stock Direction Predictor</h2>

          <label style={styles.label}>Stock Symbol</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            style={styles.select}
          >
            <option>-- Select Stock Symbol --</option>
            <option>AAPL</option>
            <option>MSFT</option>
            <option>GOOGL</option>
            <option>AMZN</option>
            <option>TSLA</option>
            <option>META</option>
            <option>NFLX</option>
          </select>

          <button style={styles.predictBtn} onClick={predictDirection}>
            {loading ? "Analyzing..." : "Predict Direction"}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          {result && (
            <div style={styles.resultBox}>
              <h3
                style={{
                  color:
                    result.prediction.direction === "BULLISH"
                      ? "green" 
                      : "red",
                }}
              >
                {result.prediction.direction}
              </h3>

              <p><strong>Confidence:</strong> {result.prediction.confidence}%</p>

              <ul>
                {result.prediction.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StockDirection;

/* ====================== STYLES (MUST BE HERE) ====================== */

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
  },
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
  body: {
    padding: "45px 60px",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "600px",
  },
  heading: {
    marginBottom: "20px",
  },
  label: {
    fontWeight: "500",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  predictBtn: {
    width: "100%",
    padding: "14px",
    background: "#3b6df6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
  resultBox: {
    marginTop: "25px",
    background: "#f7f9ff",
    padding: "20px",
    borderRadius: "10px",
  },
};
