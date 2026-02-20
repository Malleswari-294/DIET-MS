import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const container = {
    height: "100vh",
    background: "linear-gradient(135deg, #ff6ec4, #7873f5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  const header = {
    marginTop: "20px",
    fontSize: "28px",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "40px",
  };

  const title = {
    marginTop: "120px",
    fontSize: "48px",
    fontWeight: "bold",
    textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
  };

  const buttonContainer = {
    marginTop: "80px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 200px)",
    gap: "40px",
    justifyContent: "center",
    alignItems: "center",
  };

  const circleButton = (color) => ({
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    border: "none",
    fontSize: "22px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
    background: color,
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    transition: "0.3s",
  });

  return (
    <div style={container}>
      <div style={header}>🥗 Diet App</div>

      <h1 style={title}>Welcome to Diet App</h1>

      <div style={buttonContainer}>
        <button
          style={circleButton("linear-gradient(145deg, #ff2e88, #ff5fa2)")}
          onClick={() => navigate("/register")}
        >
          Register
        </button>

        <button
          style={circleButton("linear-gradient(145deg, #f9a825, #f57f17)")}
          onClick={() => navigate("/details")}
        >
          Details
        </button>

        <button
          style={circleButton("linear-gradient(145deg, #43a047, #2e7d32)")}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          style={circleButton("linear-gradient(145deg, #7b1fa2, #4a148c)")}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;