import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Update() {
  const navigate = useNavigate();

  const [sensexData, setSensexData] = useState([]);
  const [latestPrice, setLatestPrice] = useState(null);
  const [change, setChange] = useState(null);

  useEffect(() => {
    fetchSensexData();
    const interval = setInterval(fetchSensexData, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ ✅ ✅ FIXED FETCH FUNCTION (PORT 5001 + SINGLE POINT SUPPORT)
  const fetchSensexData = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/sensex");
      const data = await res.json();

      console.log("✅ API DATA:", data);

      const formatted = [
        {
          time: data.date,
          price: data.close,
        },
      ];

      console.log("✅ FORMATTED DATA:", formatted);

      setSensexData(formatted);
      setLatestPrice(data.close.toFixed(2));
      setChange((data.close - data.open).toFixed(2));
    } catch (error) {
      console.error("❌ Sensex Fetch Error:", error);
    }
  };

  return (
    <div style={styles.page}>
      {/* ✅ NAVBAR */}
      <div style={styles.navbar}>
        <h3 style={styles.logo}>StockAI</h3>

        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/dashboard")}>
            Dashboard
          </span>

          <span style={styles.link} onClick={() => navigate("/update")}>
            Daily Updates
          </span>

          <span style={styles.link}>Industries</span>
          <span style={styles.link}>People</span>
          <span style={styles.link}>Insights</span>

          <span style={styles.link} onClick={() => navigate("/information")}>
            Information
          </span>
        </div>

        <div>
          <button style={styles.phoneBtn}>1-800-366-9833</button>
          <button style={styles.contactBtn}>Contact us</button>
        </div>
      </div>

      {/* ✅ BODY */}
      <div style={styles.body}>
        <h1>BSE SENSEX Live</h1>

        <h2>{latestPrice}</h2>

        <p style={{ color: change < 0 ? "red" : "green" }}>
          {change < 0 ? "▼" : "▲"} {change}
        </p>

        {/* ✅ ✅ ✅ FIXED LIVE CHART */}
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            height: "350px",
            margin: "40px auto",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {sensexData.length === 0 ? (
            <p>Loading chart...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensexData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />

                {/* ✅ DOT IS REQUIRED FOR SINGLE DATA POINT */}
                <Line
                  type="monotone"
                  dataKey="price"
                  strokeWidth={3}
                  dot={{ r: 8 }}
                  activeDot={{ r: 10 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Update;

/* ✅ INTERNAL CSS */
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
    letterSpacing: "1px",
  },

  navLinks: {
    display: "flex",
    gap: "25px",
    fontSize: "14px",
    fontWeight: "500",
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
    textAlign: "center",
    background: "#f4f6f5",
  },
};
