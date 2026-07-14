import { GoogleGenerativeAI } from '@google/generative-ai';

export function getGenAI(customKey) {
  const key = customKey || process.env.GEMINI_API_KEY || "";
  return new GoogleGenerativeAI(key);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default genAI;
