/**
 * Horizontal slide viewport for overview panels.
 */

import React from 'react';

interface SlideCardProps {
  index: number;
  children: React.ReactNode;
  className?: string;
}

export const SlideCard: React.FC<SlideCardProps> = ({ index, children, className = '' }) => (
  <div className={`slide-card-viewport ${className}`}>
    <div className="slide-card-track" style={{ transform: `translateX(-${index * 100}%)` }}>
      {children}
    </div>
  </div>
);

export const SlidePanel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => <div className={`slide-card-panel ${className}`}>{children}</div>;
