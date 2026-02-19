import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Details from "./pages/Details";
import Dashboard from "./pages/Dashboard";

// Import firebase and firestore
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function App() {

  // Firestore test
  useEffect(() => {
    const testFirestore = async () => {
      try {
        await addDoc(collection(db, "testCollection"), {
          message: "Firestore test successful",
          time: new Date()
        });

        console.log("Firestore connected successfully ✅");
      } catch (error) {
        console.error("Firestore error ❌", error);
      }
    };

    testFirestore();
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/details" element={<Details />} />

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
