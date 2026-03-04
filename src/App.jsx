import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Details from "./pages/Details";
import Dashboard from "./pages/Dashboard";
import ProgressPage from "./pages/ProgressPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details" element={<Details />} />
        <Route path="/dashboard" element={<Dashboard />} />
       < Route path="/progress" element={<ProgressPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
