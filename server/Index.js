// ✅ Load variables from .env
import { spawn } from "child_process";

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

// ✅ REQUIRED if Node < 18
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

/* ✅ ✅ ✅ CORS — ALLOW FRONTEND */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

/* ❌❌❌ COMMENTED: OVERLAPPING SENSEX / GRAPH API ❌❌❌
   Reason:
   - Sensex + chart data is handled by Flask (Python)
   - This route was conflicting and returning wrong data format
*/

// app.get("/api/sensex", async (req, res) => {
//   try {
//     const url = `https://eodhd.com/api/eod/AAPL.US?api_token=693845dbec47f2.81582732&fmt=json`;

//     const response = await fetch(url);
//     const data = await response.json();

//     // ❌ Not Sensex + wrong format for chart
//     res.json(data[0]);
//   } catch (error) {
//     console.error("❌ Sensex API Error:", error);
//     res.status(500).json({ error: "Sensex fetch failed" });
//   }
// });

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

/* ✅ ✅ ✅ START SERVER */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
