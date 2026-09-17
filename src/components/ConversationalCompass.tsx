/**
 * The Crucible — Conversational Compass (Hermetic Intelligence)
 * High Density Theme: #0a0a0a surfaces, #222 borders, sharp corners,
 * border-l-2 assistant messages, and condensed prompt bar.
 */

import React, { useState } from 'react';
import { CompleteCalculationContext } from '../types';

interface ConversationalCompassProps {
  ctx: CompleteCalculationContext;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ConversationalCompass: React.FC<ConversationalCompassProps> = ({ ctx }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `The Crucible Compass is initialized.\nSynchronic alignment: ${ctx.mayan.tzolkin.formatted} (Kin ${ctx.mayan.kinNumber}), Chinese ${ctx.chinese.yearPillar.stemPinYin}-${ctx.chinese.yearPillar.branchPinYin} (${ctx.chinese.yearPillar.zodiacAnimal}), Universal Day ${ctx.numerology.universalDay}, Life Path ${ctx.numerology.lifePathNumber}.\nReady to interpret multi-tradition cross-correlations.`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/compass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          context: ctx
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply || 'The Crucible generated an empty response.',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Compass error:', err);
      setError(err.message || 'Failed to connect to the Crucible backend compass.');
    } finally {
      setIsLoading(false);
    }
  };

  const SUGGESTIONS = [
    'Sacred initiatory task for today\'s configuration',
    'Synthesize Maya Tzolk\'in with Chinese Year pillar',
    'Explain highest Twelve Tribes affinity & gemstone',
    'Which astrocartography lines offer the strongest creative elevation?'
  ];

  return (
    <div className="bg-[#0a0a0a] border border-[#222] p-3 rounded-sm flex flex-col h-[560px] font-mono shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222] pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 border border-cyan-400 bg-cyan-950/80" />
          <div>
            <h3 className="text-xs font-bold tracking-wider text-white uppercase font-cinzel">
              Conversational Compass
            </h3>
            <p className="text-[9px] text-gray-500 uppercase">
              Hermetic Reasoning Matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content: 'Compass ledger reset. Synchronized to active temporal state.',
                  timestamp: new Date().toLocaleTimeString()
                }
              ])
            }
            className="text-[9px] uppercase text-gray-400 hover:text-white px-2 py-0.5 rounded-sm bg-[#111] border border-[#222] transition-colors"
          >
            Clear Ledger
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] rounded-sm p-2.5 leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#151515] text-cyan-200 border border-[#333]'
                  : 'bg-[#0d0d0d] border border-[#222] border-l-2 border-l-cyan-500 text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[9px] text-gray-500 mb-1 border-b border-[#1a1a1a] pb-0.5">
                <span className="font-bold uppercase tracking-wider text-cyan-500">
                  {m.role === 'user' ? 'Inquirer' : 'The Crucible Compass'}
                </span>
                <span className="text-[8px] text-gray-600">{m.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap font-sans text-xs text-gray-100 font-normal leading-relaxed">
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] p-2 bg-[#0d0d0d] border border-[#222] border-l-2 border-cyan-500 rounded-sm">
            <span className="animate-spin text-sm">⚙</span>
            <span className="uppercase tracking-wider">Synthesizing hermetic nodes across the matrix...</span>
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-950/40 border border-red-900 text-red-300 text-[10px] rounded-sm">
            Fault: {error}
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="py-2 border-t border-[#222] flex flex-wrap gap-1">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            disabled={isLoading}
            className="text-[9px] px-2 py-0.5 rounded-sm bg-[#111] hover:bg-[#181818] hover:border-cyan-800 text-gray-400 hover:text-cyan-300 border border-[#222] transition-colors text-left truncate max-w-full"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="pt-2 flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Enter inquiry to query the esoteric framework..."
          className="flex-1 bg-[#080808] border border-[#222] rounded-sm px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 font-sans"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !inputPrompt.trim()}
          className="px-3 py-1.5 rounded-sm bg-[#141414] hover:bg-[#202020] border border-[#333] hover:border-cyan-500 text-cyan-400 text-[10px] uppercase font-bold tracking-wider disabled:opacity-40 transition-colors"
        >
          Consult
        </button>
      </div>
    </div>
  );
};
