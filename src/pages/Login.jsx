import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { validateUsername } from "../components/validation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!validateUsername(username)) {
      alert("Incorrect Username");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username + "@dietapp.com",
        password
      );

      const user = userCredential.user;

      // 🔎 Check Firestore profile
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // No user document → redirect to details
        navigate("/details");
        return;
      }

      const data = docSnap.data();

      // Profile incomplete → go to details
      if (!data.name || !data.age || !data.weight || !data.height) {
        navigate("/details");
      } else {
        // Profile complete → go to dashboard
        navigate("/dashboard");
      }
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

          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
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

            <span
              style={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
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
  passwordWrapper: {
    position: "relative",
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
  inputFocus: {
    boxShadow:
      "0 0 0 3px rgba(255, 118, 140, 0.4), 0 8px 20px rgba(255,118,140,0.3)",
    transform: "scale(1.02)",
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#555",
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