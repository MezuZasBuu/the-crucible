/**
 * Staggered word fade-in — readable dark text on light surfaces.
 */

import React from 'react';

interface FadeInTextProps {
  text: string;
  className?: string;
  delayMs?: number;
  as?: 'p' | 'span' | 'h2' | 'h3';
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  className = '',
  delayMs = 0,
  as: Tag = 'p'
}) => {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={`readable-text ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="fade-word"
          style={{ animationDelay: `${delayMs + index * 45}ms` }}
        >
          {word}{' '}
        </span>
      ))}
    </Tag>
  );
};
