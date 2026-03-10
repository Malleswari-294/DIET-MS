import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Home route
app.get("/", (req, res) => {
  res.send("Gemini AI backend running");
});


// ------------------------------
// Gemini Meal Plan API (GET)
// ------------------------------
app.get("/api/meal-plan", async (req, res) => {

  try {

    const { diet = "balanced diet" } = req.query;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
Create a simple meal plan for ${diet}.
Give:
Breakfast
Lunch
Dinner
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    // Convert Gemini response into meals array
    const meals = [
      { 
        id: 1, 
        title: "Breakfast", 
        description: text,
        readyInMinutes: 20,
        sourceUrl: "#"
      },
      { 
        id: 2, 
        title: "Lunch", 
        description: text,
        readyInMinutes: 30,
        sourceUrl: "#"
      },
      { 
        id: 3, 
        title: "Dinner", 
        description: text,
        readyInMinutes: 25,
        sourceUrl: "#"
      }
    ];

    res.json({ meals });

  } catch (error) {

    console.error("Gemini error:", error);

    res.json({
      meals: [
        { 
          id: 1, 
          title: "Breakfast", 
          description: "Oatmeal with fruits",
          readyInMinutes: 20,
          sourceUrl: "#"
        },
        { 
          id: 2, 
          title: "Lunch", 
          description: "Rice with vegetables",
          readyInMinutes: 30,
          sourceUrl: "#"
        },
        { 
          id: 3, 
          title: "Dinner", 
          description: "Vegetable soup",
          readyInMinutes: 25,
          sourceUrl: "#"
        }
      ]
    });

  }

});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});