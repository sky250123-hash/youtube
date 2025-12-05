import React, { useState } from 'react';
import { analyzeScript, generateScript } from './services/geminiService';
import { AppStep, AnalysisResult, ScriptGenerationResult } from './types';
import { Button } from './components/Button';
import { AnalysisCard } from './components/AnalysisCard';
import { ScriptViewer } from './components/ScriptViewer';
import { Sparkles, Youtube, AlertCircle, ArrowRight, Lightbulb, PenTool, RotateCcw, CheckCircle2 } from 'lucide-react';

function App() {
  const [step, setStep] = useState<AppStep>('INPUT');
  const [originalScript, setOriginalScript] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [finalResult, setFinalResult] = useState<ScriptGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalScript.trim()) return;

    setStep('ANALYZING');
    setError(null);

    try {
      const result = await analyzeScript(originalScript);
      setAnalysisResult(result);
      setStep('SELECT_TOPIC');
    } catch (err: any) {
      setError(err.message || "분석 중 오류가 발생했습니다.");
      setStep('INPUT');
    }
  };

  const handleGenerate = async (topic: string) => {
    if (!topic.trim()) return;
    
    setSelectedTopic(topic);
    setStep('GENERATING_SCRIPT');
    setError(null);

    try {
      // Pass the analysis description as context to help the generator
      const analysisContext = analysisResult?.analysis.map(a => `${a.metric}: ${a.description}`).join('; ');
      const result = await generateScript(originalScript, topic, analysisContext);
      setFinalResult(result);
      setStep('RESULT');
    } catch (err: any) {
      setError(err.message || "생성 중 오류가 발생했습니다.");
      setStep('SELECT_TOPIC');
    }
  };

  const resetAll = () => {
    setStep('INPUT');
    setOriginalScript('');
    setAnalysisResult(null);
    setSelectedTopic('');
    setCustomTopic('');
    setFinalResult(null);
    setError(null);
  };

  const fillExample = () => {
    setOriginalScript(`여러분, 이 물건 절대 사지 마세요. 제가 30만원 주고 샀는데, 진짜 후회하고 있습니다. 처음에는 좋은 줄 알았어요. 디자인도 예쁘고, 기능도 많아 보였거든요. 근데 딱 3일 써보니까 알겠더라고요. 치명적인 단점이 있습니다. 바로 배터리 광탈입니다. 1시간도 못 가서 꺼져버려요. 이게 말이 됩니까? 제조사에 전화했더니 원래 그렇다네요. 아 진짜 열받아서...`);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 selection:bg-brand-500/30 selection:text-brand-200 pb-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-600/10 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold tracking-wider uppercase mb-4 cursor-pointer hover:bg-brand-500/20 transition-colors" onClick={resetAll}>
            <Sparkles className="w-3 h-3" />
            AI Powered Content Creator
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-2 cursor-pointer" onClick={resetAll}>
            Tube<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Alchemy</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            떡상한 영상의 "성공 공식"을 분석하여<br />
            새로운 주제의 대본으로 재탄생시킵니다.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* STEP 1: INPUT */}
        {(step === 'INPUT' || step === 'ANALYZING') && (
          <div className="max-w-3xl mx-auto bg-dark-800/80 backdrop-blur-xl border border-dark-700 rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-500">
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-3">
                <label className="flex justify-between items-center text-sm font-medium text-slate-300">
                  <span className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    참고할 떡상 영상 대본
                  </span>
                  <button 
                    type="button" 
                    onClick={fillExample}
                    className="text-xs text-brand-400 hover:text-brand-300 hover:underline"
                  >
                    예시 채우기
                  </button>
                </label>
                <textarea
                  value={originalScript}
                  onChange={(e) => setOriginalScript(e.target.value)}
                  placeholder="여기에 성공한 영상의 대본을 붙여넣으세요..."
                  className="w-full h-64 bg-dark-900/50 border border-dark-600 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-all text-sm leading-relaxed"
                  required
                  disabled={step === 'ANALYZING'}
                />
              </div>

              <div className="bg-brand-900/10 border border-brand-500/10 rounded-xl p-4 flex gap-4 items-center">
                <div className="p-2 bg-brand-500/20 rounded-lg text-brand-400 shrink-0">
                   <Lightbulb className="w-5 h-5" />
                </div>
                <p className="text-sm text-slate-400">
                   대본을 입력하면 AI가 <strong>구조를 분석</strong>하고 알맞은 <strong>새로운 주제를 추천</strong>해 드립니다.
                </p>
              </div>

              <Button 
                type="submit" 
                isLoading={step === 'ANALYZING'} 
                className="w-full py-4 text-lg shadow-brand-500/20"
                disabled={!originalScript.trim() || step === 'ANALYZING'}
              >
                {step === 'ANALYZING' ? '대본 분석 중...' : '분석 및 주제 추천받기'}
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2: SELECT TOPIC */}
        {(step === 'SELECT_TOPIC' || step === 'GENERATING_SCRIPT') && analysisResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            
            {/* Analysis Summary */}
            <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
                    <ArrowRight className="w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-bold text-white">대본 분석 결과</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisResult.analysis.map((point, i) => (
                  <AnalysisCard key={i} point={point} />
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div>
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <PenTool className="w-5 h-5 text-purple-400" />
                 어떤 주제로 대본을 만들까요?
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 {analysisResult.suggestions.map((suggestion, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleGenerate(suggestion.topic)}
                     disabled={step === 'GENERATING_SCRIPT'}
                     className="group relative text-left p-5 rounded-xl bg-dark-800 border border-dark-700 hover:border-brand-500 hover:bg-dark-700/50 transition-all duration-200"
                   >
                     <div className="flex items-start justify-between mb-2">
                       <h3 className="font-bold text-lg text-slate-200 group-hover:text-brand-400 transition-colors">
                         {suggestion.topic}
                       </h3>
                       {selectedTopic === suggestion.topic && step === 'GENERATING_SCRIPT' && (
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-500"></div>
                       )}
                     </div>
                     <p className="text-sm text-slate-400 leading-relaxed">
                       {suggestion.reason}
                     </p>
                   </button>
                 ))}
               </div>

               {/* Custom Topic Input */}
               <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-dark-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-dark-900 px-2 text-sm text-slate-500">또는 직접 입력</span>
                  </div>
                </div>

               <div className="mt-6 flex gap-3">
                 <input 
                    type="text" 
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="원하는 다른 주제가 있다면 입력하세요..."
                    className="flex-1 bg-dark-800 border border-dark-600 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    disabled={step === 'GENERATING_SCRIPT'}
                 />
                 <Button 
                    onClick={() => handleGenerate(customTopic)}
                    isLoading={step === 'GENERATING_SCRIPT' && selectedTopic === customTopic}
                    disabled={!customTopic.trim() || step === 'GENERATING_SCRIPT'}
                    className="whitespace-nowrap"
                 >
                    대본 생성
                 </Button>
               </div>
               
               <div className="mt-8 text-center">
                  <button onClick={resetAll} className="text-slate-500 hover:text-slate-300 text-sm underline underline-offset-4">
                    처음으로 돌아가기
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* STEP 3: FINAL RESULT */}
        {step === 'RESULT' && finalResult && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-8">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                 <CheckCircle2 className="w-6 h-6 text-green-400" />
                 생성 완료!
               </h2>
               <Button variant="secondary" onClick={resetAll} className="gap-2">
                 <RotateCcw className="w-4 h-4" />
                 새로 만들기
               </Button>
            </div>
            
            <ScriptViewer result={finalResult} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;