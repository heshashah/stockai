import express from "express";
import axios from "axios";

const router = express.Router();

// range=1D or 1W or 1M
router.get("/", async (req, res) => {
  try {
    const range = req.query.range || "1D";

    const yahooRanges = {
      "1D": "1d",
      "1W": "5d",
      "1M": "1mo",
      "3M": "3mo",
      "1Y": "1y",
      "5Y": "5y",
    };

    const interval = range === "1D" ? "5m" : "1d";

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?range=${yahooRanges[range]}&interval=${interval}`
    );

    res.json(response.data);
  } catch (err) {
    console.error("Sensex Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch Sensex data" });
  }
});

export default router;
