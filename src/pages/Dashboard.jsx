import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FaChartBar, FaFire } from "react-icons/fa";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [mealPlan, setMealPlan] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [weightChange, setWeightChange] = useState("");
  const navigate = useNavigate();

  // 🔥 STREAK FUNCTION
  const updateStreak = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const today = new Date().toISOString().split("T")[0];

    let newStreak = 1;

    if (data.lastLoginDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (data.lastLoginDate === today) {
        newStreak = data.streakCount || 1;
      } else if (data.lastLoginDate === yesterdayStr) {
        newStreak = (data.streakCount || 0) + 1;
      } else {
        newStreak = 1;
      }
    }

    await updateDoc(docRef, {
      lastLoginDate: today,
      streakCount: newStreak,
    });

    setUserData((prev) => ({
      ...prev,
      streakCount: newStreak,
    }));
  };

  // 🔐 AUTH CHECK + STREAK UPDATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setWeightChange(data.weightChange || "");

          await updateStreak(user); // 🔥 streak runs here
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🍽 MEAL PLAN FETCH
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
      <h2 style={styles.heading}>🌸 My Fitness Dashboard 🌸</h2>

      {userData ? (
        <div style={styles.wrapper}>

          {/* ICON SECTION */}
          <div style={styles.iconRow}>
            <Link to="/progress" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={styles.iconCard}>
                <FaChartBar size={35} />
                <p>Progress Charts</p>
              </div>
            </Link>

            <div style={styles.iconCard}>
              <FaFire size={35} />
              <p>
                {typeof userData.streakCount === "number"
                  ? userData.streakCount
                  : 1}{" "}
                Day Streak 🔥
              </p>
            </div>
          </div>

          {/* USER INFO */}
          <div style={styles.card}>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Age:</strong> {userData.age}</p>
            <p><strong>Weight:</strong> {userData.weight} kg</p>
            <p><strong>Height:</strong> {userData.height} inches</p>
            <p><strong>Target:</strong> {userData.target}</p>
            <p><strong>Problem:</strong> {userData.problem}</p>

            <label style={styles.label}>Weight Gain / Loss</label>

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

          {/* MEAL PLAN */}
          <div style={styles.card}>
            <h3 style={{ marginBottom: "1rem" }}>🍽 Today's Meal Plan</h3>

            {loadingMeals ? (
              <p>Loading meals...</p>
            ) : mealPlan.length > 0 ? (
              mealPlan.map((meal) => (
                <div key={meal.id} style={styles.mealItem}>
                  <p><strong>{meal.title}</strong></p>
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
    padding: "3rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#fff",
    marginBottom: "2rem",
    fontWeight: "700",
  },
  wrapper: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  iconRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
  },
  iconCard: {
    flex: 1,
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "1rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  card: {
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(15px)",
    padding: "1.5rem",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
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
    borderRadius: "8px",
    border: "none",
  },
  mealItem: {
    marginBottom: "1rem",
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
    padding: "0.8rem 2.5rem",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  },
};

export default Dashboard;