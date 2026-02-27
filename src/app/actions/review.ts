"use server"

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/utils/supabase/server';

export type ReviewResponse = {
    score: number
    syntax_errors: string[]
    logic_flaws: string[]
    optimization_tips: string[]
}

export async function reviewCode(code: string, language: string): Promise<ReviewResponse> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not defined.');
    }

    // Instantiate inside the function to ensure the env var is loaded upon execution in Next.js
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const systemInstruction = `
You are a Senior Full-Stack Engineer and AI Specialist.
Objective: Provide an instant, actionable code review for the student's submitted code.
Language: ${language}

Return a structured JSON response EXACTLY matching this schema (do not include markdown block wrapping):
{
  "syntax_errors": ["list", "of", "strings"],
  "logic_flaws": ["list", "of", "strings"],
  "optimization_tips": ["list", "of", "strings"],
  "score": 85
}
score must be an integer between 0 and 100 based on readability and best practices.
Give concise, meaningful feedback.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user', parts: [{ text: `Please review this ${language} code:\n\n${code}` }]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            },
        });

        const outputText = response.text || "{}";

        // Attempt to parse JSON. Often LLMs will wrap in markdown \`\`\`json blocks even if told not to
        let cleanedOutput = outputText.trim();
        const startIndex = cleanedOutput.indexOf('{');
        const endIndex = cleanedOutput.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
            cleanedOutput = cleanedOutput.substring(startIndex, endIndex + 1);
        }

        const reviewData = JSON.parse(cleanedOutput) as ReviewResponse;

        // Optional: Save to Supabase if URL is configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            try {
                const supabase = await createClient();
                const { data: { user } } = await supabase.auth.getUser();

                // Only insert if user is authenticated or adjust Schema to allow anonymous
                if (user) {
                    await supabase.from('reviews').insert({
                        user_id: user.id,
                        code_snippet: code,
                        language: language,
                        score: reviewData.score,
                        syntax_errors: reviewData.syntax_errors,
                        logic_flaws: reviewData.logic_flaws,
                        optimization_tips: reviewData.optimization_tips
                    });
                }
            } catch (dbError) {
                console.error("Supabase insert failed, continuing without saving:", dbError);
            }
        }

        return reviewData;
    } catch (error: any) {
        console.error("Error evaluating code with Gemini:", error);
        throw new Error(`Failed to review code: ${error?.message || "Unknown error"}`);
    }
}
