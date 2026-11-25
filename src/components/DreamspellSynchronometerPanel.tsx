/**
 * The Crucible — Dreamspell day details.
 * Today's signature (symbol + number tone), the five-part pattern,
 * the 28-day month, the 13-day cycle and the 52-day season.
 */

import React, { useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { MayaNumeral } from './symbols/CultureSymbols';

interface DreamspellSynchronometerPanelProps {
  ctx: CompleteCalculationContext;
}

const COLOUR_INK: Record<string, string> = {
  Red: '#b3261e',
  White: '#6b6b76',
  Blue: '#1f5fa8',
  Yellow: '#9a6700'
};

/** One-line plain meaning for each of the four colours. */
const COLOUR_GLOSS: Record<string, string> = {
  Red: 'Red days are about starting things.',
  White: 'White days are about refining and clearing away.',
  Blue: 'Blue days are about change.',
  Yellow: 'Yellow days are about ripening and sharing results.'
};

/** One-line plain meaning for each Earth family. */
const EARTH_FAMILY_GLOSS: Record<string, string> = {
  Polar: 'said to take in new ideas',
  Cardinal: 'said to get things started',
  Core: 'said to work from the heart of things',
  Signal: 'said to sense what is coming',
  Gateway: 'said to open new doors'
};

const SEASONS = [
  { name: 'Red season', theme: 'Beginning', range: '1–52', color: '#b3261e', plain: 'A time for starting out and finding direction.' },
  { name: 'White season', theme: 'Refining', range: '53–104', color: '#6b6b76', plain: 'A time for letting go of what is no longer needed.' },
  { name: 'Blue season', theme: 'Changing', range: '105–156', color: '#1f5fa8', plain: 'A time of change, when effort reshapes things.' },
  { name: 'Yellow season', theme: 'Giving', range: '157–208', color: '#9a6700', plain: 'A time for sharing what has been learned.' },
  { name: 'Green season', theme: 'Bringing together', range: '209–260', color: '#2f7d5b', plain: 'A time for bringing everything together and celebrating.' }
] as const;

const WEEKDAYS = ['Dali', 'Seli', 'Gamma', 'Kali', 'Alfa', 'Limi', 'Silio'];

type TabId = 'ORACLE' | 'THIRTEEN_MOON' | 'WAVESPELL' | 'CASTLE';

const TABS: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: 'ORACLE', label: 'Five-part pattern' },
  { id: 'THIRTEEN_MOON', label: 'Month and week' },
  { id: 'WAVESPELL', label: '13-day cycle' },
  { id: 'CASTLE', label: '52-day season' }
];

const PatternCell: React.FC<{
  role: string;
  gloss: string;
  name: string;
  kin: number;
  tone: number;
  main?: boolean;
}> = ({ role, gloss, name, kin, tone, main }) => (
  <div
    className={`curious-box !p-3 flex flex-col items-center text-center gap-0.5 ${
      main ? '!border-[color:var(--solar-deep)] !border-2' : ''
    }`}
  >
    <span className="text-xs font-semibold text-[color:var(--text-muted)]">{role}</span>
    <span className="text-sm font-semibold text-[color:var(--text-primary)] leading-tight">{name}</span>
    <span className="flex items-center gap-1.5 text-xs text-[color:var(--text-secondary)]">
      <MayaNumeral value={tone} size={18} title={`Number tone ${tone}`} />
      <span>kin {kin}</span>
    </span>
    <span className="text-xs text-[color:var(--text-muted)]">{gloss}</span>
  </div>
);

