import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AIStockPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPicks() {
      try {
        // Mock data for demonstration
        const mockPicks = Array.from({ length: 12 }, (_, i) => ({
          symbol: `STOCK${i + 1}.NS`,
          name: `Company ${i + 1} Ltd`,
          price: Math.floor(Math.random() * 5000) + 1000,
          change: (Math.random() * 200 - 100).toFixed(2),
          changePercent: (Math.random() * 20 - 10).toFixed(2),
          volume: Math.floor(Math.random() * 1000000) + 100000
        }));
        
        setPicks(mockPicks);
        setError(null);
        
        // For actual API call, use:
        // const res = await axios.get("http://localhost:5001/api/ai-picks");
        // setPicks(res.data.picks);
        
      } catch (error) {
        console.error("AI Picks Fetch Error:", error);
        setError("Failed to load AI recommendations");
      } finally {
        setLoading(false);
      }
    }

    fetchPicks();
    const interval = setInterval(fetchPicks, 45000); // Refresh every 45 seconds
    return () => clearInterval(interval);
  }, []);

  const getConfidenceColor = (changePercent) => {
    const confidence = Math.abs(changePercent);
    if (confidence > 10) return "#059669"; // High confidence
    if (confidence > 5) return "#10b981"; // Medium confidence
    return "#f59e0b"; // Low confidence
  };

  const getRecommendation = (changePercent) => {
    if (changePercent > 5) return "Strong Buy";
    if (changePercent > 2) return "Buy";
    if (changePercent > 0) return "Hold";
    if (changePercent > -2) return "Reduce";
    return "Sell";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={styles.card}
    >
      <div style={styles.header}>
        <h2 style={styles.title}>AI Stock Recommendations</h2>
        <div style={styles.aiBadge}>
          <span style={styles.aiIcon}>🤖</span>
          <span>AI Powered</span>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Analyzing market patterns...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>{error}</p>
        </div>
      ) : picks.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📊</div>
          <p style={styles.emptyText}>No AI recommendations available</p>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.scrollableContainer}>
            <div style={styles.picksContainer}>
              {picks.map((stock, index) => (
                <motion.div
                  key={`${stock.symbol}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)"
                  }}
                  style={styles.pickCard}
                >
                  <div style={styles.pickHeader}>
                    <div style={styles.symbolContainer}>
                      <div style={styles.symbolAvatar}>
                        {stock.symbol.charAt(0)}
                      </div>
                      <div>
                        <h3 style={styles.symbol}>{stock.symbol}</h3>
                        <p style={styles.companyName}>{stock.name || "N/A"}</p>
                      </div>
                    </div>
                    <div style={{
                      ...styles.confidenceBadge,
                      background: getConfidenceColor(stock.changePercent)
                    }}>
                      {getRecommendation(stock.changePercent)}
                    </div>
                  </div>

                  <div style={styles.pickMetrics}>
                    <div style={styles.metric}>
                      <span style={styles.metricLabel}>Current Price</span>
                      <span style={styles.metricValue}>
                        ₹{parseFloat(stock.price).toFixed(2)}
                      </span>
                    </div>
                    <div style={styles.metric}>
                      <span style={styles.metricLabel}>Change</span>
                      <span style={{
                        ...styles.metricValue,
                        color: stock.change > 0 ? "#10b981" : stock.change < 0 ? "#ef4444" : "#6b7280"
                      }}>
                        {stock.change > 0 ? "+" : ""}{parseFloat(stock.change).toFixed(2)} 
                        <span style={{ fontSize: "12px", marginLeft: "4px" }}>
                          ({parseFloat(stock.changePercent).toFixed(2)}%)
                        </span>
                      </span>
                    </div>
                  </div>

                  <div style={styles.pickFooter}>
                    <div style={styles.volume}>
                      <span style={styles.volumeLabel}>Volume:</span>
                      <span style={styles.volumeValue}>
                        {stock.volume ? Math.round(stock.volume / 1000) + 'K' : 'N/A'}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={styles.actionButton}
                    >
                      View Analysis →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <span style={styles.footerText}>
          Based on machine learning analysis of market trends
        </span>
        <span style={styles.refreshText}>Updates every 45s</span>
      </div>
    </motion.div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    maxHeight: "700px", // Limit maximum height
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexShrink: 0, // Prevent header from shrinking
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    margin: 0
  },
  aiBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    background: "#f0fdf4",
    color: "#059669",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },
  aiIcon: {
    fontSize: "14px"
  },
  content: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: 0, // Important for proper scrolling
  },
  // Scrollable container wrapper
  scrollableContainer: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "8px",
  },
  picksContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingBottom: "4px", // Extra padding at bottom
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
    flex: 1,
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    marginBottom: "16px",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    fontSize: "14px",
    color: "#6b7280"
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
    flex: 1,
  },
  errorIcon: {
    fontSize: "32px",
    marginBottom: "12px"
  },
  errorText: {
    fontSize: "14px",
    color: "#ef4444"
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
    flex: 1,
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.5
  },
  emptyText: {
    fontSize: "14px",
    color: "#9ca3af"
  },
  pickCard: {
    background: "#fafafa",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s ease",
    border: "1px solid #e5e7eb",
    flexShrink: 0, // Prevent cards from shrinking
  },
  pickHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px"
  },
  symbolContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0, // Allow text truncation
  },
  symbolAvatar: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
    flexShrink: 0,
  },
  symbol: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  companyName: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  confidenceBadge: {
    padding: "6px 12px",
    color: "white",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    flexShrink: 0,
  },
  pickMetrics: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px"
  },
  metric: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  metricLabel: {
    fontSize: "12px",
    color: "#6b7280"
  },
  metricValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827"
  },
  pickFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  volume: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  volumeLabel: {
    fontSize: "12px",
    color: "#6b7280"
  },
  volumeValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151"
  },
  actionButton: {
    padding: "8px 16px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    flexShrink: 0,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
    flexShrink: 0, // Keep footer fixed
  },
  footerText: {
    fontSize: "12px",
    color: "#6b7280"
  },
  refreshText: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "500"
  }
};

// Add CSS animations and scrollbar styling
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Custom scrollbar styling */
    .scrollableContainer::-webkit-scrollbar {
      width: 6px;
    }
    
    .scrollableContainer::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
      margin: 4px 0;
    }
    
    .scrollableContainer::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 3px;
    }
    
    .scrollableContainer::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
    
    /* For Firefox */
    .scrollableContainer {
      scrollbar-width: thin;
      scrollbar-color: #10b981 #f1f1f1;
    }
  `;
  document.head.appendChild(styleSheet);
}