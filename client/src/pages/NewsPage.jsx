import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsPage() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5001/api/news/stock-news")
      .then((res) => {
        setNews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const categories = ["all", "markets", "stocks", "crypto", "economy", "tech"];

  const filteredNews = news.filter((item) => {
    if (selectedCategory !== "all" && !item.title?.toLowerCase().includes(selectedCategory)) {
      return false;
    }
    if (searchTerm && !item.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const formatTime = (publishedAt) => {
    if (!publishedAt) return "";
    const date = new Date(publishedAt);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getSentimentColor = (title) => {
    const positiveWords = ["up", "gain", "rise", "surge", "rally", "boost", "bullish"];
    const negativeWords = ["down", "drop", "fall", "plunge", "slide", "bearish", "loss"];

    const lowerTitle = title.toLowerCase();
    if (positiveWords.some(word => lowerTitle.includes(word))) return "#10b981";
    if (negativeWords.some(word => lowerTitle.includes(word))) return "#ef4444";
    return "#f59e0b";
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
            onClick={() => navigate("/dashboard")}
          >
            StockAI
          </motion.h3>

          <div style={styles.navLinks}>
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Direction", path: "/direction" },
              { label: "Risk", path: "/risk" },
              { label: "Comparison", path: "/peer-comparison" },
              { label: "Information", path: "/information" },
              { label: "News", path: "/news" }
            ].map((item) => (
              <motion.span
                key={item.label}
                whileHover={{ scale: 1.05, color: "#4ade80" }}
                whileTap={{ scale: 0.95 }}
                style={styles.link}
                onClick={() => navigate(item.path)}
              >
                {item.label}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
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

      {/* HEADER SECTION */}
      <div style={styles.header}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.headerContent}
        >
          <h1 style={styles.headerTitle}>Market Intelligence Hub</h1>
          <p style={styles.headerSubtitle}>
            Real-time financial news & insights powered by AI analysis
          </p>

          {/* SEARCH BAR */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={styles.searchContainer}
          >
            <input
              type="text"
              placeholder="Search news, stocks, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <div style={styles.searchIcon}>🔍</div>
          </motion.div>

          {/* CATEGORY FILTERS */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={styles.categoryContainer}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                style={{
                  ...styles.categoryBtn,
                  background: selectedCategory === category ? "#10b981" : "#f3f4f6",
                  color: selectedCategory === category ? "white" : "#374151"
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* NEWS CONTENT */}
      <div style={styles.content}>
        {/* STATS BAR */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={styles.statsBar}
        >
          <div style={styles.stat}>
            <div style={styles.statNumber}>{filteredNews.length}</div>
            <div style={styles.statLabel}>Stories</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Updates</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>Live</div>
            <div style={styles.statLabel}>Market Data</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>AI</div>
            <div style={styles.statLabel}>Analyzed</div>
          </div>
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
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Loading market intelligence...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NEWS GRID */}
        {!loading && filteredNews.length > 0 ? (
          <div style={styles.newsGrid}>
            {filteredNews.map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)"
                }}
                onClick={() => window.open(item.url, "_blank")}
                style={styles.newsCard}
              >
                {/* NEWS IMAGE */}
                <div style={styles.imageContainer}>
                  <img
                    src={
                      item.urlToImage ||
                      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop"
                    }
                    alt="news"
                    style={styles.newsImage}
                  />
                  <div style={{
                    ...styles.sentimentIndicator,
                    background: getSentimentColor(item.title)
                  }} />
                </div>

                {/* NEWS CONTENT */}
                <div style={styles.newsContent}>
                  <div style={styles.newsHeader}>
                    <span style={styles.newsSource}>
                      {item.source?.name || "Financial News"}
                    </span>
                    <span style={styles.newsTime}>
                      {formatTime(item.publishedAt)}
                    </span>
                  </div>

                  <h3 style={styles.newsTitle}>{item.title}</h3>
                  <p style={styles.newsDescription}>
                    {item.description?.substring(0, 120)}...
                  </p>

                  <div style={styles.newsFooter}>
                    <div style={styles.tags}>
                      {item.title?.split(" ").slice(0, 3).map((word, i) => (
                        <span key={i} style={styles.tag}>
                          {word.replace(/[^\w]/g, '')}
                        </span>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      style={styles.readMoreBtn}
                    >
                      Read Analysis →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.emptyState}
          >
            <div style={styles.emptyIcon}>📰</div>
            <h3 style={styles.emptyTitle}>No news found</h3>
            <p style={styles.emptyText}>
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : null}
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          StockAI News • Real-time market intelligence • Updated continuously
        </p>
        <p style={styles.footerNote}>
          Data sourced from multiple financial news APIs • AI analysis applied
        </p>
      </div>
    </motion.div>
  );
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
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

  contactBtn: {
    padding: "6px 12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "13px",
    cursor: "pointer"
  },

  header: {
    padding: "48px 32px",
    background: "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)",
    borderBottom: "1px solid #e5e7eb"
  },

  headerContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center"
  },

  headerTitle: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "12px"
  },

  headerSubtitle: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "32px"
  },

  searchContainer: {
    position: "relative",
    maxWidth: "600px",
    margin: "0 auto 32px"
  },

  searchInput: {
    width: "100%",
    padding: "16px 24px 16px 52px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "16px",
    color: "#111827",
    background: "white",
    outline: "none",
    transition: "all 0.2s"
  },

  searchIcon: {
    position: "absolute",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    fontSize: "18px"
  },

  categoryContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap"
  },

  categoryBtn: {
    padding: "8px 20px",
    border: "none",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s"
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px"
  },

  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "40px"
  },

  stat: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e5e7eb"
  },

  statNumber: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#10b981",
    marginBottom: "8px"
  },

  statLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px"
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    marginBottom: "20px",
    animation: "spin 1s linear infinite"
  },

  loadingText: {
    color: "#6b7280",
    fontSize: "16px",
    fontWeight: "500"
  },

  newsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px"
  },

  newsCard: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #f3f4f6"
  },

  imageContainer: {
    position: "relative",
    height: "180px",
    overflow: "hidden"
  },

  newsImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease"
  },

  sentimentIndicator: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
  },

  newsContent: {
    padding: "24px"
  },

  newsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },

  newsSource: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#059669",
    background: "#d1fae5",
    padding: "4px 12px",
    borderRadius: "12px"
  },

  newsTime: {
    fontSize: "12px",
    color: "#9ca3af"
  },

  newsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "12px",
    lineHeight: "1.4"
  },

  newsDescription: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "20px"
  },

  newsFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  tags: {
    display: "flex",
    gap: "8px"
  },

  tag: {
    fontSize: "11px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "12px"
  },

  readMoreBtn: {
    background: "transparent",
    border: "none",
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px"
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "20px",
    opacity: 0.5
  },

  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px"
  },

  emptyText: {
    fontSize: "14px",
    color: "#9ca3af"
  },

  footer: {
    padding: "32px",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
    background: "white",
    marginTop: "60px"
  },

  footerText: {
    fontSize: "14px",
    color: "#374151",
    fontWeight: "500",
    marginBottom: "8px"
  },

  footerNote: {
    fontSize: "12px",
    color: "#9ca3af"
  }
};

// Add CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);