export const DreamspellSynchronometerPanel: React.FC<DreamspellSynchronometerPanelProps> = ({ ctx }) => {
  const [activeTab, setActiveTab] = useState<TabId>('ORACLE');
  const ds = ctx.dreamspell;

  const colourInk = COLOUR_INK[ds.solarSeal.color] ?? 'var(--text-primary)';
  const seasonIndex = ds.kin <= 52 ? 0 : ds.kin <= 104 ? 1 : ds.kin <= 156 ? 2 : ds.kin <= 208 ? 3 : 4;
  const season = SEASONS[seasonIndex];
  const monthPercent = Math.round((ds.thirteenMoon.dayOfMoon / 28) * 100);

  return (
    <div className="instrument-panel motion-enter space-y-5">
      {/* Today's signature */}
      <div>
        <p className="ui-eyebrow">Today’s signature</p>
        <div className="trad-hero mt-2">
          <span className="trad-hero-symbol" style={{ color: colourInk }}>
            <MayaNumeral value={ds.galacticTone.number} size={30} title={`Number tone ${ds.galacticTone.number}`} />
          </span>
          <div className="min-w-0">
            <p className="trad-hero-value">{ds.signature}</p>
            <p className="trad-hero-sub">
              Day number (kin) {ds.kin} of 260 · symbol: {ds.solarSeal.name} · number tone (1–13): {ds.galacticTone.number},{' '}
              {ds.galacticTone.name}
            </p>
          </div>
        </div>
        <p className="trad-meaning mt-3">
          <strong>In plain words:</strong> every Dreamspell day pairs one of 20 symbols with a number tone from 1 to 13.
          Today’s symbol, {ds.solarSeal.name}, is linked with {ds.solarSeal.essence.toLowerCase()} and{' '}
          {ds.solarSeal.power.toLowerCase()}; today’s tone, {ds.galacticTone.name}, is linked with{' '}
          {ds.galacticTone.power.toLowerCase()}. These are themes to reflect on, not predictions.
        </p>
      </div>

      {/* Tabs */}
      <div className="explore-tabs" role="tablist" aria-label="Dreamspell details">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`explore-tab ${activeTab === tab.id ? 'explore-tab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: five-part pattern */}
      {activeTab === 'ORACLE' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7">
            <p className="ui-eyebrow mb-2">Today’s five-part pattern</p>
            <div className="grid grid-cols-3 gap-2 w-full max-w-[460px] mx-auto">
              <div />
              <PatternCell role="Guide" gloss="Points the way" name={ds.oracle.guide.name} kin={ds.oracle.guide.kin} tone={ds.oracle.guide.tone} />
              <div />

              <PatternCell role="Challenge" gloss="Tests and strengthens" name={ds.oracle.antipode.name} kin={ds.oracle.antipode.kin} tone={ds.oracle.antipode.tone} />
              <PatternCell main role="Main symbol" gloss="Today itself" name={ds.oracle.destiny.name} kin={ds.oracle.destiny.kin} tone={ds.oracle.destiny.tone} />
              <PatternCell role="Supporting partner" gloss="Works alongside" name={ds.oracle.analog.name} kin={ds.oracle.analog.kin} tone={ds.oracle.analog.tone} />

              <div />
              <PatternCell role="Hidden strength" gloss="Helps from behind the scenes" name={ds.oracle.occult.name} kin={ds.oracle.occult.kin} tone={ds.oracle.occult.tone} />
              <div />
            </div>
          </div>

          <div className="md:col-span-5 space-y-3">
            <p className="readable-body">
              Dreamspell surrounds each day’s main symbol with four others: a guide, a supporting partner, a challenge
              and a hidden strength. The bars and dots show each one’s number tone.
            </p>
            <dl className="trad-facts">
              <dt>Symbol’s theme</dt>
              <dd>{ds.solarSeal.essence}</dd>
              <dt>What it does</dt>
              <dd>
                {ds.solarSeal.action} through {ds.solarSeal.power.toLowerCase()}
              </dd>
              <dt>Body centre (chakra)</dt>
              <dd>{ds.solarSeal.chakra}</dd>
              <dt>Tone’s theme</dt>
              <dd>
                {ds.galacticTone.action} · {ds.galacticTone.power}
              </dd>
            </dl>
          </div>
        </div>
      )}

      {/* Tab 2: month and week */}
      {activeTab === 'THIRTEEN_MOON' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="curious-box space-y-3">
            <div>
              <p className="ui-eyebrow">This month</p>
              <h4 className="panel-title mt-1">
                Month {ds.thirteenMoon.moonNumber} of 13: {ds.thirteenMoon.moonName}
              </h4>
            </div>
            <dl className="trad-facts">
              <dt>Day</dt>
              <dd>{ds.thirteenMoon.dayOfMoon} of 28</dd>
              <dt>Week</dt>
              <dd>{ds.thirteenMoon.weekNumber} of 4</dd>
              <dt>Month’s animal</dt>
              <dd>{ds.thirteenMoon.animalTotem}</dd>
              <dt>Question for the month</dt>
              <dd>“{ds.thirteenMoon.serviceQuestion}”</dd>
            </dl>
            {ds.thirteenMoon.isDayOutOfTime && (
              <p className="chart-note">
                Today is the “Day Out of Time” (25 July): the one extra day that sits outside the 13 months, kept as a
                day of rest and celebration.
              </p>
            )}
            <div>
              <div className="flex justify-between text-xs text-[color:var(--text-muted)] mb-1">
                <span>How far through the month</span>
                <span>{monthPercent}%</span>
              </div>
              <div className="score-track">
                <div className="score-fill" style={{ width: `${monthPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="curious-box space-y-3">
            <div>
              <p className="ui-eyebrow">Day of the week</p>
              <h4 className="panel-title mt-1">{ds.thirteenMoon.radialPlasma.name}</h4>
              <p className="readable-muted text-sm mt-1">
                Dreamspell gives its seven weekdays their own names. Each is linked with a body centre (chakra).
              </p>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {WEEKDAYS.map((weekday) => {
                const isToday = ds.thirteenMoon.radialPlasma.name === weekday;
                return (
                  <div
                    key={weekday}
                    className={`py-1.5 rounded-md border ${
                      isToday
                        ? 'border-[color:var(--temporal-deep)] text-[color:var(--temporal-deep)] font-semibold bg-white'
                        : 'border-[color:var(--line-soft)] text-[color:var(--text-muted)]'
                    }`}
                  >
                    {weekday}
                  </div>
                );
              })}
            </div>
            <dl className="trad-facts">
              <dt>Body centre (chakra)</dt>
              <dd>{ds.thirteenMoon.radialPlasma.chakra}</dd>
              <dt>Theme</dt>
              <dd>{ds.thirteenMoon.radialPlasma.quantumFunction}</dd>
            </dl>
            <details>
              <summary className="text-sm cursor-pointer text-[color:var(--text-secondary)]">Traditional phrase for this weekday</summary>
              <p className="readable-muted text-sm mt-2">“{ds.thirteenMoon.radialPlasma.mantra}”</p>
            </details>
          </div>
        </div>
      )}

      {/* Tab 3: 13-day cycle and families */}
      {activeTab === 'WAVESPELL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="curious-box space-y-3">
            <div>
              <p className="ui-eyebrow">13-day cycle (wavespell)</p>
              <h4 className="panel-title mt-1">{ds.wavespell.name}</h4>
            </div>
            <p className="readable-body">
              The 260 days are divided into 20 cycles of 13 days. Each wavespell is named after the symbol of its first
              day, which sets the theme for all 13.
            </p>
            <div className="flex items-center gap-3">
              <MayaNumeral value={ds.wavespell.positionInWavespell} size={30} title={`Day ${ds.wavespell.positionInWavespell}`} />
              <p className="text-sm text-[color:var(--text-primary)] font-medium">
                Day {ds.wavespell.positionInWavespell} of 13
              </p>
            </div>
            <div className="score-track">
              <div className="score-fill" style={{ width: `${Math.round((ds.wavespell.positionInWavespell / 13) * 100)}%` }} />
            </div>
            <dl className="trad-facts">
              <dt>Covers</dt>
              <dd>
                kin {ds.wavespell.kinStart}–{ds.wavespell.kinEnd}
              </dd>
              <dt>Today’s number tone</dt>
              <dd>
                {ds.galacticTone.number}, {ds.galacticTone.name} ({ds.galacticTone.action.toLowerCase()},{' '}
                {ds.galacticTone.power.toLowerCase()})
              </dd>
            </dl>
          </div>

          <div className="curious-box space-y-3">
            <div>
              <p className="ui-eyebrow">Groups today’s symbol belongs to</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">Earth family: {ds.earthFamily.name}</p>
              <p className="readable-muted text-sm mt-0.5">
                One of five groups of four symbols, {EARTH_FAMILY_GLOSS[ds.earthFamily.name] ?? 'each with a shared role'}.
                Linked body centre (chakra): {ds.earthFamily.chakras}.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: colourInk }}>
                Colour family: {ds.solarSeal.color}
              </p>
              <p className="readable-muted text-sm mt-0.5">
                The 20 symbols come in four colours, five of each. {COLOUR_GLOSS[ds.solarSeal.color] ?? ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 52-day season */}
      {activeTab === 'CASTLE' && (
        <div className="space-y-3">
          <div>
            <p className="ui-eyebrow">52-day season (castle)</p>
            <h4 className="panel-title mt-1" style={{ color: season.color }}>
              {season.name}: {season.theme.toLowerCase()}
            </h4>
          </div>
          <p className="readable-body">
            The 260 days are also grouped into five seasons of 52 days, which Dreamspell calls castles. Today, kin{' '}
            {ds.kin}, falls in the {season.name.toLowerCase()} (kin {season.range}). {season.plain}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            {SEASONS.map((s, idx) => {
              const isActive = idx === seasonIndex;
              return (
                <div
                  key={s.name}
                  className={`curious-box !p-2 ${isActive ? '!border-2' : ''}`}
                  style={isActive ? { borderColor: s.color } : undefined}
                >
                  <div className="text-sm font-semibold" style={{ color: s.color }}>
                    {s.name}
                  </div>
                  <div className="text-xs text-[color:var(--text-secondary)]">{s.theme}</div>
                  <div className="text-xs text-[color:var(--text-muted)]">kin {s.range}</div>
                  {isActive && <div className="text-xs font-semibold text-[color:var(--text-primary)] mt-0.5">Now</div>}
                </div>
              );
            })}
          </div>
          <p className="readable-muted text-sm">Dreamspell’s own name for this season: {ds.castle.name}.</p>
        </div>
      )}
    </div>
  );
};
