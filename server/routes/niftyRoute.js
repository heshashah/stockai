import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=1d&interval=1d"
    );

    const result = response.data.chart.result[0];
    const price = result.indicators.quote[0].close[0];

    res.json({ value: price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nifty Fetch Failed" });
  }
});

export default router;
