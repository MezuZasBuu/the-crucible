/**
 * Tap-to-expand card with optional Cursor deep-reading on expand.
 */

import React, { useEffect, useId, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { DeepReadingRequest } from '../../types';
import { authFetch } from '../../engine/authFetch';
import { FadeInText } from './FadeInText';

type Accent = 'terracotta' | 'sage' | 'slate' | 'indigo' | 'ochre' | 'rose' | 'solar';

const ACCENT: Record<Accent, string> = {
  terracotta: 'scroll-accent-terracotta gradient-card-terracotta',
  sage: 'scroll-accent-sage gradient-card-sage',
  slate: 'scroll-accent-slate gradient-card-slate',
  indigo: 'scroll-accent-indigo gradient-card-indigo',
  ochre: 'scroll-accent-ochre gradient-card-ochre',
  rose: 'scroll-accent-rose gradient-card-rose',
  solar: 'scroll-accent-ochre gradient-card-solar'
};

interface ExpandableDetailCardProps {
  label: string;
  preview: React.ReactNode;
  title: string;
  body: string;
  extra?: React.ReactNode;
  accent?: Accent;
  className?: string;
  deepReading?: DeepReadingRequest;
}

export const ExpandableDetailCard: React.FC<ExpandableDetailCardProps> = ({
  label,
  preview,
  title,
  body,
  extra,
  accent = 'slate',
  className = '',
  deepReading
}) => {
  const [open, setOpen] = useState(false);
  const [deepText, setDeepText] = useState<string | null>(null);
  const [deepSource, setDeepSource] = useState<string | null>(null);
  const [deepLoading, setDeepLoading] = useState(false);
  const [deepError, setDeepError] = useState<string | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      setDeepText(null);
      setDeepSource(null);
      setDeepError(null);
      setDeepLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !deepReading || deepText || deepLoading) return;

    let cancelled = false;
    setDeepLoading(true);
    setDeepError(null);

    authFetch('/api/deep-reading', {
      method: 'POST',
      body: JSON.stringify(deepReading)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (data.code === 'AUTH_REQUIRED') {
            throw new Error('Sign in on the You tab (guest or Google) to unlock Cursor deep readings.');
          }
          if (data.code === 'QUOTA_EXCEEDED') {
            throw new Error(data.error || 'Daily deep reading limit reached.');
          }
          throw new Error(data.error || 'Deep reading failed');
        }
        if (cancelled) return;
        setDeepText(data.expandedText || body);
        setDeepSource(data.source || null);
      })
      .catch((err: Error) => {
        if (!cancelled) setDeepError(err.message || 'Could not load deep reading');
      })
      .finally(() => {
        if (!cancelled) setDeepLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, deepReading, body, deepText, deepLoading]);

  const displayBody = deepText || body;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`scroll-card gradient-card-base text-left w-full transition-transform hover:-translate-y-0.5 ${ACCENT[accent]} ${className}`}
      >
        <p className="scroll-label readable-muted">{label}</p>
        <div className="readable-body text-[1.05rem]">{preview}</div>
        <p className="readable-muted text-[0.95rem] mt-3">
          {deepReading ? 'Tap for full reading · deep expand on open' : 'Tap for full reading'}
        </p>
      </button>

      {open && (
        <div className="detail-overlay" role="presentation" onClick={() => setOpen(false)}>
          <article
            className={`detail-sheet gradient-card-base ${ACCENT[accent]}`}
            role="dialog"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detail-sheet-header">
              <p className="scroll-label readable-muted">{label}</p>
              <button type="button" className="detail-close" onClick={() => setOpen(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FadeInText text={title} as="h3" className="detail-title" delayMs={80} />
            {deepLoading && (
              <p className="readable-body flex items-center gap-2 mt-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Deriving multi-pass reading…
              </p>
            )}
            {deepError && (
              <p className="readable-body text-[color:var(--solar-bright)] mt-4">{deepError}</p>
            )}
            <FadeInText text={displayBody} className="detail-body" delayMs={220} />
            {deepSource && (
              <p className="readable-muted text-[0.9rem] mt-4">Source: {deepSource}</p>
            )}
            {extra && <div className="detail-extra motion-fade-in">{extra}</div>}
          </article>
        </div>
      )}
    </>
  );
};
