import { useState } from 'react';
import { analyzeTranscript, generateScript } from './services/geminiService';
import { AppStep, AnalysisResponse, ScriptResponse } from './types';
import { ApiKeyInput } from './components/ApiKeyInput';
import { InputSection } from './components/InputSection';
import { TopicSelector } from './components/TopicSelector';
import { ResultDisplay } from './components/ResultDisplay';

const App = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [apiKey, setApiKey] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [scriptResult, setScriptResult] = useState<ScriptResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Analyze
  const handleAnalyze = async (inputTranscript: string) => {
    setStep(AppStep.ANALYZING);
    setErrorMsg(null);
    setTranscript(inputTranscript);
    
    try {
      const data = await analyzeTranscript(apiKey, inputTranscript);
      setAnalysisResult(data);
      setStep(AppStep.TOPIC_SELECTION);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "대본 분석에 실패했습니다. 내용을 확인하고 다시 시도해주세요.");
      setStep(AppStep.ERROR);
    }
  };

  // Step 2: Generate
  const handleGenerateScript = async (topic: string) => {
    setStep(AppStep.GENERATING);
    setErrorMsg(null);
    
    try {
      const data = await generateScript(apiKey, transcript, topic);
      setScriptResult(data);
      setStep(AppStep.RESULT);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "대본 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setStep(AppStep.ERROR); // Or stay on TOPIC_SELECTION and show inline error? Simplified to ERROR for now.
    }
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setTranscript('');
    setAnalysisResult(null);
    setScriptResult(null);
    setErrorMsg(null);
  };

  const handleBackToTopics = () => {
    setStep(AppStep.TOPIC_SELECTION);
    setScriptResult(null);
  };

  const handleRetry = () => {
    if (transcript && !analysisResult) {
       // Failed during analysis
       handleAnalyze(transcript);
    } else if (analysisResult) {
      // Failed during generation
      setStep(AppStep.TOPIC_SELECTION);
      setErrorMsg(null);
    } else {
      handleReset();
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-rose-500 selection:text-white pb-20">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gray-900 border-b border-gray-800">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-gray-800 rounded-full mb-4 border border-gray-700 shadow-sm">
            <span className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">무료</span>
            <span className="ml-2 text-gray-400 text-xs font-medium pr-2">Gemini 1.5 Flash</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Viral Script <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Cloner</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            떡상한 유튜브 영상의 성공 공식을 훔치세요.<br className="hidden md:block"/>
            구조는 그대로, AI가 제안하는 새로운 주제로 다시 태어납니다.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* API Key Input - Always visible at top */}
        <ApiKeyInput onApiKeyChange={setApiKey} />
        
        {step === AppStep.ERROR && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-center flex flex-col items-center gap-4">
            <p>{errorMsg}</p>
            <button onClick={handleRetry} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-sm transition-colors">다시 시도하기</button>
          </div>
        )}

        {/* Step 1: Input */}
        {(step === AppStep.INPUT || step === AppStep.ANALYZING) && (
          <InputSection onAnalyze={handleAnalyze} appStep={step} />
        )}

        {/* Step 2: Topic Selection */}
        {(step === AppStep.TOPIC_SELECTION || step === AppStep.GENERATING) && analysisResult && (
          <TopicSelector 
            analysisData={analysisResult} 
            onGenerateScript={handleGenerateScript} 
            appStep={step} 
            onReset={handleReset}
          />
        )}

        {/* Step 3: Result */}
        {step === AppStep.RESULT && scriptResult && (
          <ResultDisplay 
            scriptData={scriptResult} 
            analysisData={analysisResult} 
            onReset={handleReset} 
            onBackToTopics={handleBackToTopics}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-600 text-sm pb-8">
        <p>© 2024 Viral Script Cloner. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;