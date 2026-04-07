"use server"

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';

export type ReviewResponse = {
    score: number
    syntax_errors: string[]
    logic_flaws: string[]
    optimization_tips: string[]
    complexity: {
        time: string
        space: string
    }
    optimized_code: string
}

export async function reviewCode(code: string, language: string): Promise<ReviewResponse> {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const systemInstruction = `
You are a Senior Full-Stack Engineer and AI Specialist.
Objective: Provide an instant, actionable code review for the student's submitted code. 
Language: ${language}

Return a structured JSON response EXACTLY matching this schema:
{
  "syntax_errors": ["list", "of", "strings"],
  "logic_flaws": ["list", "of", "strings"],
  "optimization_tips": ["list", "of", "strings"],
  "complexity": {
    "time": "e.g., O(n)",
    "space": "e.g., O(1)"
  },
  "optimized_code": "The full optimized version of the code",
  "score": 85
}
score must be an integer between 0 and 100 based on readability and best practices.
Give concise, meaningful feedback.

CRITICAL: If the code is already highly optimized and follows best practices, do NOT suggest trivial changes. Instead, set the score high (95-100) and in "optimization_tips" mention that the code is well-optimized but give high-level "next steps" or advanced tips for even further refinement if applicable. If it's already optimized, "optimized_code" should still contain the original code (or a slightly formatted version).

Do NOT include any markdown formatting like \`\`\`json or \`\`\` around the response. Return ONLY the JSON.
`;

    if (groqKey) {
        console.log("Using Groq API for review...");
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${groqKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemInstruction },
                        { role: "user", content: `Please review this ${language} code:\n\n${code}` },
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.2,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const outputText = data.choices[0].message.content;
            return JSON.parse(outputText) as ReviewResponse;
        } catch (error: any) {
            console.error("Groq review failed:", error);
            if (!geminiKey) throw error;
            console.log("Falling back to Gemini...");
        }
    }

    // Fallback to Gemini if Groq fails or is not provided
    if (!geminiKey) {
        throw new Error('No AI API keys (GROQ or GEMINI) found in environment variables.');
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const result = await model.generateContent(`Please review this ${language} code:\n\n${code}`);
        const response = await result.response;
        const outputText = response.text() || "{}";

        let cleanedOutput = outputText.trim();
        const startIndex = cleanedOutput.indexOf('{');
        const endIndex = cleanedOutput.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
            cleanedOutput = cleanedOutput.substring(startIndex, endIndex + 1);
        }

        return JSON.parse(cleanedOutput) as ReviewResponse;
    } catch (error: any) {
        console.error("Gemini review failed:", error);
        throw new Error(`Failed to review code: ${error?.message || "Unknown error"}`);
    }
}
