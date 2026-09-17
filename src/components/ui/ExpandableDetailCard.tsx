/**
 * Tap-to-expand card with a full-screen detail sheet and magic fade-in copy.
 */

import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';
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
}

export const ExpandableDetailCard: React.FC<ExpandableDetailCardProps> = ({
  label,
  preview,
  title,
  body,
  extra,
  accent = 'slate',
  className = ''
}) => {
  const [open, setOpen] = React.useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`scroll-card gradient-card-base text-left w-full transition-transform hover:-translate-y-0.5 ${ACCENT[accent]} ${className}`}
      >
        <p className="scroll-label readable-muted">{label}</p>
        <div className="readable-body text-[1.05rem]">{preview}</div>
        <p className="readable-muted text-[0.95rem] mt-3">Tap for full reading</p>
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
            <FadeInText text={body} className="detail-body" delayMs={220} />
            {extra && <div className="detail-extra motion-fade-in">{extra}</div>}
          </article>
        </div>
      )}
    </>
  );
};
