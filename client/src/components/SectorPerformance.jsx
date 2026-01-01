import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SectorPerformance() {
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const res = await axios.get("http://localhost:5003/sector");
        setSectorData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Sector Fetch Error:", err);
        setError("Failed to load sector performance data");
        setLoading(false);
      }
    };

    fetchSectorData();
  }, []);

  return (
    <div
      className="p-6 bg-white rounded-xl shadow-lg"
      style={{ width: "100%", height: 360 }}
    >
      <h2 className="text-2xl font-bold mb-4">Sector Performance</h2>

      {loading && <p className="text-gray-600">Loading sector chart…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={sectorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="sector"
              interval={0}
              angle={-20}
              textAnchor="end"
              tick={{ fontSize: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="performance" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
