import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ScriptGenerationResult, AnalysisMetric } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.ARRAY,
      description: "Analysis of why the original script was successful.",
      items: {
        type: Type.OBJECT,
        properties: {
          metric: {
            type: Type.STRING,
            enum: [
              AnalysisMetric.HOOK,
              AnalysisMetric.PACING,
              AnalysisMetric.TONE,
              AnalysisMetric.RETENTION
            ],
            description: "The category of the analysis point.",
          },
          description: {
            type: Type.STRING,
            description: "Detailed explanation in Korean.",
          },
          score: {
            type: Type.INTEGER,
            description: "Impact score 1-10.",
          },
        },
        required: ["metric", "description", "score"],
      },
    },
    suggestions: {
      type: Type.ARRAY,
      description: "4 viral topic suggestions that fit this script's structure.",
      items: {
        type: Type.OBJECT,
        properties: {
          topic: {
            type: Type.STRING,
            description: "Suggested topic title in Korean.",
          },
          reason: {
            type: Type.STRING,
            description: "Why this topic fits the formula (in Korean).",
          },
        },
        required: ["topic", "reason"],
      },
    },
  },
  required: ["analysis", "suggestions"],
};

const scriptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy, viral-style YouTube title in Korean.",
    },
    thumbnailIdea: {
      type: Type.STRING,
      description: "Thumbnail description in Korean.",
    },
    script: {
      type: Type.ARRAY,
      description: "The new generated script.",
      items: {
        type: Type.OBJECT,
        properties: {
          sectionTitle: {
            type: Type.STRING,
          },
          audioScript: {
            type: Type.STRING,
            description: "Spoken script in Korean.",
          },
          visualCue: {
            type: Type.STRING,
            description: "Visual instructions in Korean.",
          },
          estimatedDuration: {
            type: Type.STRING,
          },
        },
        required: ["sectionTitle", "audioScript", "visualCue", "estimatedDuration"],
      },
    },
  },
  required: ["title", "thumbnailIdea", "script"],
};

const modelId = "gemini-2.5-flash";

export const analyzeScript = async (originalScript: string): Promise<AnalysisResult> => {
  const prompt = `
    You are a YouTube Algorithm Specialist.
    
    Task:
    1. Analyze the provided "Original Script" to extract its "Viral Formula" (Hook, Pacing, Tone, Retention).
    2. Suggest 4 NEW viral topics that would work perfectly with this specific script structure/formula.
    
    Input Script: "${originalScript}"
    
    Guidelines:
    - Output MUST be in Korean (Hangul).
    - Suggestions should be diverse but relevant to viral trends.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a world-class YouTube producer speaking fluent Korean.",
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("대본 분석 중 오류가 발생했습니다.");
  }
};

export const generateScript = async (
  originalScript: string,
  topic: string,
  analysisContext?: string
): Promise<ScriptGenerationResult> => {
  const prompt = `
    You are a Genius YouTube Scriptwriter.
    
    Task:
    Write a COMPLETE NEW SCRIPT for the "New Topic" by strictly mirroring the structure, pacing, and tone of the "Original Script".
    
    New Topic: "${topic}"
    Original Script: "${originalScript}"
    ${analysisContext ? `Analysis Context: ${analysisContext}` : ''}
    
    Guidelines:
    - If the original asks a question first, the new one must too.
    - Match the sentence length and energy level exactly.
    - Output MUST be in Korean.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scriptSchema,
        systemInstruction: "You are a world-class YouTube producer speaking fluent Korean. You are an expert at cloning script structures.",
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as ScriptGenerationResult;
  } catch (error) {
    console.error("Generation Error:", error);
    throw new Error("대본 생성 중 오류가 발생했습니다.");
  }
};