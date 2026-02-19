import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { validateUsername } from "../components/validation";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#fff0f5", // light lavender-pink
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          fontWeight: "bold",
          background: "linear-gradient(90deg, lavender, pink)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.5rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Login
      </h2>

      <div style={{ marginBottom: "1.5rem", width: "300px" }}>
        <label
          style={{
            fontWeight: "bold",
            color: "pink",
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          Username
        </label>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: "2rem", width: "300px" }}>
        <label
          style={{
            fontWeight: "bold",
            color: "pink",
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        onClick={handleLogin}
        style={{
          padding: "0.8rem 2rem",
          borderRadius: "8px",
          border: "none",
          background: "linear-gradient(90deg, lavender, pink)",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
