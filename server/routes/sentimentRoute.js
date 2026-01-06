import express from "express";
const router = express.Router();

/* ---------------------------------------
   TEST ROUTE
----------------------------------------- */
router.get("/ipo/news", (req, res) => {
  const key = req.query.key || "unknown";

  console.log("✅ /ipo/news HIT with:", key);

  res.status(200).json({
    news: [
      `${key} IPO attracts investor attention`,
      `Analysts review ${key} fundamentals`,
      `Market discusses ${key} IPO prospects`,
    ],
  });
});

/* ---------------------------------------
   TEST SENTIMENT
----------------------------------------- */
router.post("/sentiment", (req, res) => {
  const news = req.body.news || [];

  // 🔥 create different scores based on text length
  const details = news.map((h) => {
    const score =
      ((h.length % 20) - 10) / 10; // range roughly -1 to +1
    return {
      headline: h,
      score: Number(score.toFixed(2)),
    };
  });

  const avg =
    details.reduce((a, b) => a + b.score, 0) / (details.length || 1);

  const sentiment =
    avg > 0.15 ? "Positive" : avg < -0.15 ? "Negative" : "Neutral";

  res.json({
    overall_score: Number(avg.toFixed(2)),
    sentiment,
    details,
  });
});


export default router;
