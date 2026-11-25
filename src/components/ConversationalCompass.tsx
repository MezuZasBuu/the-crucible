/**
 * The Crucible — "Ask about today": a question-and-answer box over the day's calculations.
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
      content: `Hello. Ask me anything about this day.\nIn the Maya calendar it is ${ctx.mayan.tzolkin.formatted} (day ${ctx.mayan.kinNumber} of 260). In the Chinese calendar it falls in a year of the ${ctx.chinese.yearPillar.zodiacAnimal}. Its numerology day number is ${ctx.numerology.universalDay}.\nType a question below, or tap one of the suggestions.`,
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
        content: data.reply || 'No answer came back this time. Please try asking again.',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Compass error:', err);
      setError(err.message || 'Could not reach the answering service.');
    } finally {
      setIsLoading(false);
    }
  };

  const SUGGESTIONS = [
    'What is today good for?',
    'What should I be careful about today?',
    "Explain today's calling in simple terms",
    'Why do the Maya and Chinese calendars say different things today?',
    "What does the Moon's phase mean right now?"
  ];

  return (
    <div className="instrument-panel flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="panel-title">Ask about today</h3>
          <p className="readable-muted mt-1">
            Ask a question in your own words and get a plain answer based on today's readings.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                role: 'assistant',
                content: 'Conversation cleared. Ask a new question whenever you like.',
                timestamp: new Date().toLocaleTimeString()
              }
            ])
          }
          className="cta-ghost"
        >
          Clear conversation
        </button>
      </div>

      {/* Conversation */}
      <div
        className="space-y-3 max-h-[460px] min-h-[160px] overflow-y-auto pr-1"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[92%] sm:max-w-[80%] rounded-xl px-4 py-3 border ${
                m.role === 'user'
                  ? 'bg-[color:var(--surface-well)] border-[color:var(--line-soft)]'
                  : 'bg-white border-[color:var(--line-soft)]'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs text-[color:var(--text-muted)] mb-1">
                <span className="font-semibold">{m.role === 'user' ? 'You' : 'Answer'}</span>
                <span>{m.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap break-words text-base leading-relaxed text-[color:var(--text-primary)]">
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <p className="text-sm text-[color:var(--text-muted)]" role="status">
            Writing an answer…
          </p>
        )}

        {error && (
          <p className="text-sm text-[color:var(--el-fire)]" role="alert">
            Sorry, that question could not be answered just now. Please try again. ({error})
          </p>
        )}
      </div>

      {/* Suggested questions */}
      <div>
        <p className="text-xs text-[color:var(--text-muted)] mb-2">Try one of these</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="explore-tab !h-auto !py-2 text-left !leading-snug !whitespace-normal max-w-full disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Question box */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Type your question…"
          aria-label="Your question"
          className="field-input flex-1 min-w-[12rem]"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={isLoading || !inputPrompt.trim()}
          className="cta-primary"
        >
          Ask
        </button>
      </div>

      <p className="field-help">
        Answers are written by AI from today's calculations. They are for reflection, not advice.
      </p>
    </div>
  );
};
