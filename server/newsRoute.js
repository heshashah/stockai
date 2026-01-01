import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/stock-news", async (req, res) => {
  try {
    console.log("Hitting /stock-news route...");

    const url = `https://newsapi.org/v2/everything?q=stocks&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
    console.log("Fetching:", url);

    const response = await axios.get(url);

    res.json(response.data.articles);
  } catch (err) {
    console.error("Backend ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
