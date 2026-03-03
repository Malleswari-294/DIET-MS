import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { validateUsername } from "../components/validation";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!validateUsername(username)) {
      alert("Incorrect Username");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, username + "@dietapp.com", password);
      navigate("/details");
    } catch (error) {
      console.error(error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back 👋</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocused("username")}
            onBlur={() => setFocused(null)}
            style={{
              ...styles.input,
              ...(focused === "username" && styles.inputFocus),
            }}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            style={{
              ...styles.input,
              ...(focused === "password" && styles.inputFocus),
            }}
          />
        </div>

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #d4fc79, #96e6a1)",
    fontFamily: "Poppins, sans-serif",
  },

  card: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(15px)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    width: "350px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.3)",
  },

  heading: {
    fontSize: "28px",
    marginBottom: "30px",
    background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
  },

  inputGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },

  label: {
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px",
    display: "block",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },

  // 🌟 Glow Effect
  inputFocus: {
    boxShadow:
      "0 0 0 3px rgba(255, 118, 140, 0.4), 0 8px 20px rgba(255,118,140,0.3)",
    transform: "scale(1.02)",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 8px 20px rgba(255, 118, 140, 0.4)",
  },
};

export default Login;
