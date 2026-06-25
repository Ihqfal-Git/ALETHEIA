import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSy-xxxxxxxxxxxxxxxx");

export default genAI;
