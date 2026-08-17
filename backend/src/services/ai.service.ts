import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/env";

const ai = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY,
});

export interface TaskSuggestionResult {
  suggestions: string[];
}

export const generateTaskSuggestions = async (
  query: string
): Promise<TaskSuggestionResult> => {
  const cleanedQuery = query.trim();

  if (!cleanedQuery) {
    return {
      suggestions: [],
    };
  }

  const prompt = `
You are the intelligent topic suggestion engine inside an AI Todo application.

The user is typing:

"${cleanedQuery}"

Understand exactly what the user means and suggest closely related
topics or subtopics.

IMPORTANT RULES:

1. Stay very close to the user's topic.
2. Suggest subjects, topics, subtopics, concepts, or learning areas.
3. Do NOT generate generic productivity tasks.
4. Do NOT suggest unrelated activities.
5. Do NOT suggest projects unless the user explicitly asks for projects.
6. Do NOT suggest deployment, Vercel, Netlify, environment setup,
   or similar generic development tasks unless directly related to
   the user's input.
7. Return 6 to 8 suggestions.
8. Keep each suggestion short.
9. Do not number suggestions.
10. Do not explain suggestions.
11. Do not repeat the exact user input unnecessarily.

EXAMPLES:

Input: study

Good suggestions:
Mathematics
English
Hindi
Computer Science
Science
History
Geography
Economics

Input: maths

Good suggestions:
Algebra
Geometry
Trigonometry
Number System
Arithmetic
Probability
Statistics
Calculus

Input: algebra

Good suggestions:
Linear Equations
Quadratic Equations
Polynomials
Factorization
Algebraic Identities
Inequalities
Sequences and Series
Matrices

Input: react

Good suggestions:
React Fundamentals
Components
JSX
Props
State
Hooks
React Router
Context API

Input: hooks

Good suggestions:
useState
useEffect
useContext
useReducer
useMemo
useCallback
useRef
Custom Hooks

Input: useEffect

Good suggestions:
Dependency Array
Effect Cleanup
Handling Side Effects
Data Fetching
Effect Dependencies
Multiple Effects
Common useEffect Mistakes

Input: operating system

Good suggestions:
Processes and Threads
CPU Scheduling
Process Synchronization
Deadlocks
Memory Management
Virtual Memory
File Systems
Disk Scheduling

Input: english

Good suggestions:
Grammar
Tenses
Vocabulary
Reading Comprehension
Articles
Prepositions
Active and Passive Voice
Direct and Indirect Speech

Return ONLY valid JSON in this exact format:

{
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3",
    "suggestion 4",
    "suggestion 5",
    "suggestion 6",
    "suggestion 7",
    "suggestion 8"
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  const text = response.text ?? "";

  let suggestions: string[] = [];

  try {
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedText);

    if (Array.isArray(parsed.suggestions)) {
      suggestions = parsed.suggestions
        .filter(
          (item: unknown): item is string =>
            typeof item === "string"
        )
        .map((item: string) => item.trim())
        .filter(Boolean)
        .slice(0, 8);
    }
  } catch (error) {
    console.error("Failed to parse AI suggestions:", error);
  }

  return {
    suggestions,
  };
};