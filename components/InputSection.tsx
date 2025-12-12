import { useState } from 'react';
import { AppStep } from '../types';

interface InputSectionProps {
  onAnalyze: (transcript: string) => void;
  appStep: AppStep;
}

export const InputSection = ({ onAnalyze, appStep }: InputSectionProps) => {
  const [transcript, setTranscript] = useState('');

  const isBtnDisabled = appStep === AppStep.ANALYZING || !transcript.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(transcript);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="transcript" className="block text-sm font-medium text-rose-400 uppercase tracking-wider flex justify-between items-center">
            <span>1. 떡상한 영상 대본 (복붙)</span>
            <span className="text-gray-500 text-xs normal-case">대본을 분석해 구조를 파악합니다</span>
          </label>
          <textarea
            id="transcript"
            className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none placeholder-gray-600 transition-all text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-600"
            placeholder="여기에 조회수 터진 영상의 스크립트를 붙여넣으세요..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={appStep === AppStep.ANALYZING}
          />
        </div>

        <button
          type="submit"
          disabled={isBtnDisabled}
          className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all transform duration-200 
            ${isBtnDisabled 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white shadow-lg hover:shadow-rose-500/25 hover:-translate-y-1'
            }`}
        >
          {appStep === AppStep.ANALYZING ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>대본 구조 분석 중...</span>
            </span>
          ) : (
            '🔍 구조 분석 및 주제 추천받기'
          )}
        </button>
      </form>
    </div>
  );
};