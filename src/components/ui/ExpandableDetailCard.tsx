/**
 * Tap-to-expand card — Pattern-style surface, no side color markers.
 */

import React, { useEffect, useId, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { DeepReadingRequest } from '../../types';
import { authFetch } from '../../engine/authFetch';
import { FadeInText } from './FadeInText';
import { StoryProse } from './StoryProse';

interface ExpandableDetailCardProps {
  label: string;
  preview: React.ReactNode;
  title: string;
  body: string;
  extra?: React.ReactNode;
  className?: string;
  deepReading?: DeepReadingRequest;
}

export const ExpandableDetailCard: React.FC<ExpandableDetailCardProps> = ({
  label,
  preview,
  title,
  body,
  extra,
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
            throw new Error('Sign in on the You tab (guest or Google) to unlock deep readings.');
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
        className={`scroll-card text-left w-full min-h-[8.5rem] flex flex-col justify-between ${className}`}
      >
        <div>
          <p className="scroll-label readable-muted">{label}</p>
          <div className="readable-body text-[1.0625rem] mt-2 leading-snug">{preview}</div>
        </div>
        <p className="readable-muted text-[0.9rem] mt-4">Tap to open</p>
      </button>

      {open && (
        <div className="detail-overlay" role="presentation" onClick={() => setOpen(false)}>
          <article
            className="detail-sheet scroll-card"
            role="dialog"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detail-sheet-header">
              <span className="ladder-category static !relative !top-0 !right-0">{label}</span>
              <button type="button" className="detail-close" onClick={() => setOpen(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FadeInText text={title} as="h3" className="detail-title mt-2" delayMs={80} />
            {deepLoading && (
              <p className="readable-body flex items-center gap-2 mt-4 text-[1rem]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Opening the full read…
              </p>
            )}
            {deepError && <p className="readable-body text-[color:var(--solar-deep)] mt-4">{deepError}</p>}
            <div className="detail-body mt-4 text-[1.0625rem] leading-relaxed space-y-4">
              {displayBody.split(/\n\n+/).filter(Boolean).map((chunk, i) => (
                <StoryProse key={i} text={chunk.trim()} />
              ))}
            </div>
            {deepSource && <p className="readable-muted text-[0.9rem] mt-4">{deepSource}</p>}
            {extra && <div className="detail-extra motion-fade-in">{extra}</div>}
          </article>
        </div>
      )}
    </>
  );
};
