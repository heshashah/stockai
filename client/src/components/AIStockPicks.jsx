import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AIStockPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPicks() {
      try {
        const res = await axios.get("http://localhost:5001/api/ai-picks");
        setPicks(res.data.picks);
      } catch (error) {
        console.error("AI Picks Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPicks();
  }, []);

  return (
    <div className="ai-card">
      <h2>AI Stock Picks</h2>

      {loading ? (
        <p style={{ marginTop: "40px", color: "#777" }}>
          Loading AI insights…
        </p>
      ) : picks.length === 0 ? (
        <p>No AI stock picks available.</p>
      ) : (
        <ul className="ai-list">
          {picks.map((stock, idx) => (
            <li key={idx} className="ai-item">
              <strong>{stock.symbol}</strong> — ₹{stock.price.toFixed(2)}
              <br />
              <span
                style={{
                  color: stock.change > 0 ? "green" : stock.change < 0 ? "red" : "#555",
                  fontWeight: "bold",
                }}
              >
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
