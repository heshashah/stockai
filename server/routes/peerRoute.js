import express from "express";
import { spawn } from "child_process";

const router = express.Router();

router.post("/peer-ai", async (req, res) => {
  try {
    const companies = req.body;

    const python = spawn("python3", ["server/ai/peer_ai.py"]);

    python.stdin.write(JSON.stringify(companies));
    python.stdin.end();

    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.on("close", () => {
      res.json(JSON.parse(result));
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI Engine Error" });
  }
});

export default router;
