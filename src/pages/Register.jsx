import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { validateUsername } from "../components/validation";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        Register
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
          type="text"
          placeholder="Username"
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
        onClick={handleRegister}
        style={{
          padding: "0.8rem 2rem",
          borderRadius: "8px",
          border: "none",
          background: "linear-gradient(90deg, lavender, pink)",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Next
      </button>

      {/* Login Button */}
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "0.5rem 1.5rem",
          borderRadius: "8px",
          border: "2px solid pink",
          backgroundColor: "white",
          color: "pink",
          fontWeight: "bold",
          fontSize: "0.95rem",
          cursor: "pointer",
        }}
      >
        Already have an account? Login
      </button>
    </div>
  );
}

export default Register;
