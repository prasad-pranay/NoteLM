import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const client = new Mistral({
    apiKey: "WpVy38GOV4eptzpCsUzx25yF3B0fjcpJ",
});

export const generateFromMyModel = async (prompt) => {
    try {
        const response = await client.chat.complete({
            model: "mistral-small-latest", // fast + free tier friendly
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Mistral Error:", error);
        throw error;
    }
};

// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize Gemini with API key from env
// const genAI = new GoogleGenerativeAI("AIzaSyAYNNR4Eyh3tHwFZdMuo_mlHbU8v5X8HeA");

// // Choose model
// const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
// });

// /**
//  * Generate response from Gemini
//  * @param {string} prompt
//  * @returns {Promise<string>}
//  */
// export const generateFromMyModel = async (prompt) => {
//     try {
//         if (!prompt) {
//             throw new Error("Prompt is required");
//         }

//         const result = await model.generateContent(prompt);
//         const response = await result.response;

//         return response.text();
//     } catch (error) {
//         console.error("Gemini Error:", error.message);
//         throw error;
//     }
// };