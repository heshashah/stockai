import React, { useEffect, useState } from "react";
import axios from "axios";

export default function IPOMini() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIPOs = async () => {
      try {
        const res = await axios.get("http://localhost:5006/ipo-predictions");
        setIpos(res.data);
      } catch (err) {
        console.error("IPO Fetch Error:", err);
      }
      setLoading(false);
    };

    fetchIPOs();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md" style={{ height: 360, overflowY: "auto" }}>
      <h2 className="text-2xl font-bold mb-4">Upcoming IPO Predictions</h2>

      {loading && <p>Loading IPO predictions…</p>}

      {!loading && ipos.length === 0 && (
        <p className="text-gray-500">No IPO data available.</p>
      )}

      {!loading &&
        ipos.map((ipo, index) => (
          <div key={index} className="border-b pb-3 mb-3">
            <h3 className="font-semibold text-lg">{ipo.name}</h3>
            <p>Price Band: {ipo.price_band}</p>
            <p>GMP: ₹{ipo.gmp}</p>

            {ipo.predicted_listing_price ? (
              <>
                <p>Predicted Listing: ₹{ipo.predicted_listing_price}</p>
                <p>
                  Expected Gain:{" "}
                  <span style={{ color: ipo.expected_gain_percent > 0 ? "green" : "red" }}>
                    {ipo.expected_gain_percent}%
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-500">Prediction unavailable</p>
            )}
          </div>
        ))}
    </div>
  );
}
