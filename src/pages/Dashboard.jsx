import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
            {userData.dietPlan && (
              <>
                <p style={{ marginTop: "1rem", fontWeight: "bold", color: "pink" }}>
                  Suggested Diet Plan:
                </p>
                <p>{userData.dietPlan}</p>
              </>
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
