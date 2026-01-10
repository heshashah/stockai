import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AccuracyWidget() {
  const [acc, setAcc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5008/api/accuracy-this-month")
      .then((res) => {
        setAcc(res.data);
        setLoading(false);
      })
      .catch(() => {
        setAcc(null);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        textAlign: "center",
      }}
    >
      <h3>Model Accuracy (This Month)</h3>

      {/* 🔹 LOADING STATE */}
      {loading && <p>Loading accuracy...</p>}

      {/* 🔹 DATA STATE */}
      {!loading && acc && acc.accuracy !== null && (
        <h1 style={{ color: "#2563eb" }}>
          {acc.accuracy}%
        </h1>
      )}

      {/* 🔹 EMPTY STATE */}
      {!loading && (!acc || acc.accuracy === null) && (
        <p style={{ color: "#666" }}>
          No validation data yet
        </p>
      )}
    </div>
  );
}
