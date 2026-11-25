/**
 * The Crucible — "Seasons & hours" panel
 * The 364-day calendar from the Book of Enoch, the season's scripture verses,
 * the planet that names today and this hour, and the optional flipped-map view.
 */

import React, { useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { FlipHorizontal2 } from 'lucide-react';
import { PlanetGlyph } from './symbols/AstroGlyph';
import { CultureHeader } from './symbols/CultureSymbols';

interface EnochianBiblicalPanelProps {
  ctx: CompleteCalculationContext;
  onEnableMapFlip?: (enabled: boolean) => void;
  mapFlipEnabled?: boolean;
}

/** Plain one-line reading for each of the seven classical planets. */
const PLANET_PLAIN: Record<string, { theme: string; goodFor: string }> = {
  Sun: { theme: 'confidence and being seen', goodFor: 'leading, presenting, making a clear decision' },
  Moon: { theme: 'feelings, home and rest', goodFor: 'reflecting, caring for people, quiet tasks' },
  Mars: { theme: 'energy and courage', goodFor: 'physical effort, hard conversations, getting started' },
  Mercury: { theme: 'thinking and talking', goodFor: 'writing, messages, learning, short trips' },
  Jupiter: { theme: 'growth and generosity', goodFor: 'teaching, planning big, asking for help' },
  Venus: { theme: 'affection and beauty', goodFor: 'time with people you like, making things, making peace' },
  Saturn: { theme: 'structure and patience', goodFor: 'tidying up, finishing, slow careful work' }
};

const planetId = (name: string) => name.trim().toLowerCase();
const planetTheme = (name: string) => PLANET_PLAIN[name]?.theme ?? 'its own traditional theme';
const planetGoodFor = (name: string, fallback: string) => PLANET_PLAIN[name]?.goodFor ?? fallback;

/** "Winter (…)" or "Winter — …" → "Winter" */
const firstWord = (s: string) => s.split(/[\s(—–-]/)[0] || s;
/** "North Gate of Stillness (1 Enoch 72)" → "North Gate of Stillness" */
const stripBrackets = (s: string) => s.replace(/\s*\(.*?\)\s*/g, ' ').trim();

export const EnochianBiblicalPanel: React.FC<EnochianBiblicalPanelProps> = ({
  ctx,
  onEnableMapFlip,
  mapFlipEnabled = false
}) => {
  const eb = ctx.enochianBiblical;
  const [peekMode, setPeekMode] = useState<'A' | 'B' | 'COMPARE'>('COMPARE');
  const [showHourMatrix, setShowHourMatrix] = useState(false);
  const [showHalfHours, setShowHalfHours] = useState(false);

  const season = firstWord(eb.enochian.seasonName);
  const gate = stripBrackets(eb.enochian.watchGate);
  const today = eb.gregorianWeekdayDeity;
  const julian = eb.julianWeekdayDeity;
  const hour = eb.currentPlanetaryHour;
  const jd = ctx.temporal.julianCalendarDate;
  const isFirstHalf = eb.currentHalfHour.startHourLocal === hour.startHourLocal;
  const halfLabel = (h: { startHourLocal: number; hourIndex: number }) => {
    const parent = eb.planetaryHours.find((p) => p.index === h.hourIndex);
    return parent && h.startHourLocal === parent.startHourLocal ? 'First half' : 'Second half';
  };
  const halfPlain = (label: string) =>
    label === 'First half'
      ? 'The planet’s theme is freshest: a good moment to begin.'
      : 'The theme is settling: a good moment to adjust or finish.';

  return (
    <div className="space-y-5 motion-enter text-[color:var(--text-secondary)]">
      {/* (a) The 364-day calendar */}
      <section className="instrument-panel">
        <CultureHeader culture="hebrew" title="The 364-day calendar" explain={false} />
        <div className="trad-hero mt-3">
          <span className="trad-hero-symbol" aria-hidden="true">
            {eb.enochian.dayOfMonth}
          </span>
          <div>
            <p className="trad-hero-value">
              Month {eb.enochian.monthIndex}, day {eb.enochian.dayOfMonth}
            </p>
            <p className="trad-hero-sub">
              {eb.enochian.monthName} · {season}
            </p>
          </div>
        </div>
        <p className="trad-meaning mt-3">
          <strong>In plain words:</strong> The Book of Enoch, an ancient Jewish text, describes a year of exactly 364
          days: four seasons of 91 days, each made of three 30-day months plus one extra day. Because 364 divides evenly
          into 52 weeks, every date falls on the same weekday every year. Each season is pictured as a “gate” in the sky
          that the sun passes through.
        </p>
        <dl className="trad-facts mt-3">
          <dt>Season</dt>
          <dd>{season}</dd>
          <dt>Season’s gate</dt>
          <dd>{gate}</dd>
          <dt>Week of the year</dt>
          <dd>
            {eb.enochian.weekOfYear} of 52
          </dd>
          <dt>Day of the year</dt>
          <dd>
            {eb.enochian.dayOfYear} of 364
          </dd>
          <dt>Extra day?</dt>
          <dd>
            {eb.enochian.isIntercalaryDay
              ? 'Yes. Today is the extra day that closes the season.'
              : 'No, an ordinary day.'}
          </dd>
        </dl>
        <p className="readable-muted text-xs mt-3">
          The season shown follows the sun’s actual position, so it can differ slightly from the month count.
        </p>
      </section>

      {/* (b) This season in scripture */}
      <section className="instrument-panel">
        <h3 className="panel-title">This season in scripture</h3>
        <p className="readable-body mt-1">
          Bible verses traditionally read with {season.toLowerCase()}, offered for reflection.
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {eb.biblicalSeason.verses.map((v) => (
            <figure key={v.ref} className="curious-box m-0">
              <blockquote className="readable-body m-0">“{v.text}”</blockquote>
              <figcaption className="text-xs font-semibold mt-2 text-[color:var(--temporal-deep)]">{v.ref}</figcaption>
            </figure>
          ))}
        </div>
        <dl className="trad-facts mt-3">
          <dt>On the land</dt>
          <dd>{eb.biblicalSeason.agriculturalPhase}</dd>
          <dt>Festival of this season</dt>
          <dd>{eb.biblicalSeason.liturgicalEcho}</dd>
        </dl>
      </section>

      {/* (c) Today's planet and this hour's planet */}
      <section className="instrument-panel">
        <CultureHeader culture="roman" title="Today’s planet and this hour’s planet" explain={false} />
        <p className="readable-body mt-2">
          The seven days of the week are named after the sun, the moon and the five planets you can see without a
          telescope. The same seven also take turns naming each hour.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div className="curious-box">
            <p className="ui-eyebrow">Today’s planet</p>
            <div className="trad-hero mt-2">
              <span className="trad-hero-symbol">
                <PlanetGlyph planet={planetId(today.planetaryRuler)} size={30} tinted />
              </span>
              <div>
                <p className="trad-hero-value">{today.planetaryRuler}</p>
                <p className="trad-hero-sub">
                  {today.gregorianName} is the {today.planetaryRuler}’s day
                </p>
              </div>
            </div>
            <p className="readable-body mt-2">
              Traditionally a day for {planetTheme(today.planetaryRuler)}. Good for:{' '}
              {planetGoodFor(today.planetaryRuler, today.energy)}.
            </p>
            <p className="readable-muted text-xs mt-2">
              Roman name: {today.latinDies}, after {today.romanDeity}. Traditional colour: {today.colorRay}.
            </p>
          </div>

          <div className="curious-box">
            <p className="ui-eyebrow">This hour’s planet</p>
            <div className="trad-hero mt-2">
              <span className="trad-hero-symbol">
                <PlanetGlyph planet={planetId(hour.planet)} size={30} tinted />
              </span>
              <div>
                <p className="trad-hero-value">{hour.planet}</p>
                <p className="trad-hero-sub">
                  {hour.formattedWindow} · {hour.isDayHour ? 'daytime' : 'night'} hour {hour.isDayHour ? hour.index : hour.index - 12} of 12
                </p>
              </div>
            </div>
            <p className="readable-body mt-2">
              Traditionally an hour for {planetTheme(hour.planet)}. Good for: {planetGoodFor(hour.planet, hour.counsel)}.
            </p>
            <p className="readable-muted text-xs mt-2">
              You are in the {isFirstHalf ? 'first' : 'second'} half of this hour ({eb.currentHalfHour.formattedWindow}).{' '}
              {halfPlain(isFirstHalf ? 'First half' : 'Second half')}
            </p>
          </div>
        </div>

        <p className="trad-meaning mt-3">
          <strong>In plain words:</strong> Planetary hours are not clock hours. The time from sunrise to sunset is
          divided into 12 equal parts, and the night into another 12, so the “hours” are longer in summer daylight and
          shorter in winter. The first hour after sunrise belongs to the day’s own planet; the rest follow in a fixed
          order. Sunrise here is estimated from your place and date.
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={() => setShowHourMatrix((p) => !p)}
            className="cta-ghost"
            aria-expanded={showHourMatrix}
          >
            {showHourMatrix ? 'Hide the 24 hours' : 'Show all 24 hours'}
          </button>
          <button
            type="button"
            onClick={() => setShowHalfHours((p) => !p)}
            className="cta-ghost"
            aria-expanded={showHalfHours}
          >
            {showHalfHours ? 'Hide the half-hours' : 'Show the half-hours'}
          </button>
        </div>

        {showHourMatrix && (
          <div className="mt-4">
            <p className="ui-eyebrow mb-2">All 24 planetary hours for this day</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {eb.planetaryHours.map((h) => {
                const isNow = h.index === hour.index;
                return (
                  <div
                    key={h.index}
                    className={`rounded-[var(--radius-sm)] border p-2 text-xs ${
                      isNow
                        ? 'border-[color:var(--temporal-deep)] bg-[color:var(--surface-well)]'
                        : 'border-[color:var(--line-soft)]'
                    }`}
                  >
                    <p className="text-[color:var(--text-muted)]">
                      {h.isDayHour ? 'Day' : 'Night'} {h.isDayHour ? h.index : h.index - 12}
                      {isNow ? ' · now' : ''}
                    </p>
                    <p className="flex items-center gap-1.5 font-semibold text-[color:var(--text-primary)] text-sm">
                      <PlanetGlyph planet={planetId(h.planet)} size={16} tinted />
                      {h.planet}
                    </p>
                    <p className="text-[color:var(--text-secondary)]">{h.formattedWindow}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showHalfHours && (
          <div className="mt-4">
            <p className="ui-eyebrow mb-1">Each hour in two halves</p>
            <p className="field-help mb-2">
              Some traditions split each planetary hour in two: the first half for starting, the second for adjusting
              or finishing.
            </p>
            <div className="max-h-64 overflow-y-auto rounded-[var(--radius-sm)] border border-[color:var(--line-soft)]">
              {eb.halfHourMeanings.map((h, i) => {
                const label = halfLabel(h);
                const isNow = h.formattedWindow === eb.currentHalfHour.formattedWindow;
                return (
                  <div
                    key={i}
                    className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 border-b border-[color:var(--line-soft)] px-3 py-2 text-xs ${
                      isNow ? 'bg-[color:var(--surface-well)] font-semibold' : ''
                    }`}
                  >
                    <span className="w-32 text-[color:var(--text-primary)]">{h.formattedWindow}</span>
                    <span className="w-24 flex items-center gap-1.5 text-[color:var(--text-primary)]">
                      <PlanetGlyph planet={planetId(h.planet)} size={14} tinted />
                      {h.planet}
                    </span>
                    <span className="flex-1 min-w-[10rem] text-[color:var(--text-secondary)]">
                      {label}
                      {isNow ? ' · now' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* (d) Julian-calendar weekday */}
        <p className="chart-note mt-4">
          On the old Julian calendar today is {julian.gregorianName}, {jd.day}/{jd.month}/{jd.year} (day/month/year).
          The Julian calendar was used across Europe before the modern one and runs some days behind it (13 days in this century). Its
          weekday planet is {julian.planetaryRuler}.
        </p>
      </section>

      {/* (e) Flipped map */}
      <section className="instrument-panel">
        <h3 className="panel-title">A south-facing view of the world</h3>
        <p className="readable-body mt-1">
          Modern maps put north at the top. The Book of Enoch describes the sky from a south-facing viewpoint, the way
          you see it when you stand and watch the sun cross the sky. This optional view turns the world map upside-down
          and mirrors it, so it matches that viewpoint. Nothing else in the app changes.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-center">
          {(['North', 'East', 'South', 'West'] as const).map((d) => (
            <div key={d} className="curious-box">
              <p className="readable-muted text-xs">{d} on a modern map</p>
              <p className="text-sm font-semibold text-[color:var(--text-primary)] mt-0.5">
                becomes {eb.compassOrientation.directionRemap[d]}
              </p>
            </div>
          ))}
        </div>
        {onEnableMapFlip && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => onEnableMapFlip(!mapFlipEnabled)}
              className="cta-primary"
              aria-pressed={mapFlipEnabled}
            >
              <FlipHorizontal2 className="w-4 h-4" />
              {mapFlipEnabled ? 'Turn off flipped map' : 'Flip the world map to this view'}
            </button>
            <p className="field-help mt-1.5">
              {mapFlipEnabled
                ? 'The world map under Traditions is currently flipped.'
                : 'Turning this on opens the world map under Traditions.'}
            </p>
          </div>
        )}
      </section>

      {/* Two ways to read today */}
      <section className="instrument-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="panel-title">Two ways to read today</h3>
          <div className="seg" role="group" aria-label="Choose which view to show">
            {(
              [
                { id: 'A' as const, label: 'Modern calendar view' },
                { id: 'B' as const, label: 'Ancient season view' },
                { id: 'COMPARE' as const, label: 'Side by side' }
              ]
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPeekMode(m.id)}
                aria-pressed={peekMode === m.id}
                className={`seg-btn ${peekMode === m.id ? 'seg-btn-active' : ''}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid gap-3 mt-3 ${peekMode === 'COMPARE' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {(peekMode === 'A' || peekMode === 'COMPARE') && (
            <div className="curious-box">
              <p className="ui-eyebrow">Modern calendar view</p>
              <p className="readable-body mt-1">The everyday calendar and clock most of the world shares.</p>
              <dl className="trad-facts mt-2">
                <dt>Weekday</dt>
                <dd>
                  {today.gregorianName} (the {today.planetaryRuler}’s day)
                </dd>
                <dt>Day’s theme</dt>
                <dd>{planetTheme(today.planetaryRuler)}</dd>
                <dt>This hour</dt>
                <dd>
                  {hour.planet}, {hour.formattedWindow}
                </dd>
                <dt>Map</dt>
                <dd>North at the top</dd>
              </dl>
            </div>
          )}

          {(peekMode === 'B' || peekMode === 'COMPARE') && (
            <div className="curious-box">
              <p className="ui-eyebrow">Ancient season view</p>
              <p className="readable-body mt-1">The 364-day calendar and the seasons as scripture describes them.</p>
              <dl className="trad-facts mt-2">
                <dt>Date</dt>
                <dd>
                  Month {eb.enochian.monthIndex}, day {eb.enochian.dayOfMonth} ({eb.enochian.monthName})
                </dd>
                <dt>Season</dt>
                <dd>
                  {season}, {gate}
                </dd>
                <dt>Verses</dt>
                <dd>{eb.biblicalSeason.verses.map((v) => v.ref).join('; ')}</dd>
                <dt>Old-calendar weekday</dt>
                <dd>
                  {julian.gregorianName} (the {julian.planetaryRuler}’s day)
                </dd>
                <dt>Map</dt>
                <dd>{eb.compassOrientation.enochianPrimary} at the top, east and west swapped</dd>
              </dl>
            </div>
          )}
        </div>

        {peekMode === 'COMPARE' && (
          <p className="trad-meaning mt-3">
            <strong>How to hold both:</strong> Use the modern view for appointments and everyday plans, and the ancient
            view for reflection on the season. Where the two disagree, neither is wrong; they are counting time in
            different ways.
          </p>
        )}
      </section>

      {/* Technical summary */}
      <details className="instrument-panel curious">
        <summary className="cursor-pointer font-semibold text-[color:var(--text-primary)]">Technical summary</summary>
        <p className="readable-muted text-xs mt-3">
          The app’s raw working notes for this page, using the traditions’ own terms. Source for the 364-day calendar:{' '}
          {eb.enochian.sourceAuthority}.
        </p>
        <pre className="whitespace-pre-wrap text-xs leading-relaxed mt-2 text-[color:var(--text-secondary)]">
          {eb.triangulationDossier}
        </pre>
        <ul className="curious-list mt-2 text-xs">
          <li>{eb.enochian.formatted}</li>
          <li>{eb.biblicalTransits.narrative}</li>
          <li>{eb.compassOrientation.connotation}</li>
          {eb.compassOrientation.triangulationNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
          <li>
            {eb.abPeek.pathA.title}: {eb.abPeek.pathA.summary}
          </li>
          <li>
            {eb.abPeek.pathB.title}: {eb.abPeek.pathB.summary}
          </li>
          <li>{eb.abPeek.synthesis.summary}</li>
        </ul>
      </details>
    </div>
  );
};
