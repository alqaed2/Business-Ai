import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateAIResponse = async (
  prompt: string, 
  systemInstruction?: string,
  options?: { temperature?: number; maxOutputTokens?: number }
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are a senior business AI assistant. Provide professional, actionable insights.",
        temperature: options?.temperature,
        maxOutputTokens: options?.maxOutputTokens,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
