// Load .env
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
import Groq from "groq-sdk";

// ---------------- PATH SETUP ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- APP ----------------
const app = express();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------- CORS ----------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://stockai.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(express.json());

// ---------------- ROUTES ----------------
import sentimentRoutes from "./routes/sentimentRoute.js";
import niftyRoute from "./routes/niftyRoute.js";
import newsRoute from "./newsRoute.js";
import sensexRoute from "./routes/sensexRoute.js";
import sectorRoute from "./routes/sectorRoute.js";
import ipoRoute from "./routes/ipoRoute.js";
import aiPicksRoute from "./routes/aiPicksRoute.js";
import stockDirectionRoute from "./routes/stockDirectionRoute.js";
import peerDynamicRoute from "./routes/peerDynamicRoute.js";
import peerAlphaRoute from "./routes/peerAlphaRoute.js";

app.use("/api", sentimentRoutes);
app.use("/api/nifty", niftyRoute);
app.use("/api/news", newsRoute);
app.use("/api/sensex", sensexRoute);
app.use("/api", sectorRoute);
app.use("/", ipoRoute);
app.use("/api/ai-picks", aiPicksRoute);
app.use("/api/direction", stockDirectionRoute);
app.use("/api/peer-dynamic", peerDynamicRoute);
app.use("/api/peer-alpha", peerAlphaRoute);

// ---------------- GOOGLE LOGIN ----------------
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------------- MYSQL ----------------
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
    console.log("✅ MySQL connected");
  }
});

// ---------------- GOOGLE LOGIN API ----------------
app.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    db.query(
      "INSERT INTO users (name, email, picture) VALUES (?, ?, ?)",
      [name, email, picture],
      () => {
        res.json({
          message: "User saved",
          user: { name, email, picture },
        });
      }
    );
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// =================================================
// ✅ PEER COMPARISON AI ENGINE
// =================================================
app.post("/api/peer-ai", (req, res) => {
  try {
    const python = spawn("python3", ["ai/peer_ai.py"], {
      cwd: __dirname,
    });

    python.stdin.write(JSON.stringify(req.body));
    python.stdin.end();

    let output = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("🐍 Peer AI error:", data.toString());
    });

    python.on("close", () => {
      try {
        res.json(JSON.parse(output));
      } catch {
        res.status(500).json({
          error: "Invalid AI response",
          raw: output,
        });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Peer AI server error" });
  }
});

// =================================================
// ✅ IPO RISK API (ML ENGINE)
// =================================================
app.post("/api/risk", (req, res) => {
  try {
    const python = spawn("python3", ["ipo_risk_api.py"], {
      cwd: __dirname,
    });

    python.stdin.write(JSON.stringify(req.body));
    python.stdin.end();

    let output = "";

    python.stdout.on("data", (d) => (output += d.toString()));

    python.on("close", () => {
      try {
        res.json(JSON.parse(output));
      } catch {
        res.status(500).json({ error: "ML Engine Failed" });
      }
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// =================================================
// ✅ IPO DETAILS (IPO WATCH + GROQ + SENTIMENT)
// =================================================
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
    // -------- IPOWATCH --------
    const py1 = spawn("python3", ["get_ipo_data.py"], {
      cwd: __dirname,
    });

    py1.stdin.write(JSON.stringify({ key }));
    py1.stdin.end();

    let ipoOutput = "";

    py1.stdout.on("data", (d) => (ipoOutput += d.toString()));

    py1.on("close", async () => {
      let ipowatchData = {};

      try {
        ipowatchData = JSON.parse(ipoOutput);
      } catch {
        return res.json({
          error: "Invalid IPOWatch output",
          raw: ipoOutput,
        });
      }

      // -------- GROQ AI HEADLINES --------
      const prompt = `
Generate 3 realistic news headlines about IPO "${ipoName}"
- one positive
- one negative
- one neutral
Return ONLY JSON array
`;

      let aiHeadlines = [];

      try {
        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        });

        aiHeadlines = JSON.parse(
          response.choices[0].message.content
        );
      } catch {
        aiHeadlines = [
          `${ipoName} IPO opens for subscription`,
          `${ipoName} IPO sees mixed response`,
          `${ipoName} IPO faces cautious sentiment`,
        ];
      }

      // -------- SENTIMENT ML --------
      const py2 = spawn("python3", ["python/ipo_sentiment.py"], {
        cwd: __dirname,
      });

      py2.stdin.write(JSON.stringify({ news: aiHeadlines }));
      py2.stdin.end();

      let sentiOutput = "";

      py2.stdout.on("data", (d) => (sentiOutput += d.toString()));

      py2.on("close", () => {
        let sentiment = {};

        try {
          sentiment = JSON.parse(sentiOutput);
        } catch {
          sentiment = {
            sentiment: "Unknown",
            overall_score: 0,
            details: [],
          };
        }

        const market = {
          market_price: Math.floor(Math.random() * 500),
          market_cap: `${Math.floor(Math.random() * 10000)} Cr`,
          last_quarter_revenue: `${Math.floor(Math.random() * 1000)} Cr`,
          sector: "Technology",
          industry: "Software Services",
        };

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

// =================================================
// ✅ AI IPO TEXT RISK
// =================================================
app.post("/api/ipo/ai", (req, res) => {
  const python = spawn("python3", ["ipo_risk_api.py"], {
    cwd: __dirname,
  });

  python.stdin.write(JSON.stringify(req.body));
  python.stdin.end();

  let result = "";

  python.stdout.on("data", (d) => (result += d.toString()));

  python.on("end", () => {
    try {
      res.json(JSON.parse(result));
    } catch {
      res.status(500).json({ error: "AI model failed" });
    }
  });

  python.stderr.on("data", (e) => {
    console.error("AI ERROR:", e.toString());
  });
});

// ---------------- ROOT ----------------
app.get("/", (req, res) => {
  res.json({
    service: "StockAI Backend",
    status: "running",
    port: process.env.PORT || "dynamic",
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 StockAI backend running on port ${PORT}`);
});
