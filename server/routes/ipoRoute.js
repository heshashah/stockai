import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/ipo-predictions", (req, res) => {
  // FIXED PATH – correctly points to server/data/ipoData.json
  const filePath = path.join(process.cwd(), "data", "ipoData.json");

  console.log("Reading:", filePath);

  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    const ipoData = JSON.parse(rawData);
    res.json(ipoData);
  } catch (err) {
    console.error("Local IPO Data Error:", err.message);
    res.status(500).json({ error: "Could not load IPO data" });
  }
});

export default router;
