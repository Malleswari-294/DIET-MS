import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [mealPlan, setMealPlan] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [weightChange, setWeightChange] = useState("");
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setWeightChange(data.weightChange || "");
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🔥 Dynamic Meal Plan Fetch
  useEffect(() => {
    if (!userData) return; // wait for user data

    const fetchMealPlan = async () => {
      try {
        setLoadingMeals(true);

        const response = await fetch(
          `http://localhost:5000/api/meal-plan?target=${encodeURIComponent(
            userData.target
          )}&weightChange=${encodeURIComponent(weightChange)}`
        );

        const data = await response.json();
        setMealPlan(data.meals || []);
      } catch (err) {
        console.error("Error fetching meals:", err);
      } finally {
        setLoadingMeals(false);
      }
    };

    fetchMealPlan();
  }, [userData, weightChange]); // 👈 runs when these change

  // Update weightChange in Firestore
  const handleWeightChange = async (e) => {
    const value = e.target.value;
    setWeightChange(value);

    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        weightChange: value,
      });

      setUserData((prev) => ({
        ...prev,
        weightChange: value,
      }));
    } catch (err) {
      console.error("Error updating weightChange:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#fff0f5",
        padding: "2rem",
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
        }}
      >
        Dashboard
      </h2>

      {userData ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "350px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffe6f0",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Age:</strong> {userData.age}</p>
            <p><strong>Weight:</strong> {userData.weight} kg</p>
            <p><strong>Height:</strong> {userData.height} inches</p>
            <p><strong>Target:</strong> {userData.target}</p>
            <p><strong>Problem:</strong> {userData.problem}</p>

            <label
              style={{
                fontWeight: "bold",
                marginTop: "0.5rem",
                display: "block",
              }}
            >
              Weight Gain / Loss
            </label>

            <select
              value={weightChange}
              onChange={handleWeightChange}
              style={{
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <option value="">Select</option>
              <option value="-5">Lose 5 kgs</option>
              <option value="-3">Lose 3 kgs</option>
              <option value="-1">Lose 1 kg</option>
              <option value="0">No change</option>
              <option value="1">Gain 1 kg</option>
              <option value="3">Gain 3 kgs</option>
              <option value="5">Gain 5 kgs</option>
            </select>

            {userData.dietPlan && (
              <>
                <p
                  style={{
                    marginTop: "1rem",
                    fontWeight: "bold",
                    color: "pink",
                  }}
                >
                  Suggested Diet Plan:
                </p>
                <p>{userData.dietPlan}</p>
              </>
            )}
          </div>

          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "#ffe6f0",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              Today's Meal Plan
            </h3>

            {loadingMeals ? (
              <p>Loading meals...</p>
            ) : mealPlan.length > 0 ? (
              mealPlan.map((meal) => (
                <div key={meal.id} style={{ marginBottom: "1rem" }}>
                  <p><strong>{meal.title}</strong></p>
                  <p>Ready in: {meal.readyInMinutes} mins</p>
                  <a
                    href={meal.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Recipe
                  </a>
                </div>
              ))
            ) : (
              <p>No meals available</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading your data...</p>
      )}

      <button
        onClick={handleLogout}
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
        Logout
      </button>
    </div>
  );
}

export default Dashboard;