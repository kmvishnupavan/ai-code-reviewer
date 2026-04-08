"use server"

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function askMentor(code: string, message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error('No Gemini API key.');

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `You are the "CritiqueAI Mentor". You are helping a student understand this code. Always be concise, technical yet encouraging, and professional. Current code context:\n\n${code}` }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to mentor the user on this code. How can I help?" }]
            },
            ...history
        ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
}
