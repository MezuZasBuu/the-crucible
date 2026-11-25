/**
 * Today at a glance — the day as each tradition writes it, with that tradition's own symbols.
 */

import React from 'react';
import { CompleteCalculationContext } from '../../types';
import { lunarPhaseFromLongitudes } from '../../engine/sharedCelestial';
import { MoonPhaseIcon } from '../shell/BrandMark';
import { PlanetGlyph, SignGlyph, formatDegMin } from '../symbols/AstroGlyph';
import {
  CallingEmblem,
  HANZI_ANIMALS,
  HANZI_ELEMENTS,
  MayaNumeral,
  NAKSHATRA_DEVANAGARI,
  Script,
  hexagramChar
} from '../symbols/CultureSymbols';

interface Props {
  ctx: CompleteCalculationContext;
  dateLabel: string;
  placeLabel: string;
  onOpenTraditions: () => void;
}

export const TodayAtAGlance: React.FC<Props> = ({ ctx, dateLabel, placeLabel, onOpenTraditions }) => {
  const sun = ctx.celestialBodies.find((b) => b.id === 'sun');
  const moon = ctx.celestialBodies.find((b) => b.id === 'moon');
  const phase = sun && moon ? lunarPhaseFromLongitudes(sun.eclipticLongitude, moon.eclipticLongitude) : null;
  const elongation = sun && moon ? (((moon.eclipticLongitude - sun.eclipticLongitude) % 360) + 360) % 360 : 0;
  const retro = ctx.celestialBodies.filter((b) => b.isRetrograde && !['chiron', 'north_node'].includes(b.id));
  const day = ctx.chinese.dayPillar;
  const calling = ctx.synthesis.topCalling;

  return (
    <section className="glance" aria-label="Today at a glance">
      <div className="glance-stars" aria-hidden />
      <div className="glance-head">
        <div className="min-w-0">
          <p className="glance-eyebrow">Today at a glance</p>
          <h2 className="glance-date">{dateLabel}</h2>
          <p className="glance-place">{placeLabel}</p>
        </div>
        {moon && phase && (
          <div className="glance-moon" title={`${phase.illuminationPercent}% lit`}>
            <MoonPhaseIcon elongation={elongation} size={54} />
            <div>
              <p className="glance-moon-name">{phase.phaseName}</p>
              <p className="glance-moon-sub">
                {phase.illuminationPercent}% lit · Moon in {moon.zodiacSign}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="glance-grid">
        {sun && (
          <div className="glance-tile">
            <span className="glance-symbol">
              <SignGlyph sign={sun.zodiacSign} size={30} />
            </span>
            <div className="min-w-0">
              <p className="glance-label">Western astrology</p>
              <p className="glance-value">Sun in {sun.zodiacSign}</p>
              <p className="glance-sub">
                {formatDegMin(sun.signDegree)}
                {retro.length > 0 && (
                  <>
                    {' · '}
                    {retro.map((b) => (
                      <PlanetGlyph key={b.id} planet={b.id} size={13} />
                    ))}{' '}
                    retrograde
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="glance-tile">
          <span className="glance-symbol">
            <MayaNumeral value={ctx.mayan.tzolkin.number} size={34} />
          </span>
          <div className="min-w-0">
            <p className="glance-label">Maya calendar</p>
            <p className="glance-value">{ctx.mayan.tzolkin.formatted}</p>
            <p className="glance-sub">{ctx.mayan.tzolkin.meaning.split(/[/,]/)[0].trim()} · {ctx.mayan.haab.formatted}</p>
          </div>
        </div>

        <div className="glance-tile">
          <span className="glance-symbol">
            <Script size={25} lang="zh">
              {day.stem}
              {day.branch}
            </Script>
          </span>
          <div className="min-w-0">
            <p className="glance-label">Chinese calendar</p>
            <p className="glance-value">
              {day.stemElement} {day.zodiacAnimal} day
            </p>
            <p className="glance-sub">
              <Script lang="zh">{HANZI_ELEMENTS[day.stemElement]}{HANZI_ANIMALS[day.zodiacAnimal] ?? ''}</Script> · {ctx.chinese.solarTerm.name.split('(')[1]?.replace(')', '') ?? ctx.chinese.solarTerm.name}
            </p>
          </div>
        </div>

        {ctx.vedic && (
          <div className="glance-tile">
            <span className="glance-symbol">
              <Script size={24} lang="sa">ॐ</Script>
            </span>
            <div className="min-w-0">
              <p className="glance-label">Vedic astrology</p>
              <p className="glance-value">Moon in {ctx.vedic.nakshatraName}</p>
              <p className="glance-sub">
                <Script lang="sa">{NAKSHATRA_DEVANAGARI[ctx.vedic.nakshatraNumber - 1] ?? ''}</Script> · {ctx.vedic.tithiName}
              </p>
            </div>
          </div>
        )}

        <div className="glance-tile">
          <span className="glance-symbol glance-symbol-digit">{ctx.numerology.universalDay}</span>
          <div className="min-w-0">
            <p className="glance-label">Numerology</p>
            <p className="glance-value">A “{ctx.numerology.universalDay}” day</p>
            <p className="glance-sub">{(ctx.numerology.numberMeanings?.[ctx.numerology.universalDay] ?? '').split(/[:,;]/)[0]}</p>
          </div>
        </div>

        <div className="glance-tile">
          <span className="glance-symbol">
            <span className="astro-glyph" style={{ fontSize: 30 }}>{hexagramChar(ctx.geneKeysSun.gate)}</span>
          </span>
          <div className="min-w-0">
            <p className="glance-label">Gene Keys · I Ching {ctx.geneKeysSun.gate}</p>
            <p className="glance-value">Gift: {ctx.geneKeysSun.gift}</p>
            <p className="glance-sub">Watch for {ctx.geneKeysSun.shadow.toLowerCase()}</p>
          </div>
        </div>

        <div className="glance-tile">
          <span className="glance-symbol">
            <CallingEmblem emblemId={calling.emblemId} size={28} />
          </span>
          <div className="min-w-0">
            <p className="glance-label">Today’s calling</p>
            <p className="glance-value">{calling.calling}</p>
            <p className="glance-sub">“{calling.motto}”</p>
          </div>
        </div>

        <button type="button" className="glance-tile glance-tile-link" onClick={onOpenTraditions}>
          <span className="glance-more">See all traditions →</span>
          <span className="glance-sub">Egyptian, Ethiopian, Athenian, Roman hours and more</span>
        </button>
      </div>
    </section>
  );
};
