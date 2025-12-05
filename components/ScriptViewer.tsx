import React, { useState } from 'react';
import { ScriptGenerationResult } from '../types';
import { Copy, Check, Video, Mic, Image as ImageIcon } from 'lucide-react';

interface ScriptViewerProps {
  result: ScriptGenerationResult;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = result.script.map(s => `[${s.sectionTitle}] (${s.estimatedDuration})\nVisual: ${s.visualCue}\nAudio: ${s.audioScript}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header Info */}
      <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="space-y-2 flex-1">
            <h3 className="text-xs font-bold text-brand-400 tracking-widest uppercase">생성된 제목</h3>
            <h2 className="text-2xl font-bold text-white leading-tight">{result.title}</h2>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-sm font-medium transition-colors border border-dark-600 text-slate-200"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? '복사됨' : '전체 복사'}
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-dark-700 flex gap-4 items-start">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
                <ImageIcon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-xs font-bold text-purple-400 tracking-widest uppercase mb-1">썸네일 아이디어</h3>
                <p className="text-slate-300 text-sm">{result.thumbnailIdea}</p>
            </div>
        </div>
      </div>

      {/* Script Body */}
      <div className="space-y-4">
        {result.script.map((segment, index) => (
          <div 
            key={index} 
            className="group relative bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden hover:border-brand-500/30 transition-colors"
          >
            {/* Header Strip */}
            <div className="bg-dark-900/50 px-6 py-3 flex justify-between items-center border-b border-dark-700/50">
              <span className="font-mono text-xs text-brand-400 font-bold">{segment.sectionTitle}</span>
              <span className="font-mono text-xs text-slate-500">{segment.estimatedDuration}</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Visual Cue */}
              <div className="md:col-span-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Video className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">화면 (Visual)</span>
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                  {segment.visualCue}
                </p>
              </div>

              {/* Audio Script */}
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2 text-brand-400 mb-1">
                  <Mic className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">오디오 (Audio)</span>
                </div>
                <p className="text-lg text-white leading-relaxed font-medium">
                  {segment.audioScript}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};