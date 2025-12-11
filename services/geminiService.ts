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
  const model = ai.getGenerativeModel({ 
    model: "gemini-pro",
    systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
  });

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

    Output JSON with this schema:
    {
      "analysis": {
        "hookStrategy": "string",
        "pacingStructure": "string",
        "retentionTechniques": ["string"],
        "toneAndStyle": "string",
        "viralFactors": ["string"]
      },
      "suggestedTopics": ["string", "string", "string", "string"]
    }
  `;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const response = result.response;
  if (!response.text()) throw new Error("No response from Gemini");
  return JSON.parse(response.text()) as AnalysisResponse;
};

export const generateScript = async (apiKey: string, originalTranscript: string, topic: string): Promise<ScriptResponse> => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('⚠️ API 키를 입력해주세요. 오른쪽 상단의 API Key 설정에서 설정할 수 있습니다.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.getGenerativeModel({ 
    model: "gemini-pro",
    systemInstruction: GENERATION_SYSTEM_INSTRUCTION,
  });

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
    
    Output JSON with this schema:
    {
      "newScript": {
        "title": "string",
        "targetAudience": "string",
        "sections": [
          {
            "sectionName": "string",
            "visualCue": "string",
            "audioScript": "string",
            "estimatedDuration": "string"
          }
        ]
      }
    }
  `;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const response = result.response;
  if (!response.text()) throw new Error("No response from Gemini");
  return JSON.parse(response.text()) as ScriptResponse;
};