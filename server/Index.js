// ✅ Load variables from .env
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

// ⭐ ADD THIS (Required for Python execution)
const { spawn } = require("child_process");

// ✅ REQUIRED if Node < 18
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

/* FRONTEND */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

/* ✅ GOOGLE CLIENT */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ✅ MYSQL CONNECTION */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* ✅ TEST DB */
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

/* ✅ GOOGLE LOGIN API */
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

/* IPO RISK API (Python ML Engine) */

app.post("/api/risk", (req, res) => {
  try {
    const python = spawn(
      "/Users/heshashah/stockai/server/venv/bin/python3",
      ["ipo_risk_api.py"],
      { cwd: __dirname }
    );

    // send frontend payload to Python
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

/* IPO DETAILS API (IPOWatch + Yahoo Finance) */

app.get("/api/ipo", async (req, res) => {
  const key = req.query.key;

  if (!key) return res.status(400).json({ error: "Missing key" });

  // Load IPO list
  const path = require("path");
  const ipoList = require(path.join(__dirname, "ipo_list.json"));


  if (!ipoList[key])
    return res.status(404).json({ error: "Invalid IPO key" });

  const ipoName = ipoList[key];

  try {
    // Call Python script
    const { spawn } = require("child_process");
    const py = spawn("/Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12", ["get_ipo_data.py"]);


    py.stdin.write(JSON.stringify({ key: req.query.key }));
    py.stdin.end();

    let data = "";

    py.stdout.on("data", (chunk) => (data += chunk));

    py.stdout.on("end", () => {
      if (!data || data.trim() === "") {
        console.error("❌ Python returned empty output");
        return res.json({
          ipowatch: { error: "No data from Python" },
          market: {}
        });
      }

      let ipowatchData;
      try {
        ipowatchData = JSON.parse(data);
      } catch (err) {
        console.error("❌ JSON parse failed:", data);
        return res.json({
          ipowatch: { error: "Invalid JSON from Python" },
          market: {}
        });
      }

      // MARKET DATA (dummy for now – add later)
      const marketData = {
        market_price: Math.floor(Math.random() * 500),
        market_cap: Math.floor(Math.random() * 10000) + " Cr",
        last_quarter_revenue: Math.floor(Math.random() * 1000) + " Cr",
        sector: "Technology",
        industry: "Software Services"
      };

      return res.json({
        ipowatch: ipowatchData,
        market: marketData
      });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
