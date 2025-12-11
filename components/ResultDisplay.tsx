import React, { useRef, useState } from 'react';
import { ScriptResponse, AnalysisResponse } from '../types';

interface ResultDisplayProps {
  scriptData: ScriptResponse;
  analysisData: AnalysisResponse | null; // Optional if we want to show it again
  onReset: () => void;
  onBackToTopics: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ scriptData, analysisData, onReset, onBackToTopics }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const scriptRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    if (!scriptRef.current) return;
    
    const text = scriptData.newScript.sections.map(s => 
      `[${s.sectionName} | ${s.estimatedDuration}]\n(화면: ${s.visualCue})\n내레이션: ${s.audioScript}\n`
    ).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-700 pb-6 gap-4">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
                GENERATED
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white">{scriptData.newScript.title}</h2>
            <p className="text-gray-400 text-sm mt-1">타겟 시청자: {scriptData.newScript.targetAudience}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <button 
              onClick={onBackToTopics}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              ← 주제 다시 선택
            </button>
             <button 
              onClick={onReset}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              처음으로
            </button>
            <button 
              onClick={copyToClipboard}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {copySuccess ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  복사 완료!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  전체 복사
                </>
              )}
            </button>
          </div>
        </div>

        {/* Script Content */}
        <div className="space-y-6" ref={scriptRef}>
          {scriptData.newScript.sections.map((section, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-gray-900/30 hover:bg-gray-900/50 transition-colors border border-gray-700/50">
              
              {/* Meta Info (Time & Visual) */}
              <div className="md:w-1/4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase">{section.sectionName}</span>
                  <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{section.estimatedDuration}</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300">
                  <span className="block text-gray-500 font-bold mb-1">🎬 화면(Visual)</span>
                  {section.visualCue}
                </div>
              </div>

              {/* Audio Script */}
              <div className="md:w-3/4">
                <div className="h-full bg-gray-800/50 rounded-lg p-4 text-white leading-7 text-lg border-l-4 border-rose-500">
                   {section.audioScript}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};