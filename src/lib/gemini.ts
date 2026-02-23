import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, GrammarQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      sentence: { type: Type.STRING, description: "The sentence with a blank marked as '______'." },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Four options for the blank."
      },
      correctAnswer: { type: Type.STRING },
      explanation: {
        type: Type.OBJECT,
        properties: {
          rule: { type: Type.STRING, description: "The grammar rule explained in Chinese." },
          example: { type: Type.STRING, description: "An example sentence using the rule." },
          commonMistakes: { type: Type.STRING, description: "Common mistakes students make with this rule in Chinese." }
        },
        required: ["rule", "example", "commonMistakes"]
      },
      category: { type: Type.STRING },
      difficulty: { type: Type.STRING, enum: ["初级", "中级", "高级"] }
    },
    required: ["id", "sentence", "options", "correctAnswer", "explanation", "category", "difficulty"]
  }
};

export async function generateGrammarQuestions(
  category: string,
  difficulty: Difficulty,
  count: number = 5
): Promise<GrammarQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey === '') {
    console.error("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
    return [];
  }

  const timestamp = new Date().getTime();
  const prompt = `Generate ${count} unique English grammar fill-in-the-blank questions for junior high school students.
  Category: ${category}
  Difficulty: ${difficulty}
  Random Seed: ${timestamp}
  
  The sentences should be complex and contextually rich. The options should be plausible but clearly distinguishable based on grammar rules.
  The explanation must be in Chinese.
  Use '______' for the blank.
  Ensure the questions are different from common textbook examples.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 1.0,
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as GrammarQuestion[];
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}
