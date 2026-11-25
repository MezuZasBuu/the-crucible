/**
 * Complete chart view: the wheel, the "big three", a planet table, the aspect
 * grid and a short guide — everything a standard chart report shows, with the
 * astrology terms explained in plain language.
 */

import React, { useMemo, useState } from 'react';
import { CelestialCoordinate, TemporalCoordinate } from '../../types';
import { CelestialAspect, calculateCelestialAspects } from '../../engine/ephemeris';
import { HouseSystem, buildChartLayout, houseOf, wrap360 } from '../../engine/chartWheel';
import { ChartWheel } from './ChartWheel';
import {
  ASPECTS,
  AspectGlyph,
  ELEMENT_COLOR,
  PLANETS,
  PlanetGlyph,
  SIGNS,
  SignGlyph,
  ZodiacElement,
  formatDegMin
} from '../symbols/AstroGlyph';

const HOUSE_MEANING: Record<number, string> = {
  1: 'self and first impressions',
  2: 'money and what you own',
  3: 'learning, talking, siblings',
  4: 'home and family',
  5: 'creativity, romance, play',
  6: 'daily work and health',
  7: 'partnerships',
  8: 'shared resources and big changes',
  9: 'travel, study, beliefs',
  10: 'career and reputation',
  11: 'friends and future hopes',
  12: 'rest, solitude, the hidden'
};

const ORDINAL = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

type Tab = 'planets' | 'aspects' | 'guide';

interface ChartSuiteProps {
  bodies: CelestialCoordinate[];
  temporal: TemporalCoordinate;
  latitude: number;
  mode: 'natal' | 'current-sky';
  birthTimeConfidence?: 'exact' | 'approximate' | 'unknown_window';
}

function signOf(longitude: number) {
  return SIGNS[Math.floor(wrap360(longitude) / 30) % 12];
}

