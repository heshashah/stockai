import express from "express";

const router = express.Router();

// ---------------- DOMAIN MAP ----------------
const DOMAIN_MAP = {
  IT: ["TCS", "INFY", "WIPRO", "HCLTECH", "TECHM"],

  Banking: ["HDFCBANK", "ICICIBANK", "SBIN", "AXISBANK", "KOTAKBANK"],

  Seafood: ["APEX", "KINGSINFRA", "ESSEXM", "ZEALAQUA", "WATERBASE"],

  Healthcare: ["SUNPHARMA", "DRREDDY", "CIPLA", "DIVISLAB", "LUPIN"],

  FMCG: ["HINDUNILVR", "ITC", "NESTLEIND", "DABUR", "BRITANNIA"],

  Energy: ["RELIANCE", "ONGC", "NTPC", "POWERGRID", "TATAPOWER"],

  Automobile: ["MARUTI", "TATAMOTORS", "M&M", "BAJAJ-AUTO", "EICHERMOT"],

  Metals: ["TATASTEEL", "JSWSTEEL", "HINDALCO", "NMDC", "SAIL"],

  Infrastructure: ["L&T", "ADANIENT", "GMRINFRA", "IRB", "NCC"]
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
  ],
  Healthcare: [
    { name: "Sun Pharma", pe: 32, profit_growth: 18, sales_growth: 14, roce: 22 },
    { name: "Dr Reddy", pe: 28, profit_growth: 15, sales_growth: 11, roce: 20 },
    { name: "Cipla", pe: 30, profit_growth: 12, sales_growth: 10, roce: 18 },
    { name: "Divis Labs", pe: 45, profit_growth: 9, sales_growth: 8, roce: 27 },
    { name: "Lupin", pe: 25, profit_growth: 14, sales_growth: 12, roce: 19 }
  ],

  FMCG: [
    { name: "HUL", pe: 55, profit_growth: 10, sales_growth: 9, roce: 35 },
    { name: "ITC", pe: 27, profit_growth: 18, sales_growth: 14, roce: 28 },
    { name: "Nestle", pe: 70, profit_growth: 12, sales_growth: 10, roce: 40 },
    { name: "Dabur", pe: 48, profit_growth: 9, sales_growth: 8, roce: 25 },
    { name: "Britannia", pe: 52, profit_growth: 11, sales_growth: 9, roce: 33 }
  ],

  Energy: [
    { name: "Reliance", pe: 24, profit_growth: 16, sales_growth: 12, roce: 14 },
    { name: "ONGC", pe: 8, profit_growth: 22, sales_growth: 18, roce: 20 },
    { name: "NTPC", pe: 14, profit_growth: 10, sales_growth: 9, roce: 13 },
    { name: "Power Grid", pe: 13, profit_growth: 9, sales_growth: 8, roce: 15 },
    { name: "Tata Power", pe: 35, profit_growth: 28, sales_growth: 21, roce: 17 }
  ],

  Automobile: [
    { name: "Maruti", pe: 30, profit_growth: 19, sales_growth: 14, roce: 32 },
    { name: "Tata Motors", pe: 22, profit_growth: 35, sales_growth: 26, roce: 18 },
    { name: "M&M", pe: 24, profit_growth: 21, sales_growth: 17, roce: 23 },
    { name: "Bajaj Auto", pe: 28, profit_growth: 14, sales_growth: 10, roce: 29 },
    { name: "Eicher", pe: 34, profit_growth: 12, sales_growth: 9, roce: 26 }
  ],

  Metals: [
    { name: "Tata Steel", pe: 9, profit_growth: 40, sales_growth: 25, roce: 20 },
    { name: "JSW Steel", pe: 12, profit_growth: 28, sales_growth: 21, roce: 18 },
    { name: "Hindalco", pe: 10, profit_growth: 31, sales_growth: 24, roce: 17 },
    { name: "NMDC", pe: 7, profit_growth: 18, sales_growth: 14, roce: 30 },
    { name: "SAIL", pe: 6, profit_growth: 22, sales_growth: 19, roce: 15 }
  ],

  Infrastructure: [
    { name: "L&T", pe: 32, profit_growth: 19, sales_growth: 15, roce: 21 },
    { name: "Adani Ent", pe: 60, profit_growth: 25, sales_growth: 22, roce: 14 },
    { name: "GMR Infra", pe: 45, profit_growth: 30, sales_growth: 26, roce: 10 },
    { name: "IRB Infra", pe: 28, profit_growth: 17, sales_growth: 13, roce: 16 },
    { name: "NCC", pe: 20, profit_growth: 21, sales_growth: 18, roce: 19 }
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

  console.warn("⚠️ Using fallback demo data (FMP disabled)");

  const demo = FALLBACK_DATA[domain].map(c => {
    const ai = calculateAI(c);
    return {
      ...c,
      ai_score: ai.score,
      ai_rating: ai.rating
    };
  });

  // sort by AI score
  demo.sort((a, b) => b.ai_score - a.ai_score);

  res.json(demo);
});

export default router;