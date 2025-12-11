export interface ScriptSection {
  sectionName: string;
  visualCue: string;
  audioScript: string;
  estimatedDuration: string;
}

export interface ScriptAnalysis {
  hookStrategy: string;
  pacingStructure: string;
  retentionTechniques: string[];
  toneAndStyle: string;
  viralFactors: string[];
}

export interface AnalysisResponse {
  analysis: ScriptAnalysis;
  suggestedTopics: string[];
}

export interface ScriptResponse {
  newScript: {
    title: string;
    targetAudience: string;
    sections: ScriptSection[];
  };
}

export enum AppStep {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
}