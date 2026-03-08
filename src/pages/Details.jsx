import React, { useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Details() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [target, setTarget] = useState("3 Months");
  const [problem, setProblem] = useState("");
  const [dietPlan, setDietPlan] = useState(""); // API response

  const navigate = useNavigate();

  const getDietPlanFromAPI = async () => {
    try {
      const response = await fetch("https://api.example.com/getDietPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ age, weight, height, target, problem })
      });

      const data = await response.json();
      return data.dietPlan || "No diet plan received";
    } catch (error) {
      console.error("API Error:", error);
      return "Error fetching diet plan";
    }
  };

  const saveDetails = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in");
      return;
    }

    // Call API for diet plan
    const plan = await getDietPlanFromAPI();
    setDietPlan(plan);

    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        age,
        weight,
        height,
        target,
        problem,
        dietPlan: plan // store in Firestore
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
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
        backgroundColor: "#fff0f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          fontWeight: "bold",
          background: "linear-gradient(90deg, lavender, pink)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.2rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Enter Details
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "300px" }}>
        <label style={{ fontWeight: "bold", color: "pink" }}>Name</label>
        <input placeholder="Name" onChange={e => setName(e.target.value)} style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold", color: "pink" }}>Age (years)</label>
        <input placeholder="Age" onChange={e => setAge(e.target.value)} style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold", color: "pink" }}>Weight (kgs)</label>
        <input placeholder="Weight" onChange={e => setWeight(e.target.value)} style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold", color: "pink" }}>Height (inches)</label>
        <input placeholder="Height" onChange={e => setHeight(e.target.value)} style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold", color: "pink" }}>Target</label>
        <select onChange={e => setTarget(e.target.value)} style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option>3 Months</option>
          <option>6 Months</option>
          <option>1 Year</option>
        </select>

        <label style={{ fontWeight: "bold", color: "pink" }}>Your Problem</label>
        <input placeholder="Your Problem" onChange={e => setProblem(e.target.value)} style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }} />
      </div>

      <button
        onClick={saveDetails}
        style={{
          marginTop: "2rem",
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
        Next
      </button>

      {dietPlan && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            width: "300px",
            backgroundColor: "#ffe6f0",
            borderRadius: "8px",
            color: "#333",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontWeight: "bold", color: "pink" }}>Suggested Diet Plan</h3>
          <p>{dietPlan}</p>
        </div>
      )}
    </div>
  );
}

export default Details;
