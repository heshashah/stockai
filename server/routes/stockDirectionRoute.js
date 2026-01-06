import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5006/api/stock-direction",
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error("Direction API Error:", error.message);
    res.status(500).json({ error: "AI prediction failed" });
  }
});

export default router;
