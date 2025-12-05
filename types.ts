export enum AnalysisMetric {
  HOOK = 'HOOK',
  PACING = 'PACING',
  TONE = 'TONE',
  RETENTION = 'RETENTION'
}

export interface AnalysisPoint {
  metric: AnalysisMetric;
  description: string;
  score: number; // 1-10 impact score
}

export interface ScriptSegment {
  sectionTitle: string; // e.g., "The Hook", "The Reveal"
  audioScript: string; // What the narrator says
  visualCue: string; // What is shown on screen
  estimatedDuration: string; // e.g., "0:00 - 0:15"
}

export interface TopicSuggestion {
  topic: string;
  reason: string;
}

export interface AnalysisResult {
  analysis: AnalysisPoint[];
  suggestions: TopicSuggestion[];
}

export interface ScriptGenerationResult {
  title: string;
  thumbnailIdea: string;
  script: ScriptSegment[];
}

export type AppStep = 'INPUT' | 'ANALYZING' | 'SELECT_TOPIC' | 'GENERATING_SCRIPT' | 'RESULT';