/**
 * Pattern / Co-Star inspired scroll card — label, value, optional accent stripe
 */

import React from 'react';

type Accent = 'terracotta' | 'sage' | 'slate' | 'indigo' | 'ochre' | 'rose';

const ACCENT: Record<Accent, string> = {
  terracotta: 'scroll-accent-terracotta',
  sage: 'scroll-accent-sage',
  slate: 'scroll-accent-slate',
  indigo: 'scroll-accent-indigo',
  ochre: 'scroll-accent-ochre',
  rose: 'scroll-accent-rose'
};

interface ScrollCardProps {
  label: string;
  children: React.ReactNode;
  accent?: Accent;
  className?: string;
}

export const ScrollCard: React.FC<ScrollCardProps> = ({ label, children, accent = 'slate', className = '' }) => (
  <div className={`scroll-card ${ACCENT[accent]} ${className}`}>
    <p className="scroll-label">{label}</p>
    <div className="scroll-body">{children}</div>
  </div>
);

interface ScrollMetricProps {
  label: string;
  value: string;
  sub?: string;
  accent?: Accent;
}

export const ScrollMetric: React.FC<ScrollMetricProps> = ({ label, value, sub, accent = 'ochre' }) => (
  <div className={`scroll-metric ${ACCENT[accent]}`}>
    <p className="scroll-label">{label}</p>
    <p className="scroll-metric-value">{value}</p>
    {sub && <p className="scroll-metric-sub">{sub}</p>}
  </div>
);

interface ScrollProseProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollProse: React.FC<ScrollProseProps> = ({ children, className = '' }) => (
  <div className={`scroll-prose ${className}`}>{children}</div>
);
