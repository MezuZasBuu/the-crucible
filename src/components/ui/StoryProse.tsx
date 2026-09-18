/**
 * Story-first prose — poetic lines illuminated, questions lifted.
 */

import React from 'react';

/** Wrap *asterisk emphasis* and ?questions? in styled spans. */
export function enrichStoryText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*[^*]+\*|\?[^?]+\?)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <span key={i} className="story-poetic">
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith('?') && part.endsWith('?')) {
      return (
        <span key={i} className="story-question">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export const StoryProse: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <p className={`story-prose ${className}`}>{enrichStoryText(text)}</p>
);
