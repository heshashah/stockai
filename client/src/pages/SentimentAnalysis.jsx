import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function SentimentAnalysis() {
  const navigate = useNavigate();
  const { ipoKey } = useParams();

  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ipoKey) return;

    setLoading(true);

    // Fetch IPO specific news
    axios
      .get(`http://localhost:5001/api/ipo/news?key=${ipoKey}`)
      .then((newsRes) => {
        // Run sentiment on that news
        return axios.post("http://localhost:5001/api/sentiment", {
          news: newsRes.data.news,
        });
      })
      .then((sentimentRes) => {
        setTimeout(() => {
          setSentiment(sentimentRes.data);
          setLoading(false);
        }, 800);
      })
      .catch((err) => {
        console.error("Sentiment error:", err);
        setLoading(false);
      });
  }, [ipoKey]);

  const getSentimentColor = (sentimentType) => {
    switch(sentimentType) {
      case "Positive": return "#10b981";
      case "Negative": return "#ef4444";
      case "Neutral": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getScoreColor = (score) => {
    if (score > 0.6) return "#059669";
    if (score > 0.2) return "#10b981";
    if (score > -0.2) return "#f59e0b";
    if (score > -0.6) return "#f97316";
    return "#dc2626";
  };

  const lineData = {
    labels: sentiment?.details?.map((d) => d.headline.slice(0, 20)) || [],
    datasets: [
      {
        label: "Sentiment Score",
        data: sentiment?.details?.map((d) => d.score) || [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: sentiment?.details?.map(d => getScoreColor(d.score)),
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          sentiment?.details?.filter(d => d.score > 0.2).length || 0,
          sentiment?.details?.filter(d => d.score >= -0.2 && d.score <= 0.2).length || 0,
          sentiment?.details?.filter(d => d.score < -0.2).length || 0,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        min: -1,
        max: 1,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.page}
    >
      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        style={styles.navbar}
      >
        <div style={styles.navLeft}>
          <motion.h3 
            whileHover={{ scale: 1.05 }}
            style={styles.logo}
          >
            StockAI
          </motion.h3>
          <div style={styles.navLinks}>
            {["Dashboard", "Direction", "Risk", "Comparison", "Information", "News"].map((item) => (
              <motion.span
                key={item}
                whileHover={{ scale: 1.05, color: "#4ade80" }}
                whileTap={{ scale: 0.95 }}
                style={styles.link}
                onClick={() => navigate(`/${item.toLowerCase().replace(" ", "-")}`)}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
        
        <div style={styles.navRight}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.phoneBtn}
          >
            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            1-800-366-9833
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(45, 212, 191, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            style={styles.contactBtn}
          >
            Contact us
          </motion.button>
        </div>
      </motion.nav>

      {/* BODY */}
      <div style={styles.body}>
        {/* HEADER */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.header}
        >
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>
              Sentiment Analysis
            </h1>
            <p style={styles.subtitle}>
              {ipoKey ? ipoKey.replace(/_/g, " ").toUpperCase() : "IPO"} • AI-driven market sentiment analysis
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
            whileTap={{ scale: 0.95 }}
            style={styles.backButton}
            onClick={() => navigate("/risk")}
          >
            <svg style={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Risk Analysis
          </motion.button>
        </motion.div>

        {/* LOADING STATE */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.loadingContainer}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={styles.spinner}
              />
              <p style={styles.loadingText}>Analyzing market sentiment...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SENTIMENT OVERVIEW */}
        {!loading && sentiment && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={styles.overviewCard}
          >
            <div style={styles.overviewHeader}>
              <div>
                <h2 style={styles.overviewTitle}>Sentiment Overview</h2>
                <p style={styles.overviewSubtitle}>Based on {sentiment.details?.length || 0} news articles</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  ...styles.sentimentBadge,
                  backgroundColor: getSentimentColor(sentiment.sentiment)
                }}
              >
                {sentiment.sentiment}
              </motion.div>
            </div>

            <div style={styles.scoreContainer}>
              <div style={styles.scoreCard}>
                <span style={styles.scoreLabel}>Overall Score</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  style={{
                    ...styles.scoreValue,
                    color: getScoreColor(sentiment.overall_score)
                  }}
                >
                  {sentiment.overall_score}
                </motion.div>
                <div style={styles.scoreBar}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((sentiment.overall_score + 1) / 2) * 100}%`
                    }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    style={{
                      ...styles.scoreProgress,
                      background: getScoreColor(sentiment.overall_score)
                    }}
                  />
                </div>
                <div style={styles.scoreRange}>
                  <span>Negative</span>
                  <span>Neutral</span>
                  <span>Positive</span>
                </div>
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Positive Headlines</span>
                  <span style={{ ...styles.statValue, color: "#10b981" }}>
                    {sentiment.details?.filter(d => d.score > 0.2).length || 0}
                  </span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Neutral Headlines</span>
                  <span style={{ ...styles.statValue, color: "#f59e0b" }}>
                    {sentiment.details?.filter(d => d.score >= -0.2 && d.score <= 0.2).length || 0}
                  </span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Negative Headlines</span>
                  <span style={{ ...styles.statValue, color: "#ef4444" }}>
                    {sentiment.details?.filter(d => d.score < -0.2).length || 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CHARTS */}
        {!loading && sentiment && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={styles.chartsGrid}
          >
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Sentiment Distribution</h3>
                <p style={styles.chartSubtitle}>Breakdown by sentiment category</p>
              </div>
              <div style={styles.chartContainer}>
                <Pie data={pieData} options={chartOptions} />
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Score Timeline</h3>
                <p style={styles.chartSubtitle}>Sentiment score per headline</p>
              </div>
              <div style={styles.chartContainer}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </motion.div>
        )}

        {/* HEADLINES BREAKDOWN */}
        {!loading && sentiment && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={styles.headlinesContainer}
          >
            <div style={styles.headlinesHeader}>
              <h2 style={styles.headlinesTitle}>Headline Analysis</h2>
              <p style={styles.headlinesSubtitle}>Detailed sentiment breakdown for each news item</p>
            </div>

            <div style={styles.headlinesGrid}>
              <AnimatePresence>
                {sentiment.details?.map((headline, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                    style={styles.headlineCard}
                  >
                    <div style={styles.headlineContent}>
                      <div style={styles.headlineMeta}>
                        <div style={styles.headlineIndex}>#{index + 1}</div>
                        <div style={{
                          ...styles.sentimentDot,
                          backgroundColor: getScoreColor(headline.score)
                        }} />
                      </div>
                      <div style={styles.headlineText}>
                        <h4 style={styles.headlineTitle}>{headline.headline}</h4>
                        <div style={styles.headlineFooter}>
                          <span style={{
                            ...styles.headlineScore,
                            color: getScoreColor(headline.score)
                          }}>
                            Score: {headline.score}
                          </span>
                          <span style={{
                            ...styles.sentimentTag,
                            backgroundColor: getScoreColor(headline.score) + "20"
                          }}>
                            {headline.score > 0.2 ? "Positive" : 
                             headline.score < -0.2 ? "Negative" : "Neutral"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    height: "70px",
    background: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "40px"
  },

  logo: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "24px",
    fontWeight: "700",
    cursor: "pointer"
  },

  navLinks: {
    display: "flex",
    gap: "24px",
    fontSize: "14px",
    fontWeight: "500"
  },

  link: {
    color: "#4b5563",
    cursor: "pointer",
    transition: "color 0.2s",
    position: "relative",
    padding: "8px 0"
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },

  phoneBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    border: "1px solid #10b981",
    background: "transparent",
    color: "#10b981",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer"
  },

  contactBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)"
  },

  icon: {
    width: "16px",
    height: "16px"
  },

  body: {
    padding: "32px 40px",
    maxWidth: "1400px",
    margin: "0 auto"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px"
  },

  headerLeft: {
    flex: 1
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    fontWeight: "400"
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s"
  },

  backIcon: {
    width: "16px",
    height: "16px"
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "400px"
  },

  spinner: {
    width: "60px",
    height: "60px",
    border: "4px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    marginBottom: "20px"
  },

  loadingText: {
    color: "#6b7280",
    fontSize: "16px",
    fontWeight: "500"
  },

  overviewCard: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
    marginBottom: "32px"
  },

  overviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px"
  },

  overviewTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px"
  },

  overviewSubtitle: {
    fontSize: "14px",
    color: "#6b7280"
  },

  sentimentBadge: {
    padding: "8px 20px",
    color: "white",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px"
  },

  scoreContainer: {
    display: "flex",
    gap: "32px",
    alignItems: "center"
  },

  scoreCard: {
    flex: 1
  },

  scoreLabel: {
    display: "block",
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px"
  },

  scoreValue: {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "16px"
  },

  scoreBar: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "8px"
  },

  scoreProgress: {
    height: "100%",
    borderRadius: "4px"
  },

  scoreRange: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#9ca3af"
  },

  statsGrid: {
    display: "flex",
    gap: "24px"
  },

  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    minWidth: "120px"
  },

  statLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "8px",
    textAlign: "center"
  },

  statValue: {
    fontSize: "24px",
    fontWeight: "700"
  },

  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "32px",
    marginBottom: "32px"
  },

  chartCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)"
  },

  chartHeader: {
    marginBottom: "24px"
  },

  chartTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px"
  },

  chartSubtitle: {
    fontSize: "14px",
    color: "#6b7280"
  },

  chartContainer: {
    height: "300px"
  },

  headlinesContainer: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)"
  },

  headlinesHeader: {
    marginBottom: "32px"
  },

  headlinesTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px"
  },

  headlinesSubtitle: {
    fontSize: "14px",
    color: "#6b7280"
  },

  headlinesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px"
  },

  headlineCard: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s"
  },

  headlineContent: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start"
  },

  headlineMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  },

  headlineIndex: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280"
  },

  sentimentDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%"
  },

  headlineText: {
    flex: 1
  },

  headlineTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111827",
    margin: "0 0 12px 0",
    lineHeight: "1.5"
  },

  headlineFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  headlineScore: {
    fontSize: "14px",
    fontWeight: "600"
  },

  sentimentTag: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500"
  }
};