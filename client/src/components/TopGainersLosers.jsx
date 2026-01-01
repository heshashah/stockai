import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TopGainersLosers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5004/gainers-losers");
        setData(res.data);
        setLoading(false);
      } catch (e) {
        setData(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>Market Movers</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>Market Movers</h2>
        <p style={{ color: "red" }}>Failed to load data</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Market Movers</h2>

      <div style={styles.row}>
        {/* TOP GAINERS */}
        <div style={styles.column}>
          <h3 style={styles.subTitle}>Top Gainers</h3>
          {data.gainers.map((g) => (
            <p key={g.symbol} style={{ color: "green" }}>
              {g.symbol}: +{g.change}%
            </p>
          ))}
        </div>

        {/* TOP LOSERS */}
        <div style={styles.column}>
          <h3 style={styles.subTitle}>Top Losers</h3>
          {data.losers.map((l) => (
            <p key={l.symbol} style={{ color: "red" }}>
              {l.symbol}: {l.change}%
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
  },
  column: {
    width: "45%",
  },
  subTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px",
  },
};