export const ChartSuite: React.FC<ChartSuiteProps> = ({ bodies, temporal, latitude, mode, birthTimeConfidence }) => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [tab, setTab] = useState<Tab>('planets');
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus');

  const layout = useMemo(
    () => buildChartLayout({ temporal, latitude, mode, birthTimeConfidence, houseSystem }),
    [temporal, latitude, mode, birthTimeConfidence, houseSystem]
  );
  const aspects = useMemo(() => calculateCelestialAspects(bodies), [bodies]);
  const sortedAspects = useMemo(() => [...aspects].sort((a, b) => a.orbDeg - b.orbDeg), [aspects]);

  const sun = bodies.find((b) => b.id === 'sun');
  const moon = bodies.find((b) => b.id === 'moon');
  const rising = layout.angles ? signOf(layout.angles.ascendantDeg) : undefined;
  const selected = bodies.find((b) => b.id === selectedId);
  const possessive = mode === 'natal' ? 'your' : 'the';

  const balance = useMemo(() => {
    const counts: Record<ZodiacElement, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
    const core = bodies.filter((b) => b.id !== 'chiron' && b.id !== 'north_node');
    core.forEach((b) => {
      counts[signOf(b.eclipticLongitude).element] += 1;
    });
    return { counts, total: core.length || 1 };
  }, [bodies]);

  const aspectBetween = (a: CelestialCoordinate, b: CelestialCoordinate): CelestialAspect | undefined =>
    aspects.find((x) => (x.bodyA === a.name && x.bodyB === b.name) || (x.bodyA === b.name && x.bodyB === a.name));

  const bigThree = [
    sun && { key: 'sun', label: 'Sun sign', hint: 'your core self', sign: sun.zodiacSign, deg: sun.signDegree },
    moon && { key: 'moon', label: 'Moon sign', hint: 'your feelings', sign: moon.zodiacSign, deg: moon.signDegree },
    rising && layout.angles
      ? { key: 'rising', label: 'Rising sign', hint: 'how you come across', sign: rising.name, deg: layout.angles.ascendantDeg % 30 }
      : null
  ].filter(Boolean) as Array<{ key: string; label: string; hint: string; sign: string; deg: number }>;

  return (
    <div className="chart-suite">
      {/* Big three */}
      <div className="chart-big-three">
        {bigThree.map((item) => {
          const s = SIGNS.find((x) => x.name === item.sign);
          return (
            <div key={item.key} className="chart-big-card">
              <span className="chart-big-glyph" style={{ color: s ? ELEMENT_COLOR[s.element] : undefined }}>
                <SignGlyph sign={item.sign} size={30} />
              </span>
              <span className="min-w-0">
                <span className="chart-big-label">
                  {mode === 'natal' ? item.label : item.label.replace(' sign', '')}
                  <span className="chart-big-hint"> · {mode === 'natal' ? item.hint : item.key === 'rising' ? 'on the horizon now' : 'today'}</span>
                </span>
                <span className="chart-big-value">
                  {item.sign} <span className="chart-big-deg">{formatDegMin(item.deg)}</span>
                </span>
              </span>
            </div>
          );
        })}
        {!rising && (
          <div className="chart-big-card chart-big-card-muted">
            <span className="chart-big-label">Rising sign</span>
            <span className="chart-big-hint">Needs a birth time</span>
          </div>
        )}
      </div>

      {layout.limitation && <p className="chart-note">{layout.limitation}</p>}

      <div className="chart-layout">
        {/* Wheel */}
        <div className="chart-wheel-col">
          <ChartWheel
            bodies={bodies}
            aspects={aspects}
            layout={layout}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId((prev) => (prev === id ? undefined : id));
              setTab('planets');
            }}
          />

          <div className="chart-legend">
            {(['Trine', 'Sextile', 'Square', 'Opposition'] as const).map((name) => (
              <span key={name} className="chart-legend-item" title={ASPECTS[name].plain}>
                <svg width="22" height="6" aria-hidden>
                  <line x1="0" y1="3" x2="22" y2="3" stroke={ASPECTS[name].color} strokeWidth="2" strokeDasharray={name === 'Sextile' ? '5 4' : undefined} />
                </svg>
                {name} <span className="chart-legend-tone">{ASPECTS[name].tone === 'easy' ? 'easy' : 'tense'}</span>
              </span>
            ))}
          </div>

          <div className="chart-balance" aria-label="Element balance">
            {(Object.keys(balance.counts) as ZodiacElement[]).map((el) => (
              <div key={el} className="chart-balance-row">
                <span className="chart-balance-name" style={{ color: ELEMENT_COLOR[el] }}>{el}</span>
                <span className="chart-balance-track">
                  <span
                    className="chart-balance-fill"
                    style={{ width: `${(balance.counts[el] / balance.total) * 100}%`, background: ELEMENT_COLOR[el] }}
                  />
                </span>
                <span className="chart-balance-count">{balance.counts[el]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tables */}
        <div className="chart-side">
          <div className="chart-tabs" role="tablist">
            {(
              [
                ['planets', 'Planets'],
                ['aspects', 'Aspects'],
                ['guide', 'How to read this']
              ] as Array<[Tab, string]>
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`chart-tab ${tab === id ? 'chart-tab-active' : ''}`}
              >
                {label}
              </button>
            ))}
            {layout.hasAngles && (
              <label className="chart-house-select">
                <span>Houses</span>
                <select value={houseSystem} onChange={(e) => setHouseSystem(e.target.value as HouseSystem)}>
                  <option value="placidus">Placidus</option>
                  <option value="whole_sign">Whole sign</option>
                </select>
              </label>
            )}
          </div>

          {tab === 'planets' && (
            <div>
              <table className="chart-table">
                <thead>
                  <tr>
                    <th>Planet</th>
                    <th>Sign</th>
                    <th className="num">Position</th>
                    {layout.hasAngles && <th className="num">House</th>}
                  </tr>
                </thead>
                <tbody>
                  {bodies.map((body) => {
                    const info = PLANETS[body.id];
                    const house = houseOf(body.eclipticLongitude, layout.houses);
                    const isSel = body.id === selectedId;
                    return (
                      <tr
                        key={body.id}
                        className={isSel ? 'is-selected' : ''}
                        onClick={() => setSelectedId(isSel ? undefined : body.id)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setSelectedId(isSel ? undefined : body.id);
                        }}
                      >
                        <td>
                          <span className="chart-planet-cell">
                            <PlanetGlyph planet={body.id} size={19} tinted />
                            <span>{body.name}</span>
                            {body.isRetrograde && (
                              <span className="chart-retro" title="Retrograde: appears to move backward from Earth — a time to review rather than push ahead">
                                ℞
                              </span>
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="chart-sign-cell">
                            <SignGlyph sign={body.zodiacSign} size={17} tinted />
                            {body.zodiacSign}
                          </span>
                        </td>
                        <td className="num">{formatDegMin(body.signDegree)}</td>
                        {layout.hasAngles && <td className="num">{house ?? '—'}</td>}
                      </tr>
                    );
                  })}
                  {layout.angles && (
                    <>
                      <tr className="is-angle">
                        <td><span className="chart-planet-cell"><span className="chart-angle-tag">AC</span>Ascendant</span></td>
                        <td><span className="chart-sign-cell"><SignGlyph sign={signOf(layout.angles.ascendantDeg).name} size={17} tinted />{signOf(layout.angles.ascendantDeg).name}</span></td>
                        <td className="num">{formatDegMin(layout.angles.ascendantDeg % 30)}</td>
                        <td className="num">1</td>
                      </tr>
                      <tr className="is-angle">
                        <td><span className="chart-planet-cell"><span className="chart-angle-tag">MC</span>Midheaven</span></td>
                        <td><span className="chart-sign-cell"><SignGlyph sign={signOf(layout.angles.midheavenDeg).name} size={17} tinted />{signOf(layout.angles.midheavenDeg).name}</span></td>
                        <td className="num">{formatDegMin(layout.angles.midheavenDeg % 30)}</td>
                        <td className="num">10</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>

              <div className="chart-readout" aria-live="polite">
                {selected ? (
                  (() => {
                    const info = PLANETS[selected.id];
                    const s = SIGNS.find((x) => x.name === selected.zodiacSign);
                    const house = houseOf(selected.eclipticLongitude, layout.houses);
                    const mine = sortedAspects.filter((a) => a.bodyA === selected.name || a.bodyB === selected.name).slice(0, 4);
                    return (
                      <>
                        <p className="chart-readout-title">
                          <PlanetGlyph planet={selected.id} size={20} tinted /> {selected.name} in {selected.zodiacSign}
                          {house ? `, ${ORDINAL[house]} house` : ''}
                        </p>
                        <p className="chart-readout-body">
                          <strong>{selected.name}</strong> stands for {info?.meaning.toLowerCase() ?? 'this part of life'}.{' '}
                          <strong>{selected.zodiacSign}</strong> gives it a flavour of {s?.keyword ?? 'its own'}.
                          {house ? (
                            <>
                              {' '}The <strong>{ORDINAL[house]} house</strong> points it at {HOUSE_MEANING[house]}.
                            </>
                          ) : null}
                          {selected.isRetrograde ? ' It is retrograde, which favours reviewing and reworking over starting fresh.' : ''}
                        </p>
                        {mine.length > 0 && (
                          <ul className="chart-readout-aspects">
                            {mine.map((a, i) => {
                              const other = a.bodyA === selected.name ? a.bodyB : a.bodyA;
                              return (
                                <li key={i}>
                                  <AspectGlyph aspect={a.aspectType} size={15} /> {a.aspectType} with {other}
                                  <span className="chart-readout-plain"> — {ASPECTS[a.aspectType]?.plain}</span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <p className="chart-readout-body chart-readout-empty">
                    Tap any planet on the wheel or in the table to see what it means in plain words.
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === 'aspects' && (
            <div>
              <p className="chart-tab-intro">
                An aspect is the angle between two planets. Some angles let planets work together easily; others create friction.
              </p>
              <div className="aspect-grid-wrap">
                <table className="aspect-grid" aria-label="Aspect grid">
                  <tbody>
                    {bodies.map((row, r) => (
                      <tr key={row.id}>
                        {bodies.slice(0, r).map((col) => {
                          const asp = aspectBetween(row, col);
                          return (
                            <td
                              key={col.id}
                              className={asp ? `has-aspect tone-${ASPECTS[asp.aspectType]?.tone}` : ''}
                              title={asp ? `${row.name} ${asp.aspectType.toLowerCase()} ${col.name} · orb ${asp.orbDeg.toFixed(1)}°` : `${row.name} / ${col.name}: no major aspect`}
                            >
                              {asp && <AspectGlyph aspect={asp.aspectType} size={15} />}
                            </td>
                          );
                        })}
                        <th scope="row" title={row.name}>
                          <PlanetGlyph planet={row.id} size={17} tinted />
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="aspect-list">
                {sortedAspects.slice(0, 10).map((a, i) => {
                  const A = bodies.find((b) => b.name === a.bodyA);
                  const B = bodies.find((b) => b.name === a.bodyB);
                  return (
                    <li key={i}>
                      <span className="aspect-list-glyphs">
                        {A && <PlanetGlyph planet={A.id} size={17} tinted />}
                        <AspectGlyph aspect={a.aspectType} size={15} />
                        {B && <PlanetGlyph planet={B.id} size={17} tinted />}
                      </span>
                      <span className="aspect-list-text">
                        <strong>
                          {a.bodyA} {a.aspectType.toLowerCase()} {a.bodyB}
                        </strong>
                        <span> — {ASPECTS[a.aspectType]?.plain}</span>
                      </span>
                      <span className="aspect-list-orb" title="Orb: how far from exact. Smaller is stronger.">
                        {a.orbDeg.toFixed(1)}°
                      </span>
                    </li>
                  );
                })}
                {sortedAspects.length === 0 && <li className="chart-readout-empty">No major aspects within range right now.</li>}
              </ul>
            </div>
          )}

          {tab === 'guide' && (
            <div className="chart-guide">
              <ol>
                <li>
                  <strong>The outer ring is the zodiac.</strong> Twelve signs, each 30° wide. Colours show the element: fire, earth, air or water.
                </li>
                <li>
                  <strong>The symbols inside are the planets.</strong> Each sits at the degree of the sign it was in at this moment. ℞ means retrograde.
                </li>
                <li>
                  <strong>The numbers 1–12 are the houses</strong> — twelve areas of life, from self (1st) to career (10th). They depend on the exact time and place.
                </li>
                <li>
                  <strong>AC is the Ascendant</strong> (rising sign), always drawn on the left. <strong>MC is the Midheaven</strong>, the highest point of {possessive} chart.
                </li>
                <li>
                  <strong>Lines across the middle are aspects</strong> — the angles between planets. Green and teal are easy; red is tense.
                </li>
              </ol>
              <div className="chart-guide-glyphs">
                {Object.entries(PLANETS).map(([id, p]) => (
                  <span key={id} className="chart-guide-glyph" title={p.meaning}>
                    <PlanetGlyph planet={id} size={18} tinted /> {p.name}
                  </span>
                ))}
              </div>
              <div className="chart-guide-glyphs">
                {SIGNS.map((s) => (
                  <span key={s.name} className="chart-guide-glyph" title={`${s.element} · ${s.keyword}`}>
                    <SignGlyph sign={s.name} size={18} tinted /> {s.name}
                  </span>
                ))}
              </div>
              <p className="chart-guide-foot">
                Positions are calculated with the open-source astronomy-engine library (tropical zodiac, geocentric).
                {layout.hasAngles ? ` Houses: ${layout.houseSystem === 'placidus' ? 'Placidus' : 'Whole sign'}.` : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
