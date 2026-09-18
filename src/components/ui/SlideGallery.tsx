/**
 * Pattern-style sliding card gallery with dot indicators and auto-advance.
 */

import React, { useEffect, useRef } from 'react';
import { SlideCard, SlidePanel } from './SlideCard';

interface SlideGalleryProps {
  index: number;
  onIndexChange: (index: number) => void;
  panelCount: number;
  labels?: string[];
  autoAdvanceMs?: number;
  className?: string;
  children: React.ReactNode;
}

export const SlideGallery: React.FC<SlideGalleryProps> = ({
  index,
  onIndexChange,
  panelCount,
  labels,
  autoAdvanceMs = 4000,
  className = '',
  children
}) => {
  const paused = useRef(false);

  useEffect(() => {
    if (panelCount <= 1 || autoAdvanceMs <= 0) return;
    const timer = window.setInterval(() => {
      if (paused.current) return;
      onIndexChange((index + 1) % panelCount);
    }, autoAdvanceMs);
    return () => window.clearInterval(timer);
  }, [index, panelCount, autoAdvanceMs, onIndexChange]);

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
      <SlideCard index={index} className="pattern-featured-card">
        {children}
      </SlideCard>
      <div className="gallery-dots" role="tablist" aria-label="Slide panels">
        {Array.from({ length: panelCount }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={labels?.[i] || `Panel ${i + 1}`}
            className={`gallery-dot ${i === index ? 'gallery-dot-active' : ''}`}
            onClick={() => onIndexChange(i)}
          />
        ))}
      </div>
      {labels?.[index] && <p className="gallery-caption readable-muted">{labels[index]}</p>}
    </div>
  );
};

export { SlidePanel };
