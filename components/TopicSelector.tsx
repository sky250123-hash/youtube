import { useState } from 'react';
import { AnalysisResponse, AppStep } from '../types';

interface TopicSelectorProps {
  analysisData: AnalysisResponse;
  onGenerateScript: (topic: string) => void;
  appStep: AppStep;
  onReset: () => void;
}

const AnalysisCard = ({ title, content, colorClass }: { title: string; content: string | string[]; colorClass: string }) => (
  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
    <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${colorClass}`}>{title}</h4>
    {Array.isArray(content) ? (
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
        {content.map((item, idx) => <li key={idx} className="line-clamp-2">{item}</li>)}
      </ul>
    ) : (
      <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">{content}</p>
    )}
  </div>
);

export const TopicSelector: React.FC<TopicSelectorProps> = ({ analysisData, onGenerateScript, appStep, onReset }) => {
  const [customTopic, setCustomTopic] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const handleGenerate = (topic: string) => {
    onGenerateScript(topic);
  };

  const isGenerating = appStep === AppStep.GENERATING;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Top: Analysis Summary */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-white flex items-center">
            <span className="bg-blue-500 w-2 h-6 rounded mr-3"></span>
            분석 완료: 이 대본의 성공 공식
          </h2>
          <button onClick={onReset} className="text-xs text-gray-500 hover:text-gray-300 underline">처음으로</button>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalysisCard title="🎯 훅(Hook)" content={analysisData.analysis.hookStrategy} colorClass="text-rose-400" />
          <AnalysisCard title="🌊 페이싱" content={analysisData.analysis.pacingStructure} colorClass="text-blue-400" />
          <AnalysisCard title="🧲 리텐션" content={analysisData.analysis.retentionTechniques} colorClass="text-yellow-400" />
          <AnalysisCard title="🔥 바이럴 요인" content={analysisData.analysis.viralFactors} colorClass="text-green-400" />
        </div>
      </div>

      {/* Bottom: Topic Selection */}
      <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">어떤 주제로 대본을 만들까요?</h2>
        <p className="text-gray-400 text-sm mb-6">분석된 구조에 딱 맞는 주제들을 추천해드립니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Suggestions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">AI 추천 주제</h3>
            <div className="grid gap-3">
              {analysisData.suggestedTopics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGenerate(topic)}
                  disabled={isGenerating}
                  className="text-left group relative p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-rose-500 hover:bg-gray-900/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <span className="text-gray-200 font-medium group-hover:text-white">{topic}</span>
                  </div>
                  {isGenerating && selectedSuggestion === topic && (
                     <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                       <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Custom Input */}
          <div className="space-y-4 flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">직접 입력하기</h3>
            <div className="flex-grow flex flex-col bg-gray-900/50 p-6 rounded-xl border border-gray-700 border-dashed">
              <label className="text-gray-300 text-sm mb-2 block">원하는 주제가 따로 있나요?</label>
              <textarea
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="예: 갤럭시 Z플립6 사용기, 집에서 만드는 스타벅스 커피..."
                className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-4"
                disabled={isGenerating}
              />
              <button
                onClick={() => handleGenerate(customTopic)}
                disabled={isGenerating || !customTopic.trim()}
                className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-bold transition-colors flex justify-center items-center gap-2"
              >
                {isGenerating && !selectedSuggestion ? (
                   <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    생성 중...
                   </>
                ) : (
                  '이 주제로 생성하기'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};