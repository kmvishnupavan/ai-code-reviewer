"use server"

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';

export type ReviewIssue = {
    type: 'bug' | 'optimization' | 'best_practice' | 'security' | 'static_analysis'
    line?: number
    description: string
    why_it_matters: string
    fix: string
    impact: string
}

export type ReviewResponse = {
    overall_score: number
    readability_score: number
    performance_score: number
    quality_score: number
    bug_risk_score: number
    maintainability_score: number
    scalability_score: number
    interview_readiness_score: number
    code_level: 'Beginner' | 'Intermediate' | 'Industry-ready'
    
    issues: ReviewIssue[]
    explanation: string
    suggested_fixes: string
    optimized_code: string
    complexity: {
        time: string
        space: string
    }
    comparison_metrics: {
        performance_improvement: number
        complexity_reduction: string
        lines_reduced: number
    }
    best_practices: string[]
    interview_insights?: {
        expected_approach: string
        optimal_solution_explanation: string
        brute_force_vs_optimized: string
        follow_up_questions: string[]
        interviewer_feedback: string
    }
    beginner_notes?: {
        simple_explanation: string
        common_mistakes: string
        step_by_step_fix: string
        learning_tip: string
        key_concepts: string[]
    }
}

export type ReviewMode = 'bug_detection' | 'optimization' | 'interview' | 'beginner'

const SYSTEM_PROMPTS: Record<ReviewMode, string> = {
    bug_detection: `You are a Senior Security Engineer. Focus on finding bugs, edge cases, and security vulnerabilities.
Return ONLY JSON. Each issue MUST follow the structure: { "type", "line", "description", "why_it_matters", "fix", "impact" }.`,
    optimization: `You are a Performance Specialist. Focus on time/space complexity, resource optimization, and scalability.
Return ONLY JSON. Each issue MUST follow the structure: { "type", "line", "description", "why_it_matters", "fix", "impact" }.`,
    interview: `You are a Lead Interviewer at a Top-Tier tech company. Analyze code as if it were a high-stakes technical interview. 
Provide a "Brute Force vs Optimized" comparison. 
Return ONLY JSON. Each issue MUST follow the structure: { "type", "line", "description", "why_it_matters", "fix", "impact" }.`,
    beginner: `You are a Friendly Coding Mentor. Use very simple, non-intimidating language for a first-year student.
Explain concepts clearly. Return ONLY JSON. Each issue MUST follow the structure: { "type", "line", "description", "why_it_matters", "fix", "impact" }.`
};

function staticAnalyze(code: string, language: string): ReviewIssue[] {
    const issues: ReviewIssue[] = [];
    
    // Basic rule-based checks (Static Analysis)
    if (language === 'javascript' || language === 'typescript') {
        if (code.includes('var ')) {
            issues.push({
                type: 'static_analysis',
                description: 'Use of "var" detected.',
                why_it_matters: '"var" has functional scope which can lead to hoisting bugs and unexpected behavior.',
                fix: 'Change "var" to "let" or "const".',
                impact: 'Improved scope safety and modern standards compliance.'
            });
        }
        if (code.includes('console.log')) {
             issues.push({
                type: 'static_analysis',
                description: 'Production console.log found.',
                why_it_matters: 'Logging in production can leak sensitive data and slow down execution.',
                fix: 'Remove console.log or use a proper logger.',
                impact: 'Cleaner production code and better security.'
            });
        }
    }

    if (language === 'python') {
        if (code.includes('print(')) {
             issues.push({
                type: 'static_analysis',
                description: 'Debug print statement found.',
                why_it_matters: 'Print statements left in production clutter the output and are unprofessional.',
                fix: 'Use the "logging" module instead.',
                impact: 'More maintainable and industrial-grade output.'
            });
        }
    }

    return issues;
}

export async function reviewCode(code: string, language: string, mode: ReviewMode = 'bug_detection'): Promise<ReviewResponse> {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const baseInstruction = `
Objective: Provide a DEEP, structured code review for our "CritiqueAI Mentor" platform.
Mode: ${mode}
Language: ${language}

Return a STRICT JSON response with this structure:
{
  "overall_score": number(0-100),
  "readability_score": number,
  "performance_score": number,
  "quality_score": number,
  "bug_risk_score": number,
  "maintainability_score": number,
  "scalability_score": number,
  "interview_readiness_score": number,
  "code_level": "Beginner|Intermediate|Industry-ready",
  "issues": [{"type": "bug|optimization|best_practice|security", "line": number, "description": "text", "why_it_matters": "text", "fix": "text", "impact": "text"}],
  "explanation": "concise overview",
  "suggested_fixes": "Markdown formatted",
  "optimized_code": "full code",
  "complexity": {"time": "O(?)", "space": "O(?)"},
  "comparison_metrics": {"performance_improvement": number(%), "complexity_reduction": "text", "lines_reduced": number},
  "best_practices": ["tip"],
  "interview_insights": {"expected_approach": "text", "optimal_solution_explanation": "text", "brute_force_vs_optimized": "text", "follow_up_questions": ["q"], "interviewer_feedback": "text"},
  "beginner_notes": {"simple_explanation": "text", "common_mistakes": "text", "step_by_step_fix": "text", "learning_tip": "text", "key_concepts": ["c"]}
}
`;

    const systemInstruction = `${baseInstruction}\n\n${SYSTEM_PROMPTS[mode]}\n\nReturn ONLY raw JSON.`;

    let reviewData: ReviewResponse;

    try {
        if (groqKey) {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "system", content: systemInstruction }, { role: "user", content: `Review this ${language} code:\n\n${code}` }],
                    response_format: { type: "json_object" },
                    temperature: 0.1,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                reviewData = JSON.parse(data.choices[0].message.content);
            } else throw new Error();
        } else throw new Error();
    } catch {
        if (!geminiKey) throw new Error('No API keys.');
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
        const result = await model.generateContent(`${systemInstruction}\n\nCode:\n${code}`);
        reviewData = JSON.parse(result.response.text());
    }

    // Merge static analysis results (Hybrid logic)
    const staticIssues = staticAnalyze(code, language);
    reviewData.issues = [...staticIssues, ...reviewData.issues];

    // Save to Database
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('reviews').insert({
                user_id: user.id,
                code_snippet: code,
                language,
                review_mode: mode,
                overall_score: reviewData.overall_score,
                readability_score: reviewData.readability_score,
                performance_score: reviewData.performance_score,
                quality_score: reviewData.quality_score,
                bug_risk_score: reviewData.bug_risk_score,
                maintainability_score: reviewData.maintainability_score,
                scalability_score: reviewData.scalability_score,
                interview_readiness_score: reviewData.interview_readiness_score,
                code_level: reviewData.code_level,
                issues: reviewData.issues,
                explanation: reviewData.explanation,
                suggested_fixes: reviewData.suggested_fixes,
                optimized_code: reviewData.optimized_code,
                complexity: reviewData.complexity,
                best_practices: reviewData.best_practices,
                interview_insights: reviewData.interview_insights,
                beginner_notes: reviewData.beginner_notes,
                comparison_metrics: reviewData.comparison_metrics,
                hybrid_report: { static_count: staticIssues.length, ai_count: reviewData.issues.length - staticIssues.length }
            });
        }
    } catch (dbError) {
        console.error("Save error:", dbError);
    }

    return reviewData;
}
