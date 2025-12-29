import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

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
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Example news (replace with scraped news later)
  const sampleNews = [
    "IPO shows strong demand from investors",
    "Company faces penalties from regulators",
    "Analysts predict decent listing gains",
  ];

  useEffect(() => {
    axios
      .post("http://localhost:5001/api/sentiment", { news: sampleNews })
      .then((res) => {
        setSentiment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const navStyle = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      padding: "20px 50px",
      background: "#2f4f3e",
      color: "white",
      alignItems: "center",
    },
    logo: { fontWeight: "600", fontSize: "18px" },
    navLinks: { display: "flex", gap: "25px", fontSize: "14px" },
    link: { cursor: "pointer", transition: "0.2s" },
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
  };

  if (loading)
    return <h2 style={{ padding: 20 }}>⏳ Loading sentiment analysis…</h2>;

  if (!sentiment)
    return (
      <h2 style={{ padding: 20, color: "red" }}>
        ❌ Failed to load sentiment.
      </h2>
    );

  // Prepare chart data
  const lineData = {
    labels: sentiment.details.map((d) => d.headline.slice(0, 20)),
    datasets: [
      {
        label: "Headline Sentiment Score",
        data: sentiment.details.map((d) => d.score),
        borderColor: "#2196F3",
        tension: 0.25,
      },
    ],
  };

  const pieData = {
    labels: ["Sentiment Score"],
    datasets: [
      {
        data: [sentiment.overall_score],
        backgroundColor: ["#4CAF50"],
      },
    ],
  };

  return (
    <div style={{ background: "#f4f6f5", minHeight: "100vh" }}>
      {/* ✅ NAVBAR (Copied from Dashboard) */}
      <div style={navStyle.navbar}>
        <h3 style={navStyle.logo}>StockAI</h3>

        <div style={navStyle.navLinks}>
          <span style={navStyle.link} onClick={() => navigate("/dashboard")}>
            Dashboard
          </span>

          <span style={navStyle.link} onClick={() => navigate("/sensex")}>
            Sensex
          </span>

          <span style={navStyle.link} onClick={() => navigate("/risk")}>
            Risk
          </span>

          <span style={navStyle.link} onClick={() => navigate("/sentiment")}>
            Sentiment
          </span>

          <span style={navStyle.link} onClick={() => navigate("/information")}>
            Information
          </span>

          <span style={navStyle.link} onClick={() => navigate("/news")}>
            News
          </span>
        </div>

        <div>
          <button style={navStyle.phoneBtn}>1-800-366-9833</button>
          <button style={navStyle.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* 📊 Sentiment Analysis UI Body */}
      <div style={{ padding: "40px" }}>
        <h1 style={{ marginBottom: "10px" }}>📊 IPO Sentiment Analysis</h1>
        <p style={{ color: "#333" }}>
          Understanding investor emotions based on related news headlines.
        </p>

        {/* OVERALL SCORE */}
        <div style={{ marginTop: "30px" }}>
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
        </div>

        {/* PIE CHART */}
        <div style={{ width: "350px", marginTop: "25px" }}>
          <Pie data={pieData} />
        </div>

        {/* LINE CHART */}
        <div style={{ width: "700px", marginTop: "45px" }}>
          <Line data={lineData} />
        </div>

        {/* HEADLINE BREAKDOWN */}
        <h2 style={{ marginTop: "50px" }}>📰 Headline Sentiment Breakdown</h2>

        {sentiment.details.map((item, i) => (
          <div
            key={i}
            style={{
              marginBottom: "12px",
              padding: "12px",
              border: "1px solid #ccc",
              width: "70%",
              borderRadius: "6px",
              background: "white",
            }}
          >
            <strong>{item.headline}</strong>
            <br />

            <span
              style={{
                color:
                  item.score > 0.2
                    ? "green"
                    : item.score < -0.2
                    ? "red"
                    : "orange",
              }}
            >
              Score: {item.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
