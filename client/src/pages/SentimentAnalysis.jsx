import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function SentimentAnalysis() {
  const navigate = useNavigate();
  const { ipoKey } = useParams();

  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ipoKey) return;

    setLoading(true);

    // 1️⃣ Fetch IPO specific news
    axios
      .get(`http://localhost:5001/api/ipo/news?key=${ipoKey}`)
      .then((newsRes) => {
        // 2️⃣ Run sentiment on that news
        return axios.post("http://localhost:5001/api/sentiment", {
          news: newsRes.data.news,
        });
      })
      .then((sentimentRes) => {
        setSentiment(sentimentRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Sentiment error:", err);
        setLoading(false);
      });
  }, [ipoKey]);

  if (loading) {
    return <h2 style={{ padding: 20 }}>⏳ Loading sentiment…</h2>;
  }

  if (!sentiment) {
    return (
      <h2 style={{ padding: 20, color: "red" }}>
        {/* ❌ Failed to load sentiment. */}
      </h2>
    );
  }

  const details = sentiment.details || [];

  const lineData = {
    labels: details.map((d) => d.headline.slice(0, 20)),
    datasets: [
      {
        label: "Headline Sentiment Score",
        data: details.map((d) => d.score),
        tension: 0.25,
      },
    ],
  };

  const pieData = {
    labels: ["Sentiment Score"],
    datasets: [
      {
        data: [sentiment.overall_score],
      },
    ],
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR (SAME AS NEWS PAGE) */}
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

      {/* BODY */}
      <div style={styles.body}>
        <h1 style={{ marginBottom: "20px" }}>
          📊 IPO Sentiment Analysis —{" "}
          {ipoKey.replace(/_/g, " ").toUpperCase()}
        </h1>

        <p style={{ color: "#333" }}>
          Understanding investor emotions based on related news headlines.
        </p>

        {/* OVERALL RESULT */}
        <div style={{ marginTop: "25px" }}>
          <h2>
            Overall Sentiment:{" "}
            <span
              style={{
                color:
                  sentiment.sentiment === "Positive"
                    ? "green"
                    : sentiment.sentiment === "Negative"
                    ? "red"
                    : "orange",
              }}
            >
              {sentiment.sentiment}
            </span>
          </h2>

          <h3>Score: {sentiment.overall_score}</h3>

          <button
            style={styles.backBtn}
            onClick={() => navigate("/risk")}
          >
            ← Back to IPO Risk
          </button>
        </div>

        {/* CHARTS */}
        <div style={{ marginTop: "40px" }}>
          <div style={{ width: "300px", marginBottom: "30px" }}>
            <Pie data={pieData} />
          </div>

          <div style={{ width: "600px" }}>
            <Line data={lineData} />
          </div>
        </div>

        {/* HEADLINES */}
        <h2 style={{ marginTop: "40px" }}>📰 Headline Breakdown</h2>

        {details.map((d, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardText}>
              <h3 style={styles.cardTitle}>{d.headline}</h3>
              <p
                style={{
                  ...styles.cardDesc,
                  color:
                    d.score > 0.2
                      ? "green"
                      : d.score < -0.2
                      ? "red"
                      : "orange",
                }}
              >
                Score: {d.score}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- STYLES (MATCHES NEWS PAGE) ---------------- */
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
    padding: "50px",
    maxWidth: "900px",
    margin: "auto",
  },

  backBtn: {
    marginTop: "15px",
    padding: "8px 16px",
    border: "1px solid #2f4f3e",
    background: "transparent",
    color: "#2f4f3e",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    padding: "15px",
    background: "white",
    borderRadius: "12px",
    alignItems: "center",
    boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
  },

  cardText: {
    flex: 1,
  },

  cardTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },

  cardDesc: {
    marginTop: "6px",
    fontSize: "14px",
  },
};
