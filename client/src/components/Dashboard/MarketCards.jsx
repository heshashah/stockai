import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MarketCards() {
  const [sensex, setSensex] = useState("Loading...");
  const [nifty, setNifty] = useState("Loading...");
  const [sentiment, setSentiment] = useState("Loading...");
  const [gainer, setGainer] = useState("Loading...");
  const [loser, setLoser] = useState("Loading...");

  useEffect(() => {

    // FETCH SENSEX LAST PRICE
    axios
      .get("http://localhost:5001/api/sensex?range=1D")
      .then((res) => {
        const result = res.data.chart.result[0];
        const close = result.indicators.quote[0].close;
        const lastPrice = close[close.length - 1];
        setSensex(lastPrice.toFixed(2));
      })
      .catch(() => setSensex("Error"));

    // FETCH NIFTY LAST PRICE (FIXED)
    axios
      .get("http://localhost:5001/api/nifty?range=1D")
      .then((res) => {
        const result = res.data.chart.result[0];
        const close = result.indicators.quote[0].close;
        const lastPrice = close[close.length - 1];
        setNifty(lastPrice.toFixed(2));
      })
      .catch(() => setNifty("Error"));

    // TEMPORARY SENTIMENT (until API built)
    setSentiment("Bullish");

    // TEMPORARY TOP GAINER & LOSER
    setGainer("RELIANCE +2.4%");
    setLoser("TCS -1.1%");
  }, []);

  const cards = [
    { title: "Sensex", value: sensex },
    { title: "Nifty 50", value: nifty },
    { title: "Market Sentiment", value: sentiment },
    { title: "Top Gainer", value: gainer },
    { title: "Top Loser", value: loser },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((c, i) => (
        <div key={i} style={styles.card}>
          <h4 style={styles.title}>{c.title}</h4>
          <p style={styles.value}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    margin: 0,
    color: "#555",
    fontSize: "14px",
  },
  value: {
    marginTop: "10px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#2f4f3e",
  },
};
