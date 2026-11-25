/**
 * "How this works" — a plain-language guide to the app and every tradition in it.
 */

import React, { useEffect } from 'react';
import { CalendarRange, Compass, Sparkles, UserRound, X } from 'lucide-react';
import { CULTURES, CultureEmblem, CultureId } from '../symbols/CultureSymbols';

const ORDER: CultureId[] = [
  'western',
  'maya',
  'chinese',
  'vedic',
  'numerology',
  'egyptian',
  'ethiopian',
  'greek',
  'roman',
  'hebrew',
  'dreamspell',
  'gene_keys',
  'callings',
  'map'
];

export const GuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="guide-overlay" role="dialog" aria-modal="true" aria-labelledby="guide-title" onClick={onClose}>
      <div className="guide-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="guide-head">
          <div>
            <p className="ui-eyebrow">Guide</p>
            <h2 id="guide-title" className="guide-title">How The Crucible works</h2>
          </div>
          <button type="button" className="guide-close" onClick={onClose} aria-label="Close guide">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="guide-body">
          <p className="guide-lead">
            People in many cultures have kept time by watching the sky. The Crucible works out what each of those
            calendars says about a single day, shows you the results side by side, and writes a short reading in
            everyday language.
          </p>

          <h3 className="guide-h">The four sections</h3>
          <div className="guide-sections">
            <div className="guide-section">
              <Sparkles className="w-5 h-5" />
              <div>
                <strong>Today</strong>
                <p>The reading for the day you have chosen — mood, people, work, money, travel.</p>
              </div>
            </div>
            <div className="guide-section">
              <UserRound className="w-5 h-5" />
              <div>
                <strong>My chart</strong>
                <p>Enter your birth date and place to see your birth chart and how today compares to it.</p>
              </div>
            </div>
            <div className="guide-section">
              <CalendarRange className="w-5 h-5" />
              <div>
                <strong>Next 14 days</strong>
                <p>A day-by-day outlook, so you can see which days stand out.</p>
              </div>
            </div>
            <div className="guide-section">
              <Compass className="w-5 h-5" />
              <div>
                <strong>Traditions</strong>
                <p>The detail behind the reading: every calendar, the world map, and a place to ask questions.</p>
              </div>
            </div>
          </div>

          <h3 className="guide-h">The traditions and their symbols</h3>
          <ul className="guide-cultures">
            {ORDER.map((id) => {
              const c = CULTURES[id];
              return (
                <li key={id} className="guide-culture">
                  <CultureEmblem culture={id} size={46} />
                  <div>
                    <p className="guide-culture-name">
                      {c.name} <span>{c.origin}</span>
                    </p>
                    <p className="guide-culture-plain">{c.plain}</p>
                    <p className="guide-culture-tells">
                      <strong>What it adds:</strong> {c.tellsYou}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <h3 className="guide-h">Good to know</h3>
          <ul className="guide-notes">
            <li>
              <strong>The astronomy is real; the meanings are traditional.</strong> Planet positions and calendar dates
              are calculated precisely. What they “mean” comes from each tradition and is offered for reflection, not as
              fact or prediction.
            </li>
            <li>
              <strong>Traditions sometimes disagree.</strong> When they do, the app shows both views rather than
              averaging them.
            </li>
            <li>
              <strong>Your details stay on this device</strong> unless you choose to sign in.
            </li>
            <li>This is not medical, legal or financial advice.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
