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

  useEffect(() => {
    if (!userData) return;

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
  }, [userData, weightChange]);

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
    <div style={styles.container}>
      <h2 style={styles.heading}>✨ My Dashboard ✨</h2>

      {userData ? (
        <div style={styles.wrapper}>
          {/* User Card */}
          <div style={styles.card}>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Age:</strong> {userData.age}</p>
            <p><strong>Weight:</strong> {userData.weight} kg</p>
            <p><strong>Height:</strong> {userData.height} inches</p>
            <p><strong>Target:</strong> {userData.target}</p>
            <p><strong>Problem:</strong> {userData.problem}</p>

            <label style={styles.label}>
              Weight Gain / Loss
            </label>

            <select
              value={weightChange}
              onChange={handleWeightChange}
              style={styles.select}
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
          </div>

          {/* Meal Plan Card */}
          <div style={styles.card}>
            <h3 style={{ marginBottom: "1rem" }}>🍽 Today's Meal Plan</h3>

            {loadingMeals ? (
              <p>Loading meals...</p>
            ) : mealPlan.length > 0 ? (
              mealPlan.map((meal) => (
                <div key={meal.id} style={styles.mealItem}>
                  <p style={{ fontWeight: "bold" }}>{meal.title}</p>
                  <p>Ready in: {meal.readyInMinutes} mins</p>
                  <a
                    href={meal.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                  >
                    View Recipe →
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

      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 1rem",
    fontFamily: "Poppins, sans-serif",
  },
  heading: {
    fontSize: "2.8rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "2rem",
    textShadow: "2px 2px 10px rgba(0,0,0,0.2)",
  },
  wrapper: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  card: {
    backdropFilter: "blur(15px)",
    background: "rgba(255, 255, 255, 0.25)",
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    color: "#333",
    transition: "0.3s ease",
  },
  label: {
    marginTop: "1rem",
    fontWeight: "600",
    display: "block",
  },
  select: {
    marginTop: "0.5rem",
    padding: "0.6rem",
    width: "100%",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },
  mealItem: {
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "rgba(255,255,255,0.4)",
    borderRadius: "10px",
  },
  link: {
    color: "#6a11cb",
    fontWeight: "600",
    textDecoration: "none",
  },
  button: {
    marginTop: "2rem",
    padding: "0.9rem 2.5rem",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  },
};

export default Dashboard;