import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewsPage() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/news/stock-news")
      .then((res) => setNews(res.data))
      .catch((err) => console.log(err));
  }, []);

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
          <span style={styles.link} onClick={() => navigate("/peer-comparison")}>Comparison</span>
          <span style={styles.link} onClick={() => navigate("/information")}>Information</span>
          <span style={styles.link} onClick={() => navigate("/news")}>News</span>
        </div>
        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* NEWS BODY */}
      <div style={styles.body}>
        <h1 style={{ marginBottom: "30px" }}>Latest Stock Market News</h1>

        {news.map((item, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => window.open(item.url, "_blank")}
          >
            <img
              src={
                item.urlToImage ||
                "https://via.placeholder.com/150x100?text=No+Image"
              }
              alt="news"
              style={styles.cardImage}
            />

            <div style={styles.cardText}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* INTERNAL CSS */
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

  card: {
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
    padding: "15px",
    background: "white",
    borderRadius: "12px",
    cursor: "pointer",
    alignItems: "center",
    boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
    transition: "0.2s ease-in-out",
  },

  cardHover: {
    transform: "scale(1.02)",
  },

  cardImage: {
    width: "150px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "10px",
    backgroundColor: "#eee",
  },

  cardText: {
    flex: 1,
  },

  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
  },

  cardDesc: {
    color: "gray",
    marginTop: "5px",
    fontSize: "14px",
  },
};
