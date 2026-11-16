import { GoogleGenAI } from "@google/genai";

// Initialize Gemini with API key from env
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateFromMyModel = async (prompt) => {
    try {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

       const response = await genAI.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        }); 

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error.message);
        throw error;
    }
};