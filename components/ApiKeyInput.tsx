import { useState, useEffect } from 'react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const STORAGE_KEY = 'gemini_api_key';

export const ApiKeyInput = ({ onApiKeyChange }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [rememberKey, setRememberKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      setRememberKey(true);
      onApiKeyChange(savedKey);
    } else {
      setIsExpanded(true); // Auto-expand if no key is saved
    }
  }, []);

  const handleSave = () => {
    if (rememberKey && apiKey) {
      localStorage.setItem(STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    onApiKeyChange(apiKey);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setApiKey('');
    setRememberKey(false);
    localStorage.removeItem(STORAGE_KEY);
    onApiKeyChange('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔑</span>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-white">API Key 설정</h3>
              <p className="text-xs text-gray-400">
                {apiKey ? '✅ API 키가 설정되었습니다' : '⚠️ API 키를 입력해주세요'}
              </p>
            </div>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-700 pt-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={isVisible ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-sm text-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {isVisible ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberKey}
                onChange={(e) => setRememberKey(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-rose-500 focus:ring-rose-500 focus:ring-offset-gray-800"
              />
              <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                기억하기 (브라우저에 저장)
              </label>
            </div>

            <div className="text-xs text-gray-500 bg-gray-900 rounded-lg p-3">
              <p className="mb-1">💡 <strong>API 키 발급:</strong></p>
              <a 
                href="https://ai.google.dev/gemini-api/docs/api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 underline"
              >
                https://ai.google.dev/gemini-api/docs/api-key
              </a>
              <p className="mt-2 text-gray-600">무료 모델(Gemini 1.5 Flash)을 사용합니다.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  apiKey.trim()
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                저장
              </button>
              {apiKey && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-lg font-medium text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all"
                >
                  지우기
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
