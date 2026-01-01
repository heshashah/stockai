import express from "express";
import { spawn } from "child_process";

const router = express.Router();

/* ---------------------------------------
   SENTIMENT ANALYSIS (Python)
----------------------------------------- */
router.post("/sentiment", (req, res) => {
  const news = req.body.news;

  const python = spawn(
    "/Users/heshashah/stockai/venv/bin/python3",
    ["/Users/heshashah/stockai/python/ipo_sentiment.py"],
    { shell: true }
  );

  python.stdin.write(JSON.stringify({ news }));
  python.stdin.end();

  let output = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (err) => {
    console.error("🐍 PYTHON ERROR:", err.toString());
  });

  python.on("close", () => {
    console.log("🔥 PYTHON RAW OUTPUT:", output);
    try {
      const response = JSON.parse(output);
      res.json(response);
    } catch (error) {
      console.error("❌ Parse Error — Python returned:", output);
      res.status(500).json({
        error: "Failed to parse Python response",
        raw: output,
      });
    }
  });
});

/* ---------------------------------------
   IPO NEWS SCRAPER
----------------------------------------- */
router.get("/ipo/news", (req, res) => {
  const python = spawn(
    "/Users/heshashah/stockai/venv/bin/python3",
    ["/Users/heshashah/stockai/python/scrape_ipo_news.py"],
    { shell: true }
  );

  let output = "";

  python.stdout.on("data", (data) => (output += data.toString()));

  python.on("close", () => {
    try {
      res.json(JSON.parse(output));
    } catch (err) {
      console.error("Python scrape error:", output);
      res.status(500).json({ error: "Scrape failed" });
    }
  });
});

export default router;
