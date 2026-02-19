import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function TestFirestore() {

  const saveData = async () => {
    try {
      await addDoc(collection(db, "users"), {
        name: "Suhana",
        weight: 55,
        goal: "Lose weight"
      });

      alert("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div>
      <h2>Firestore Test</h2>
      <button onClick={saveData}>Save Data</button>
    </div>
  );
}

export default TestFirestore;
