import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, ScriptResponse } from "../types";

const ANALYSIS_SYSTEM_INSTRUCTION = `
You are an expert YouTube Script Consultant.
Your goal is to deconstruct viral videos to understand WHY they work, and then suggest new topics that would fit that specific successful formula.
Analyze the provided transcript for its structural secrets (hook, pacing, retention).
Then, brainstorm 4 creative, viral-worthy topics that would work perfectly with this specific structure.
`;

const GENERATION_SYSTEM_INSTRUCTION = `
You are a creative YouTube Scriptwriter.
Your task is to take a "New Topic" and write a script for it by cloning the structural formula of an "Original Transcript".
You must strictly follow the original's pacing, hook style, tone, and transition techniques, but apply them to the new subject matter.
Language: Korean (Hangul).
`;

export const analyzeTranscript = async (apiKey: string, transcript: string): Promise<AnalysisResponse> => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('⚠️ API 키를 입력해주세요. 오른쪽 상단의 API Key 설정에서 설정할 수 있습니다.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this Viral YouTube Transcript:
    """
    ${transcript}
    """

    1. Analyze the Hook, Pacing, Retention techniques, Tone, and Viral Factors.
    2. Suggest 4 distinct, high-potential topics that would work well with this script's structure. 
       - If it's a storytelling script, suggest compelling stories.
       - If it's educational, suggest popular "how-to" or "explained" topics.
       - The topics should be catchy and diverse.

    Output JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: prompt,
    config: {
      systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.OBJECT,
            properties: {
              hookStrategy: { type: Type.STRING, description: "Analysis of the opening hook" },
              pacingStructure: { type: Type.STRING, description: "How the video flows speed-wise" },
              retentionTechniques: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of tricks used to keep viewers watching"
              },
              toneAndStyle: { type: Type.STRING, description: "The emotional vibe of the script" },
              viralFactors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key reasons this script likely went viral"
              }
            },
            required: ["hookStrategy", "pacingStructure", "retentionTechniques", "toneAndStyle", "viralFactors"]
          },
          suggestedTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "4 viral topic suggestions based on the analysis"
          }
        },
        required: ["analysis", "suggestedTopics"]
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as AnalysisResponse;
};

export const generateScript = async (apiKey: string, originalTranscript: string, topic: string): Promise<ScriptResponse> => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('⚠️ API 키를 입력해주세요. 오른쪽 상단의 API Key 설정에서 설정할 수 있습니다.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Original Viral Transcript (Template):
    """
    ${originalTranscript}
    """

    New Topic to write about:
    """
    ${topic}
    """

    Write a FULL script for the new topic. 
    - Match the exact length and section breakdown of the original.
    - If the original tells a joke at 0:30, the new one should too.
    - If the original uses a fast montage at 1:00, the new one should too.
    
    Output JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: prompt,
    config: {
      systemInstruction: GENERATION_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          newScript: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Clickbait-worthy title for the new video" },
              targetAudience: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sectionName: { type: Type.STRING, description: "e.g., Hook, Body 1, Climax" },
                    visualCue: { type: Type.STRING, description: "Description of what should be on screen" },
                    audioScript: { type: Type.STRING, description: "What the narrator says" },
                    estimatedDuration: { type: Type.STRING, description: "e.g., '0:00 - 0:15'" }
                  },
                  required: ["sectionName", "visualCue", "audioScript", "estimatedDuration"]
                }
              }
            },
            required: ["title", "targetAudience", "sections"]
          }
        },
        required: ["newScript"]
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as ScriptResponse;
};