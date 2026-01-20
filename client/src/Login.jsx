import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("login"); // "login" or "signup"
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const token = credentialResponse.credential;
      const res = await axios.post(
        "http://localhost:5000/google-login",
        { token },
        { withCredentials: true }
      );

      setUser(res.data.user);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.log("GOOGLE LOGIN ERROR →", err);
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleManualLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const handleSignup = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.page}
    >
      {/* BACKGROUND DECORATION */}
      <div style={styles.bgPattern}></div>
      
      {/* LOGIN CARD */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={styles.card}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            style={styles.logoContainer}
          >
            <h2 style={styles.logo}>StockAI</h2>
          </motion.div>
          <h1 style={styles.title}>
            {view === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={styles.subtitle}>
            {view === "login" 
              ? "Sign in to access AI-powered stock insights" 
              : "Start your journey with intelligent investing"}
          </p>
        </div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={styles.errorMessage}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={styles.form}
        >
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          {view === "signup" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={styles.inputGroup}
            >
              <label style={styles.label}>Confirm Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Confirm your password"
              />
            </motion.div>
          )}

          <div style={styles.rememberContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span>Remember me</span>
            </label>
            {view === "login" && (
              <span style={styles.forgotLink}>Forgot Password?</span>
            )}
          </div>

          {/* LOGIN/SIGNUP BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={view === "login" ? handleManualLogin : handleSignup}
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? (
              <div style={styles.spinner} />
            ) : view === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </motion.div>

        {/* DIVIDER */}
        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or continue with</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* GOOGLE LOGIN */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={styles.socialContainer}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            shape="rectangular"
            size="large"
            theme="filled_blue"
            text="signin_with"
            width="100%"
          />
        </motion.div>

        {/* TOGGLE LOGIN/SIGNUP */}
        <div style={styles.switchContainer}>
          <span style={styles.switchText}>
            {view === "login" 
              ? "Don't have an account?" 
              : "Already have an account?"}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setView(view === "login" ? "signup" : "login");
              setError("");
            }}
            style={styles.switchButton}
          >
            {view === "login" ? "Sign up" : "Sign in"}
          </motion.button>
        </div>

        {/* FEATURES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={styles.features}
        >
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📈</div>
            <span style={styles.featureText}>AI Stock Predictions</span>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🛡️</div>
            <span style={styles.featureText}>Risk Analysis</span>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>💼</div>
            <span style={styles.featureText}>Portfolio Tracking</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "20px",
    position: "relative",
    overflow: "hidden"
  },

  bgPattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: `
      radial-gradient(#10b98115 2px, transparent 2px),
      radial-gradient(#05966910 2px, transparent 2px)
    `,
    backgroundSize: "80px 80px",
    backgroundPosition: "0 0, 40px 40px",
    opacity: 0.6
  },

  card: {
    background: "white",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "440px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(16, 185, 129, 0.12)",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
    border: "1px solid #e5e7eb"
  },

  header: {
    marginBottom: "32px"
  },

  logoContainer: {
    marginBottom: "24px"
  },

  logo: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "32px",
    fontWeight: "800",
    margin: 0
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px"
  },

  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "8px"
  },

  errorMessage: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "24px",
    textAlign: "left"
  },

  form: {
    marginBottom: "32px"
  },

  inputGroup: {
    marginBottom: "20px",
    textAlign: "left"
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px"
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "15px",
    color: "#111827",
    background: "white",
    outline: "none",
    transition: "all 0.2s"
  },

  inputFocus: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
  },

  rememberContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    fontSize: "14px"
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6b7280",
    cursor: "pointer"
  },

  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#10b981",
    cursor: "pointer"
  },

  forgotLink: {
    color: "#10b981",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px"
  },

  submitButton: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.2s"
  },

  spinner: {
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  dividerContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "28px"
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e5e7eb"
  },

  dividerText: {
    padding: "0 16px",
    fontSize: "13px",
    color: "#9ca3af",
    fontWeight: "500"
  },

  socialContainer: {
    marginBottom: "32px",
    display: "flex",
    justifyContent: "center"
  },

  switchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginBottom: "40px",
    fontSize: "14px"
  },

  switchText: {
    color: "#6b7280"
  },

  switchButton: {
    background: "transparent",
    border: "none",
    color: "#10b981",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "all 0.2s"
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    flexWrap: "wrap"
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  featureIcon: {
    fontSize: "18px"
  },

  featureText: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500"
  }
};

// Add CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #10b981 !important;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);