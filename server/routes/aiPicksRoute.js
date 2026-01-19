import express from "express";
import axios from "axios";

const router = express.Router();

const SYMBOLS = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "LT.NS"];

// 🔹 Fallback data (used if API fails)
const FALLBACK_PICKS = [
  { symbol: "RELIANCE.NS", price: 2520, change: 32, changePercent: 1.3 },
  { symbol: "TCS.NS", price: 3860, change: -45, changePercent: -1.1 },
  { symbol: "INFY.NS", price: 1655, change: 18, changePercent: 1.1 },
  { symbol: "HDFCBANK.NS", price: 1520, change: -12, changePercent: -0.7 },
  { symbol: "LT.NS", price: 3420, change: 55, changePercent: 1.6 }
];

router.get("/", async (req, res) => {
  try {
    const results = [];

    for (let symbol of SYMBOLS) {
      try {
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        const response = await axios.get(url, { timeout: 8000 });

        const quote = response.data?.quoteResponse?.result?.[0];

        if (!quote || quote.regularMarketPrice == null) {
          console.log(`⚠️ No quote for ${symbol}`);
          continue;
        }

        results.push({
          symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
        });
      } catch (err) {
        console.log(`❌ Error fetching ${symbol}:`, err.message);
      }
    }

    // 🔥 If Yahoo gave nothing → use fallback
    if (results.length === 0) {
      console.warn("⚠️ Using fallback AI picks");
      return res.json({ picks: FALLBACK_PICKS });
    }

    res.json({ picks: results });

  } catch (error) {
    console.error("AI Picks Fatal Error:", error);
    res.status(500).json({ error: "Failed to fetch AI stock picks" });
  }
});

export default router;
