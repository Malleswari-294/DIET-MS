import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", weight: 65 },
  { day: "Tue", weight: 64.8 },
  { day: "Wed", weight: 64.5 },
  { day: "Thu", weight: 64.2 },
  { day: "Fri", weight: 64 },
  { day: "Sat", weight: 63.8 },
  { day: "Sun", weight: 63.5 },
];

function ProgressPage() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Weekly Progress</h2>

      <div style={styles.chartCard}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#ff758c" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#fbc2eb,#a6c1ee)",
    padding: "3rem",
    textAlign: "center",
  },
  heading: {
    color: "#fff",
    marginBottom: "2rem",
  },
  chartCard: {
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    padding: "2rem",
    maxWidth: "700px",
    margin: "auto",
  },
};

export default ProgressPage;