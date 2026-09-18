/**
 * Pattern-style sliding card gallery — 6s auto-advance, dot indicators, web arrows.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlideCard, SlidePanel } from './SlideCard';

interface SlideGalleryProps {
  index: number;
  onIndexChange: (index: number) => void;
  panelCount: number;
  labels?: string[];
  autoAdvanceMs?: number;
  showArrows?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const SlideGallery: React.FC<SlideGalleryProps> = ({
  index,
  onIndexChange,
  panelCount,
  labels,
  autoAdvanceMs = 6000,
  showArrows = true,
  className = '',
  children
}) => {
  const paused = useRef(false);
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, panelCount - 1));

  const goPrev = useCallback(() => {
    onIndexChange((safeIndex - 1 + panelCount) % panelCount);
  }, [onIndexChange, panelCount, safeIndex]);

  const goNext = useCallback(() => {
    onIndexChange((safeIndex + 1) % panelCount);
  }, [onIndexChange, panelCount, safeIndex]);

  useEffect(() => {
    if (panelCount <= 1 || autoAdvanceMs <= 0) return;
    const timer = window.setInterval(() => {
      if (paused.current) return;
      onIndexChange((safeIndex + 1) % panelCount);
    }, autoAdvanceMs);
    return () => window.clearInterval(timer);
  }, [safeIndex, panelCount, autoAdvanceMs, onIndexChange]);

  return (
    <div
      className={`gallery-shell ${className}`}
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onFocus={() => {
        paused.current = true;
      }}
      onBlur={() => {
        paused.current = false;
      }}
    >
      <div className="gallery-track-wrap">
        {showArrows && panelCount > 1 && (
          <button
            type="button"
            className="gallery-nav gallery-nav-prev"
            aria-label="Previous panel"
            onClick={goPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <SlideCard index={safeIndex} className="pattern-featured-card">
          {children}
        </SlideCard>
        {showArrows && panelCount > 1 && (
          <button
            type="button"
            className="gallery-nav gallery-nav-next"
            aria-label="Next panel"
            onClick={goNext}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="gallery-dots" role="tablist" aria-label="Slide panels">
        {Array.from({ length: panelCount }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === safeIndex}
            aria-label={labels?.[i] || `Panel ${i + 1}`}
            className={`gallery-dot ${i === safeIndex ? 'gallery-dot-active' : ''}`}
            onClick={() => onIndexChange(i)}
          />
        ))}
      </div>
      {labels?.[safeIndex] && (
        <p className="gallery-caption readable-muted">{labels[safeIndex]}</p>
      )}
    </div>
  );
};

export { SlidePanel };
