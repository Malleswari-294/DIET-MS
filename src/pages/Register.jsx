import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { validateUsername } from "../components/validation";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!validateUsername(username)) {
        alert("Incorrect Username");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        username + "@dietapp.com",
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: username + "@dietapp.com",
        createdAt: new Date()
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        alert("Username already exists");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters");
      } else {
        alert("Registration Failed");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account ✨</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocused("username")}
            onBlur={() => setFocused(null)}
            style={{
              ...styles.input,
              ...(focused === "username" && styles.inputFocus)
            }}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            style={{
              ...styles.input,
              ...(focused === "password" && styles.inputFocus)
            }}
          />
        </div>

        <button onClick={handleRegister} style={styles.primaryButton}>
          Register
        </button>

        <button
          onClick={() => navigate("/login")}
          style={styles.secondaryButton}
        >
          Already have an account? Login
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
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fad0c4)",
    fontFamily: "Poppins, sans-serif",
  },

  card: {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(18px)",
    padding: "40px",
    borderRadius: "25px",
    width: "350px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.3)",
    textAlign: "center"
  },

  heading: {
    fontSize: "28px",
    marginBottom: "30px",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  inputGroup: {
    marginBottom: "20px",
    textAlign: "left"
  },

  label: {
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#444"
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.9)",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)"
  },

  inputFocus: {
    boxShadow:
      "0 0 0 3px rgba(255,118,140,0.4), 0 8px 20px rgba(255,118,140,0.3)",
    transform: "scale(1.02)"
  },

  primaryButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "15px",
    border: "none",
    background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 10px 25px rgba(255,118,140,0.4)",
    transition: "all 0.3s ease"
  },

  secondaryButton: {
    marginTop: "15px",
    background: "transparent",
    border: "2px solid #ff7eb3",
    padding: "10px",
    width: "100%",
    borderRadius: "15px",
    color: "#ff4f81",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease"
  }
};

export default Register;