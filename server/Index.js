// Load .env for ES modules
import dotenv from "dotenv";
dotenv.config();

// Imports
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";


// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Groq SDK
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Express App
const app = express();

/* ---------------------------------------
   FRONTEND CONFIG
----------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

/* ---------------------------------------
   LOAD ROUTES
----------------------------------------- */
import sentimentRoutes from "./sentimentRoute.js";
app.use("/api", sentimentRoutes);

import niftyRoute from "./routes/niftyRoute.js";
app.use("/api/nifty", niftyRoute);

import newsRoute from "./newsRoute.js";
app.use("/api/news", newsRoute);

import sensexRoute from "./routes/sensexRoute.js";
app.use("/api/sensex", sensexRoute);

/* ---------------------------------------
   GOOGLE LOGIN SETUP
----------------------------------------- */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ---------------------------------------
   MYSQL CONNECTION
----------------------------------------- */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

/* ---------------------------------------
   GOOGLE LOGIN API
----------------------------------------- */
app.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    db.query(
      "INSERT INTO users (name, email, picture) VALUES (?, ?, ?)",
      [name, email, picture],
      (err) => {
        if (err) return res.status(500).json({ error: "DB error" });

        res.json({ message: "User saved", user: { name, email, picture } });
      }
    );
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

/* ---------------------------------------
   IPO RISK API (PYTHON ML ENGINE)
----------------------------------------- */
app.post("/api/risk", (req, res) => {
  try {
    const python = spawn(
      "/Users/heshashah/stockai/server/venv/bin/python3",
      ["ipo_risk_api.py"],
      { cwd: __dirname }
    );

    python.stdin.write(JSON.stringify(req.body));
    python.stdin.end();

    let output = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.on("close", () => {
      try {
        const result = JSON.parse(output);
        res.json(result);
      } catch (error) {
        console.error("❌ Python output error:", error);
        res.status(500).json({ error: "ML Engine Failed" });
      }
    });
  } catch (error) {
    console.error("❌ Node Risk API error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------
   IPO DETAILS API (GROQ + Sentiment)
----------------------------------------- */
app.get("/api/ipo", async (req, res) => {
  const key = req.query.key;

  if (!key) return res.status(400).json({ error: "Missing key" });

  const ipoList = await import("./ipo_list.json", {
    assert: { type: "json" },
  });

  if (!ipoList.default[key])
    return res.status(404).json({ error: "Invalid IPO key" });

  const ipoName = ipoList.default[key];

  try {
    /* 1️⃣ Fetch IPOWatch data */
    const py1 = spawn(
      "/Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12",
      ["get_ipo_data.py"]
    );

    py1.stdin.write(JSON.stringify({ key }));
    py1.stdin.end();

    let ipoOutput = "";
    py1.stdout.on("data", (d) => (ipoOutput += d.toString()));

    py1.on("close", async () => {
      let ipowatchData = {};
      try {
        ipowatchData = JSON.parse(ipoOutput);
      } catch (err) {
        return res.json({ error: "Invalid IPOWatch output", raw: ipoOutput });
      }

      /* 2️⃣ Generate AI Headlines (Groq) */
      const prompt = `
Generate 3 realistic and unique news headlines about the IPO "${ipoName}".
- One positive
- One negative
- One neutral
Output ONLY a JSON array.
`;

      let aiHeadlines = [];

      try {
        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        });

        aiHeadlines = JSON.parse(response.choices[0].message.content);
      } catch (err) {
        aiHeadlines = [
          `${ipoName} IPO opens for subscription`,
          `${ipoName} IPO receives mixed investor sentiment`,
          `${ipoName} IPO sees cautious demand`,
        ];
      }

      /* 3️⃣ Run sentiment analysis */
      const py2 = spawn(
        "/Users/heshashah/stockai/venv/bin/python3",
        ["/Users/heshashah/stockai/python/ipo_sentiment.py"],
        { shell: true }
      );

      py2.stdin.write(JSON.stringify({ news: aiHeadlines }));
      py2.stdin.end();

      let sentiOutput = "";
      py2.stdout.on("data", (d) => (sentiOutput += d.toString()));

      py2.on("close", () => {
        let sentiment = {};
        try {
          sentiment = JSON.parse(sentiOutput);
        } catch (err) {
          sentiment = {
            sentiment: "Unknown",
            overall_score: 0,
            details: [],
          };
        }

        /* 4️⃣ Prepare dummy market data */
        const market = {
          market_price: Math.floor(Math.random() * 500),
          market_cap: `${Math.floor(Math.random() * 10000)} Cr`,
          last_quarter_revenue: `${Math.floor(Math.random() * 1000)} Cr`,
          sector: "Technology",
          industry: "Software Services",
        };

        /* 5️⃣ Final Response */
        res.json({
          ipowatch: ipowatchData,
          market,
          sentiment: sentiment.sentiment,
          sentiment_score: sentiment.overall_score,
          sentiment_details: sentiment.details,
          ai_news: aiHeadlines,
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------
   AI IPO RISK (TEXT ML)
----------------------------------------- */
app.post("/api/ipo/ai", (req, res) => {
  const python = spawn("python3", ["ipo_risk_api.py"]);

  python.stdin.write(JSON.stringify(req.body));
  python.stdin.end();

  let result = "";

  python.stdout.on("data", (chunk) => {
    result += chunk.toString();
  });

  python.stdout.on("end", () => {
    try {
      res.json(JSON.parse(result));
    } catch (err) {
      res.status(500).json({ error: "AI model failed" });
    }
  });

  python.stderr.on("data", (data) => {
    console.error("AI ERROR:", data.toString());
  });
});

import sectorRoute from "./routes/sectorRoute.js";
app.use("/api", sectorRoute);

/* ---------------------------------------
   TEST ROUTE
----------------------------------------- */
app.get("/test", (req, res) => {
  res.send("Backend is working");
});

/* ---------------------------------------
   START SERVER
----------------------------------------- */
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
