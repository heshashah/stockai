import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const domainPeers = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/domainPeers.json"))
);

const symbols = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/companySymbols.json"))
);

// 🔹 Get available domains
router.get("/domains", (req, res) => {
  res.json(Object.keys(domainPeers));
});

// 🔹 Analyze domain
router.post("/analyze", async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domainPeers[domain]) {
      return res.status(400).json({ error: "Invalid domain" });
    }

    const companies = domainPeers[domain];
    const peerData = [];

    for (let name of companies) {
      const symbol = symbols[name];
      if (!symbol) continue;

      try {
        // --------- ALPHA VANTAGE CALLS ----------
        const overviewURL =
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;

        const incomeURL =
          `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;

        const [overviewRes, incomeRes] = await Promise.all([
          axios.get(overviewURL),
          axios.get(incomeURL)
        ]);

        const o = overviewRes.data || {};
        const income = incomeRes.data?.annualReports?.[0] || {};

        const pe = parseFloat(o.PERatio) || 0;
        const roce = parseFloat(o.ReturnOnEquityTTM) || 0;

        const revenueGrowth =
          income.totalRevenue && incomeRes.data?.annualReports?.[1]?.totalRevenue
            ? (
                (income.totalRevenue -
                  incomeRes.data.annualReports[1].totalRevenue) /
                incomeRes.data.annualReports[1].totalRevenue
              ) * 100
            : 0;

        const profitGrowth =
          income.netIncome && incomeRes.data?.annualReports?.[1]?.netIncome
            ? (
                (income.netIncome -
                  incomeRes.data.annualReports[1].netIncome) /
                incomeRes.data.annualReports[1].netIncome
              ) * 100
            : 0;

        peerData.push({
          name,
          pe,
          profit_growth: profitGrowth,
          sales_growth: revenueGrowth,
          roce
        });
      } catch (err) {
        console.log("Alpha Vantage error for", name);
        peerData.push({
          name,
          pe: 0,
          profit_growth: 0,
          sales_growth: 0,
          roce: 0
        });
      }
    }

    // 🔹 Send to Python AI
    const python = spawn(
      "/Users/heshashah/stockai/server/venv/bin/python3",
      ["ai/peer_ai.py"],
      { cwd: path.join(__dirname, "..") }
    );

    python.stdin.write(JSON.stringify(peerData));
    python.stdin.end();

    let output = "";
    python.stdout.on("data", (d) => (output += d.toString()));

    python.on("close", () => {
      try {
        const result = JSON.parse(output);

        const top5 = result
          .sort((a, b) => b.ai_score - a.ai_score)
          .slice(0, 5);

        res.json(top5);
      } catch {
        res.status(500).json({ error: "AI failed", raw: output });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Peer Alpha API failed" });
  }
});

export default router;
