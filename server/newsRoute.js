const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.get("/stock-news", async (req, res) => {
  try {
    console.log("Hitting /stock-news route...");  // <--- NEW

    const url = `https://newsapi.org/v2/everything?q=stocks&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
    console.log("Fetching:", url);  // <--- NEW

    const response = await axios.get(url);

    // console.log("API Response:", response.data);  // <--- NEW

    res.json(response.data.articles);
  } catch (err) {
    console.error("Backend ERROR:", err.message);  // <--- NEW
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
