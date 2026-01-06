import express from "express";
import yahooFinance from "yahoo-finance2";

const router = express.Router();

const SYMBOLS = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "LT.NS"];

router.get("/", async (req, res) => {
  try {
    const results = [];

    for (let symbol of SYMBOLS) {
      try {
        const quote = await yahooFinance.quote(symbol);

        results.push({
          symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
        });
      } catch (err) {
        console.log(`Skipping ${symbol}:`, err.message);
      }
    }

    res.json({ picks: results });
  } catch (error) {
    console.error("AI Picks Error:", error);
    res.status(500).json({ error: "Failed to fetch AI stock picks" });
  }
});

export default router;