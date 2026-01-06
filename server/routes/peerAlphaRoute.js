import express from "express";
import axios from "axios";

const router = express.Router();

const FMP_KEY = process.env.FMP_API_KEY;

// ---------------- DOMAIN MAP ----------------
const DOMAIN_MAP = {
  IT: ["TCS", "INFY", "WIPRO", "HCLTECH", "TECHM"],
  Banking: ["HDFCBANK", "ICICIBANK", "SBIN", "AXISBANK", "KOTAKBANK"],
  Seafood: ["APEX", "KINGSINFRA", "ESSEXM", "ZEALAQUA", "WATERBASE"]
};

// ---------------- DEMO FALLBACK DATA ----------------
const FALLBACK_DATA = {
  IT: [
    { name: "TCS", pe: 28, profit_growth: 12, sales_growth: 9, roce: 42 },
    { name: "Infosys", pe: 25, profit_growth: 10, sales_growth: 8, roce: 38 },
    { name: "Wipro", pe: 22, profit_growth: 6, sales_growth: 5, roce: 29 },
    { name: "HCL Tech", pe: 27, profit_growth: 14, sales_growth: 11, roce: 41 },
    { name: "Tech Mahindra", pe: 21, profit_growth: 5, sales_growth: 4, roce: 23 }
  ],
  Banking: [
    { name: "HDFC Bank", pe: 19, profit_growth: 15, sales_growth: 12, roce: 18 },
    { name: "ICICI Bank", pe: 18, profit_growth: 17, sales_growth: 14, roce: 16 },
    { name: "SBI", pe: 12, profit_growth: 22, sales_growth: 18, roce: 14 },
    { name: "Axis Bank", pe: 16, profit_growth: 14, sales_growth: 11, roce: 15 },
    { name: "Kotak Bank", pe: 20, profit_growth: 10, sales_growth: 9, roce: 17 }
  ],
  Seafood: [
    { name: "Apex Frozen", pe: 44, profit_growth: 697, sales_growth: 19, roce: 2 },
    { name: "Kings Infra", pe: 20, profit_growth: 26, sales_growth: 41, roce: 20 },
    { name: "Essex Marine", pe: 5, profit_growth: 227, sales_growth: 158, roce: 24 },
    { name: "Zeal Aqua", pe: 8, profit_growth: 27, sales_growth: 21, roce: 15 },
    { name: "Waterbase", pe: 46, profit_growth: -119, sales_growth: 31, roce: -10 }
  ]
};

// ---------------- AI SCORING ----------------
function calculateAI({ pe, profit_growth, sales_growth, roce }) {
  let score = 0;

  score += pe > 0 && pe < 25 ? 20 : 5;
  score += profit_growth > 10 ? 25 : 5;
  score += sales_growth > 10 ? 20 : 5;
  score += roce > 15 ? 25 : 5;

  let rating =
    score >= 70 ? "Strong Buy" :
    score >= 50 ? "Good" :
    score >= 30 ? "Average" :
    "Risky";

  return { score, rating };
}

// ---------------- GET DOMAINS ----------------
router.get("/domains", (req, res) => {
  res.json(Object.keys(DOMAIN_MAP));
});

// ---------------- POST ANALYZE ----------------
router.post("/analyze", async (req, res) => {
  const { domain } = req.body;

  if (!DOMAIN_MAP[domain]) {
    return res.status(400).json({ error: "Invalid domain" });
  }

  const symbols = DOMAIN_MAP[domain];
  const results = [];

  let apiWorked = true;

  for (let symbol of symbols) {
    try {
      // --------- API CALLS ----------
      const [profileRes, ratiosRes, growthRes] = await Promise.all([
        axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`),
        axios.get(`https://financialmodelingprep.com/api/v3/ratios/${symbol}?limit=1&apikey=${FMP_KEY}`),
        axios.get(`https://financialmodelingprep.com/api/v3/income-statement-growth/${symbol}?limit=1&apikey=${FMP_KEY}`)
      ]);

      const profile = profileRes.data?.[0];
      const ratios = ratiosRes.data?.[0];
      const growth = growthRes.data?.[0];

      // If API returned nothing → trigger fallback
      if (!profile || !ratios || !growth) {
        apiWorked = false;
        break;
      }

      const pe = Number(ratios.priceEarningsRatio) || 0;
      const profit_growth = growth.growthNetIncome
        ? Number(growth.growthNetIncome) * 100
        : 0;
      const sales_growth = growth.growthRevenue
        ? Number(growth.growthRevenue) * 100
        : 0;
      const roce = ratios.returnOnCapitalEmployed
        ? Number(ratios.returnOnCapitalEmployed) * 100
        : 0;

      const ai = calculateAI({ pe, profit_growth, sales_growth, roce });

      results.push({
        name: profile.companyName || symbol,
        pe: Number(pe.toFixed(2)),
        profit_growth: Number(profit_growth.toFixed(2)),
        sales_growth: Number(sales_growth.toFixed(2)),
        roce: Number(roce.toFixed(2)),
        ai_score: ai.score,
        ai_rating: ai.rating
      });

      // ---- avoid API limit ----
      await new Promise(r => setTimeout(r, 250));

    } catch (err) {
      console.error("❌ FMP error for", symbol);
      apiWorked = false;
      break;
    }
  }

  // ---------------- FALLBACK MODE ----------------
  if (!apiWorked) {
    console.warn("⚠️ Using fallback demo data");

    const demo = FALLBACK_DATA[domain].map(c => {
      const ai = calculateAI(c);
      return {
        ...c,
        ai_score: ai.score,
        ai_rating: ai.rating
      };
    });

    return res.json(demo);
  }

  // sort by AI score
  results.sort((a, b) => b.ai_score - a.ai_score);

  res.json(results);
});

export default router;
