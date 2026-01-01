import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/sector", async (req, res) => {
  try {
    const url =
      "https://priceapi.moneycontrol.com/techCharts/sector/indbs.json";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });

    console.log("MoneyControl RAW:", data);

    const formatted = data.map((item) => ({
      sector: item.name,
      performance: parseFloat(item.per_chg),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("MoneyControl Sector Error:", error.message);
    res.status(500).json({ error: "Failed to fetch sector data." });
  }
});

export default router;
