
import { GoogleGenAI, Type } from "@google/genai";
import { Habit, HabitLog } from "../types";

// Fix: Initialize GoogleGenAI using the process.env.API_KEY directly as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHabitInsights = async (habits: Habit[], logs: HabitLog[]) => {
  const prompt = `
    Analyze these habits and logs to provide personalized coaching advice.
    Habits: ${JSON.stringify(habits)}
    Logs: ${JSON.stringify(logs)}
    
    Provide:
    1. A motivational summary.
    2. One specific habit to focus on more.
    3. A new habit suggestion based on existing interests.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            focusHabit: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["summary", "focusHabit", "suggestion"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
