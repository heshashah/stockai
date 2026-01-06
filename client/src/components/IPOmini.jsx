import React, { useEffect, useState } from "react";
import axios from "axios";

export default function IPOMini() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("IPOMini component loaded");
    const fetchIPOs = async () => {
      try {
        console.log("Fetching IPO data from backend...");
        const res = await axios.get("http://localhost:5001/ipo-predictions");

        console.log("IPO API response:", res.data);

        setIpos(res.data || []);
      } catch (err) {
        console.error("IPO Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIPOs();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      style={{ height: 360, overflowY: "auto" }}>

      <h2 className="text-2xl font-extrabold mb-4 text-gray-900">
        Upcoming IPO Predictions
      </h2>

      {loading && (
        <p className="text-gray-500">Loading IPO predictions…</p>
      )}

      {!loading && ipos.length === 0 && (
        <p className="text-gray-500">No IPO data available.</p>
      )}

      {!loading && ipos.map((ipo, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-300 hover:shadow-md transition-all"
        >
          <h3 className="font-bold text-lg text-gray-900">
            {ipo.name}
          </h3>

          <div className="mt-2 text-gray-700 space-y-1">
            <p><strong>Price Band:</strong> {ipo.price_band}</p>
            <p><strong>Open Date:</strong> {ipo.open_date}</p>
            <p><strong>Close Date:</strong> {ipo.close_date}</p>
            <p><strong>GMP:</strong> {ipo.gmp}</p>
            <p><strong>Predicted Listing:</strong> {ipo.predicted_listing_price}</p>

            {ipo.expected_gain_percent ? (
              <p>
                <strong>Expected Gain:</strong>{" "}
                <span
                  className={
                    parseFloat(ipo.expected_gain_percent) > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {ipo.expected_gain_percent}%
                </span>
              </p>
            ) : (
              <p className="text-gray-500">Prediction unavailable</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
