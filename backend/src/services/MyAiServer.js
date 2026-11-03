// import { Mistral } from "@mistralai/mistralai";
// import dotenv from "dotenv";

// dotenv.config();

// const client = new Mistral({
//     apiKey: "WpVy38GOV4eptzpCsUzx25yF3B0fjcpJ",
// });

// export const generateFromMyModel = async (prompt) => {
//     try {
//         const response = await client.chat.complete({
//             model: "mistral-small-latest", // fast + free tier friendly
//             messages: [
//                 {
//                     role: "user",
//                     content: prompt,
//                 },
//             ],
//         });

//         return response.choices[0].message.content;
//     } catch (error) {
//         console.error("Mistral Error:", error);
//         throw error;
//     }
// };


import { GoogleGenAI } from "@google/genai";

// Initialize Gemini with API key from env
const genAI = new GoogleGenAI({
    apiKey: "AQ.Ab8RN6KlnxBsvWi6baX5tVKdwWQ29vE7umSowQsO_8pVve2H2Q",
    // apiKey: process.env.GEMINI_API_KEY,
});

export const generateFromMyModel = async (prompt) => {
    try {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

       const response = await genAI.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error.message);
        throw error;
    }
};