// Load variables from .env
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();

/* ✅ SAFE CORS CONFIG — NO app.options USED */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
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

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

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
        if (err) {
          console.error("❌ DB Error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(200).json({
          message: "User stored successfully",
          user: { name, email, picture },
        });
      }
    );
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

/* ✅ START SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
