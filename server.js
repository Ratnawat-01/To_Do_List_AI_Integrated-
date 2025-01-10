const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

const GEMINI_API_KEY = "YOUR_API_KEY";

app.use(express.json());
app.use(cors());

function cleanJSONResponse(responseText) {
    try {
        // Use regex to find the first JSON object in the response
        const jsonMatch = responseText.match(/{[\s\S]*}/);
        if (!jsonMatch) throw new Error("No JSON found in the API response.");

        return JSON.parse(jsonMatch[0]); // Parse the matched JSON
    } catch (error) {
        console.error("Failed to clean JSON response:", error.message);
        throw new Error("The response could not be cleaned into valid JSON.");
    }
}


app.post("/generate-moods", async (req, res) => {
    const { tasks } = req.body;

    try {
        const prompt = `
        Analyze the following tasks and assign them to mood-based categories.
        Examples of mood categories include "Motivated," "Relaxed," "Stressed," "Focused," etc.
        Return a valid JSON object where keys are mood names and values are arrays of tasks.

        Tasks: ${tasks.join(", ")}

        Format:
        {
            "Mood 1": ["Task1", "Task2"],
            "Mood 2": ["Task3", "Task4"]
        }
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: prompt }] }] }
        );

        const rawText = response.data.candidates[0].content.parts[0].text;
        console.log("Raw API Response:", rawText);

        const result = cleanJSONResponse(rawText);
        res.json(result);
    } catch (error) {
        console.error("Error generating moods:", error.message);
        res.status(500).json({ error: "Failed to generate mood groups. Please try again." });
    }
});


// Route: Generate Motivational Thought
app.get("/generate-thought", async (req, res) => {
    try {
        const prompt = "Provide a short motivational thought in 8-15 words.";

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: prompt }] }] }
        );

        const thought = response.data.candidates[0].content.parts[0].text.trim();
        res.json({ thought });
    } catch (error) {
        console.error("Error generating motivational thought:", error.message);
        res.status(500).json({ error: "Failed to generate thought." });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
