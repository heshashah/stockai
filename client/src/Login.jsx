import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post(
        "http://localhost:5000/google-login",
        { token },
        { withCredentials: true }
      );


      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.log("GOOGLE LOGIN ERROR →", err);
      alert("Google login failed. Check console for details.");
    }
  }
  const handleManualLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div style={styles.page}>
      {!user ? (
        <div style={styles.card}>
          <h1 style={styles.heading}>Welcome Back</h1>
          <p style={styles.subtitle}>Login to continue</p>

          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={styles.row}>
            <span>Remember me</span>
            <span style={styles.forgot}>Forgot Password?</span>
          </div>

          <button style={styles.button} onClick={handleManualLogin}>
            Log in
          </button>

          <div style={styles.divider}>or continue with</div>

          <div style={styles.social}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Login Failed")}
            />
          </div>

          <p style={styles.signup}>
            Don’t have an account? <span style={styles.link}>Create one</span>
          </p>
        </div>
      ) : (
        <div style={styles.card}>
          <img src={user.picture} style={styles.profile} alt="profile" />
          <h2>Welcome, {user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
}

export default Login;

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2d23, #1f3b2c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
  },

  card: {
    background: "#ffffff",
    padding: "42px",
    width: "380px",
    borderRadius: "18px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    textAlign: "center",
  },

  heading: {
    color: "#0f2d23",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "26px",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    background: "#f9fafb",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "22px",
  },

  forgot: {
    cursor: "pointer",
    color: "#0f2d23",
    fontWeight: "500",
  },

  button: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #d4af37, #b8962e)",
    color: "#0f2d23",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "18px",
  },

  divider: {
    fontSize: "12px",
    color: "#9ca3af",
    marginBottom: "12px",
  },

  social: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },

  signup: {
    fontSize: "13px",
    color: "#6b7280",
  },

  link: {
    color: "#0f2d23",
    fontWeight: "600",
    cursor: "pointer",
  },

  profile: {
    width: "90px",
    borderRadius: "50%",
    marginBottom: "12px",
  },
};
