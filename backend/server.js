import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/meal-plan", async (req, res) => {
  try {
    const { target, weightChange = 0, diet } = req.query;
    if (!target) return res.status(400).json({ error: "targetCalories is required" });

    let adjustedCalories = parseInt(target);
    const weightNum = parseInt(weightChange);
    if (!isNaN(weightNum)) adjustedCalories += weightNum * 500;

    const url = new URL("https://api.spoonacular.com/mealplanner/generate");
    url.searchParams.append("timeFrame", "day");
    url.searchParams.append("targetCalories", adjustedCalories);
    if (diet) url.searchParams.append("diet", diet);
    url.searchParams.append("apiKey", process.env.SPOONACULAR_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    res.json({ meals: data.meals || [], nutrients: data.nutrients || {} });
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));