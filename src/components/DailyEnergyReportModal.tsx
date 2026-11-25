/**
 * The Crucible — detailed report for one day.
 * A long modal with the day's full reading and a plain-text export.
 */

import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download, Calendar, Sparkles } from 'lucide-react';
import { DailyEnergyReport, CompleteCalculationContext } from '../types';
import { generateTodayDailyReport } from '../engine/dailyEnergyReport';
import { getActiveProfile } from '../engine/crucibleProfile';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import { buildChartDynamicsReport } from '../engine/chartDynamics';
import { buildCompassContextPacket } from '../engine/almanac';
import { SignGlyph, PlanetGlyph, AspectGlyph } from './symbols/AstroGlyph';
import { CultureHeader, CallingEmblem } from './symbols/CultureSymbols';

/** Glyph id for a planet name, e.g. "North Node" → "north_node". */
const planetId = (name: string) => String(name).trim().toLowerCase().replace(/\s+/g, '_');
/** First word of a position such as "Leo 12.34° (Direct)" → "Leo". */
const signOf = (position: string) => String(position).trim().split(/\s+/)[0] || '';
/** Plain wording for a position string. */
const plainPosition = (position: string) =>
  String(position).replace(' (Direct)', '').replace('(Rx)', '(appearing to move backward)');

interface DailyEnergyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: DailyEnergyReport;
  ctx?: CompleteCalculationContext;
  onSyncToday?: () => void;
}

export const DailyEnergyReportModal: React.FC<DailyEnergyReportModalProps> = ({
  isOpen,
  onClose,
  report: passedReport,
  ctx,
  onSyncToday
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'MONOGRAPH' | 'VEDIC_SIDEREAL_ASTEROIDS' | 'GAIA' | 'TRANSITS' | 'CALENDRICS' | 'STRATEGY'
  >('OVERVIEW');
  const [expandedMonograph, setExpandedMonograph] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const [expansionError, setExpansionError] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');

  const report = useMemo<DailyEnergyReport | null>(() => {
    if (passedReport) return passedReport;
    try {
      return generateTodayDailyReport(ctx);
    } catch (err) {
      console.error('Failed to generate daily report:', err);
      return null;
    }
  }, [passedReport, ctx]);

  const chartDynamics = useMemo(() => {
    if (!ctx) return null;
    const profile = getActiveProfile();
    if (!profile) return null;
    try {
      const natalCtx = executeCrucibleCalculation(
        { ...profile.birth, querentName: profile.querentName || profile.displayName },
        'GMT_584283'
      );
      return buildChartDynamicsReport(natalCtx, ctx, 'GMT_584283');
    } catch {
      return null;
    }
  }, [ctx]);

  if (!isOpen || !report) return null;


  const handleCopy = () => {
    const text = `The Crucible — detailed report for the day
${report.gregorianFormatted} (Julian day ${report.julianDayUT})
Day number ${report.universalDayNumber} · ${report.dominantTone}

${report.executiveSynthesis}

---
Earth conditions (estimates worked out from the date, not live measurements)
- Magnetic activity: ${report.gaiaOvercast.geomagneticStatus} (Kp index ${report.gaiaOvercast.geomagneticKp} of 9)
- Earth's background hum (Schumann resonance): ${report.gaiaOvercast.schumannFrequencyHz} Hz
- Tension between the planets: ${report.gaiaOvercast.aspectTensionScore} out of 100
- Overall mood: ${report.gaiaOvercast.collectivePolarity}
- Moon: ${report.gaiaOvercast.lunarIlluminationPercent}% lit (${report.gaiaOvercast.lunarPhaseName})
- Chinese solar term (season marker): ${report.gaiaOvercast.solarTerm}

Sun, Moon and planets
- Sun: ${report.celestialWeather.sunPosition}
- Moon: ${plainPosition(report.celestialWeather.moonPosition)}
- Planets appearing to move backward (retrograde): ${report.celestialWeather.retrogradeBodies.join(', ')}

Calendars
- Maya: Long Count ${report.mayanProfile.longCount} | day ${report.mayanProfile.kinNumber} of 260 (${report.mayanProfile.tzolkinFormatted}) | tone ${report.mayanProfile.solarTone} | 365-day year: ${report.mayanProfile.haabFormatted}
- Chinese: day ${report.chineseProfile.dayPillar} | month ${report.chineseProfile.monthPillar} | year ${report.chineseProfile.yearPillar}
- Egyptian: ${report.ancientCalendars.egyptian}
- Ethiopian: ${report.ancientCalendars.ethiopian}
- Athenian: ${report.ancientCalendars.greekAttic}

Gene Keys & calling
- Gene Key from the Sun's position: key ${report.geneKeyTransit.sunGate}, line ${report.geneKeyTransit.line} (${report.geneKeyTransit.name})
  Difficulty: ${report.geneKeyTransit.shadow} -> Strength: ${report.geneKeyTransit.gift} -> Highest form: ${report.geneKeyTransit.siddhi}
- Today's calling: ${report.callingResonance.primaryCalling} (${report.callingResonance.quarter} quarter, stone: ${report.callingResonance.gemstone})

What to do today
${report.dailyStrategicActionPlan.goldenThread}
- Best time of day: ${report.dailyStrategicActionPlan.peakPowerWindow}
- What to use:
${report.dailyStrategicActionPlan.whatToHarness.map((h) => `  * ${h}`).join('\n')}
- What to watch out for:
${report.dailyStrategicActionPlan.whatToAvoid.map((a) => `  * ${a}`).join('\n')}

A choice for today
${report.dailyStrategicActionPlan.dialecticalFork.title}
Option A: ${report.dailyStrategicActionPlan.dialecticalFork.choiceA}
Option B: ${report.dailyStrategicActionPlan.dialecticalFork.choiceB}
A middle way: ${report.dailyStrategicActionPlan.dialecticalFork.syntheticResolution}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `Crucible-Daily-Energy-Report-${report.dateString}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExpandMonograph = async () => {
    setIsExpanding(true);
    setExpansionError(null);
    try {
      const res = await fetch('/api/daily-report/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report,
          context: ctx,
          almanacPacket: ctx ? buildCompassContextPacket(ctx, getActiveProfile()) : undefined
        })
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      if (data.expandedMonograph) {
        setExpandedMonograph(data.expandedMonograph);
      }
    } catch (err: any) {
      console.error('Monograph expansion failed:', err);
      setExpansionError(err.message || 'The request timed out.');
    } finally {
      setIsExpanding(false);
    }
  };


  const currentMonographText = expandedMonograph || report.extendedMonograph || report.executiveSynthesis;
  const wordCount = Math.round(currentMonographText.split(/\s+/).length).toLocaleString();
  const topCalling = ctx?.synthesis.topCalling;
  const callingMatches = topCalling && topCalling.calling === report.callingResonance.primaryCalling;
  const moonSign = signOf(report.celestialWeather.moonPosition);
  const sunSign = signOf(report.celestialWeather.sunPosition);
  const kpPercent = Math.max(0, Math.min(100, (report.gaiaOvercast.geomagneticKp / 9) * 100));
  const tensionPercent = Math.max(0, Math.min(100, report.gaiaOvercast.aspectTensionScore));

  const tabs = [
    { id: 'OVERVIEW', label: 'Summary' },
    { id: 'STRATEGY', label: 'What to do' },
    { id: 'TRANSITS', label: `Planets today (${report.celestialWeather.activeAspects.length})` },
    { id: 'CALENDRICS', label: 'Calendars' },
    { id: 'GAIA', label: 'Earth conditions' },
    { id: 'VEDIC_SIDEREAL_ASTEROIDS', label: 'Vedic, stars and world' },
    { id: 'MONOGRAPH', label: 'Full written report' }
  ] as const;

  const isChapterHeading = (paragraph: string) => {
    const t = paragraph.trim();
    return t.startsWith('Chapter') || /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII)\./.test(t);
  };

  return (
    <div className="guide-overlay overflow-y-auto" role="dialog" aria-modal="true" aria-label="Detailed report for the day">
      <div className="guide-sheet motion-enter">
        <div className="guide-head">
          <div className="min-w-0">
            <p className="ui-eyebrow">Detailed report for the day</p>
            <h2 className="guide-title">{report.gregorianFormatted}</h2>
            <p className="readable-muted mt-1">
              Day number {report.universalDayNumber} in numerology
              {report.mayanProfile.isGalacticPortalDay
                ? ' · Portal day (a marked day in the Dreamspell calendar)'
                : ''}
            </p>
          </div>
          <button type="button" onClick={onClose} className="guide-close" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="guide-body space-y-5">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {onSyncToday && (
              <button type="button" onClick={onSyncToday} className="cta-ghost" title="Show the report for the present moment">
                <Calendar className="w-4 h-4" />
                <span>Jump to now</span>
              </button>
            )}
            <button type="button" onClick={handleCopy} className="cta-ghost" title="Copy the whole report as plain text">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy as text'}</span>
            </button>
            <button type="button" onClick={handleDownload} className="cta-ghost" title="Download the report as a data file">
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
          </div>

          {/* At a glance */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="curious-box">
              <p className="readable-muted">Maya day</p>
              <p className="trad-hero-value">{report.mayanProfile.tzolkinFormatted}</p>
              <p className="readable-muted">
                Day {report.mayanProfile.kinNumber} of 260 · tone {report.mayanProfile.solarTone}
              </p>
            </div>
            <div className="curious-box">
              <p className="readable-muted">Chinese day</p>
              <p className="trad-hero-value">{report.chineseProfile.dayPillar}</p>
              <p className="readable-muted">Season marker: {report.chineseProfile.solarTerm}</p>
            </div>
            <div className="curious-box">
              <p className="readable-muted">Magnetic activity (estimate)</p>
              <p className="trad-hero-value">{report.gaiaOvercast.geomagneticStatus}</p>
              <p className="readable-muted">Kp index {report.gaiaOvercast.geomagneticKp} of 9</p>
            </div>
            <div className="curious-box">
              <p className="readable-muted">Moon</p>
              <p className="trad-hero-value">
                <SignGlyph sign={moonSign} size={18} tinted /> {report.gaiaOvercast.lunarIlluminationPercent}% lit
              </p>
              <p className="readable-muted">
                {report.gaiaOvercast.lunarPhaseName} · in {plainPosition(report.celestialWeather.moonPosition)}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="explore-tabs" role="tablist" aria-label="Report sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`explore-tab whitespace-nowrap ${activeTab === tab.id ? 'explore-tab-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Full written report */}
          {activeTab === 'MONOGRAPH' && (
            <div className="space-y-4">
              <div className="instrument-panel space-y-3">
                <div>
                  <h3 className="panel-title">Full written report</h3>
                  <p className="readable-muted mt-1">
                    The whole day in one long read, about {wordCount} words. It covers every tradition, how they
                    connect, and where they disagree.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExpandMonograph}
                    disabled={isExpanding}
                    className="cta-primary"
                    title="Ask for a longer, AI-written reading of this day"
                  >
                    <Sparkles className={`w-4 h-4 ${isExpanding ? 'animate-pulse' : ''}`} />
                    <span>
                      {isExpanding
                        ? 'Writing the in-depth reading…'
                        : expandedMonograph
                          ? 'Write the in-depth reading again'
                          : 'Get an in-depth reading'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentMonographText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="cta-ghost"
                    title="Copy the text of this written report"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy this text'}</span>
                  </button>
                </div>
                <p className="field-help">
                  The in-depth reading is AI-written and takes a little while.
                  {expandedMonograph ? ' You are reading it now.' : ''}
                </p>

                {expansionError && (
                  <p className="chart-note" style={{ color: 'var(--el-fire)' }}>
                    The in-depth reading could not be written just now ({expansionError}). The standard report is
                    shown below.
                  </p>
                )}
              </div>

              <div className="instrument-panel space-y-4">
                {currentMonographText.split('\n\n').map((paragraph, pIdx) =>
                  isChapterHeading(paragraph) ? (
                    <h4 key={pIdx} className="panel-title pt-4 border-t border-[color:var(--line-soft)] first:border-0 first:pt-0">
                      {paragraph}
                    </h4>
                  ) : (
                    <p key={pIdx} className="readable-body whitespace-pre-line">
                      {paragraph}
                    </p>
                  )
                )}
              </div>
            </div>
          )}

          {/* Vedic, stars and world */}
          {activeTab === 'VEDIC_SIDEREAL_ASTEROIDS' && (
            <div className="space-y-4">
              {report.vedicProfile && (
                <div className="instrument-panel space-y-4">
                  <CultureHeader culture="vedic" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="curious-box space-y-2">
                      <p className="readable-muted">Nakshatra (lunar mansion, the star group the Moon is in)</p>
                      <p className="trad-hero-value">{report.vedicProfile.nakshatra.name}</p>
                      <dl className="trad-facts">
                        <dt>Quarter</dt>
                        <dd>{report.vedicProfile.nakshatra.pada} of 4</dd>
                        <dt>Ruling planet</dt>
                        <dd>
                          <PlanetGlyph planet={planetId(report.vedicProfile.nakshatra.rulingPlanet)} size={16} tinted />{' '}
                          {report.vedicProfile.nakshatra.rulingPlanet}
                        </dd>
                        <dt>Deity</dt>
                        <dd>{report.vedicProfile.nakshatra.deity}</dd>
                        <dt>Its power</dt>
                        <dd>{report.vedicProfile.nakshatra.shakti}</dd>
                        <dt>Symbol</dt>
                        <dd>{report.vedicProfile.nakshatra.symbol}</dd>
                      </dl>
                    </div>

                    <div className="curious-box space-y-2">
                      <p className="readable-muted">Tithi (lunar day, one of 30 in a lunar month)</p>
                      <p className="trad-hero-value">{report.vedicProfile.tithi.name}</p>
                      <dl className="trad-facts">
                        <dt>Number</dt>
                        <dd>{report.vedicProfile.tithi.number}</dd>
                        <dt>Half of month</dt>
                        <dd>{report.vedicProfile.tithi.paksha}</dd>
                        <dt>Character</dt>
                        <dd>{report.vedicProfile.tithi.nature}</dd>
                      </dl>
                    </div>

                    <div className="curious-box space-y-2">
                      <p className="readable-muted">Yoga (a Sun and Moon combination, one of 27)</p>
                      <p className="trad-hero-value">{report.vedicProfile.yoga.name}</p>
                      <dl className="trad-facts">
                        <dt>Quality</dt>
                        <dd>{report.vedicProfile.yoga.quality}</dd>
                        <dt>Karana</dt>
                        <dd>{report.vedicProfile.karana.name} (half of a lunar day)</dd>
                      </dl>
                    </div>
                  </div>
                  <details>
                    <summary className="readable-muted cursor-pointer">Technical details</summary>
                    <p className="readable-muted mt-2">
                      Zodiac shift used (Lahiri ayanamsha, the gap between the seasonal and star-based zodiacs): −
                      {report.vedicProfile.lahiriAyanamshaDeg}°
                    </p>
                  </details>
                </div>
              )}

              {report.siderealProfile && (
                <div className="instrument-panel space-y-4">
                  <CultureHeader culture="western" title="Signs measured against the actual stars" explain={false} />
                  <p className="trad-meaning">
                    <strong>In plain words:</strong> the usual zodiac is tied to the seasons. Measured against the real
                    stars it has drifted by about {report.siderealProfile.ayanamshaOffsetDeg}°, so the Sun and Moon can
                    land in a different sign here.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="trad-hero">
                      <span className="trad-hero-symbol">
                        <SignGlyph sign={report.siderealProfile.sunSign} size={26} tinted />
                      </span>
                      <div className="min-w-0">
                        <p className="trad-hero-value">
                          <PlanetGlyph planet="sun" size={18} tinted /> Sun in {report.siderealProfile.sunSign},{' '}
                          {report.siderealProfile.sunDegree}°
                        </p>
                        <p className="trad-hero-sub">
                          Constellation behind it: {report.siderealProfile.iauConstellationSun}
                        </p>
                      </div>
                    </div>
                    <div className="trad-hero">
                      <span className="trad-hero-symbol">
                        <SignGlyph sign={report.siderealProfile.moonSign} size={26} tinted />
                      </span>
                      <div className="min-w-0">
                        <p className="trad-hero-value">
                          <PlanetGlyph planet="moon" size={18} tinted /> Moon in {report.siderealProfile.moonSign},{' '}
                          {report.siderealProfile.moonDegree}°
                        </p>
                        <p className="trad-hero-sub">
                          Constellation behind it: {report.siderealProfile.iauConstellationMoon}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {report.asteroidsAndOtherMoons && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="instrument-panel space-y-3">
                    <p className="ui-eyebrow">Asteroids and other small bodies</p>
                    <ul className="space-y-2">
                      {report.asteroidsAndOtherMoons.asteroids.map((ast) => (
                        <li key={ast.name} className="curious-box flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[color:var(--text-primary)]">{ast.name}</p>
                            <p className="readable-muted">{ast.theme}</p>
                          </div>
                          <p className="text-sm text-[color:var(--text-primary)] whitespace-nowrap">
                            <SignGlyph sign={ast.sign} size={16} tinted /> {ast.sign} {ast.degree}°
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="instrument-panel space-y-3">
                    <p className="ui-eyebrow">Moons of other planets</p>
                    <ul className="space-y-2">
                      {report.asteroidsAndOtherMoons.solarMoons.map((m) => (
                        <li key={m.name} className="curious-box space-y-1">
                          <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                            {m.name}, a moon of {m.parentPlanet}
                          </p>
                          <p className="readable-muted">{m.astrologicalQuality}</p>
                          <p className="readable-muted">Pull on its planet: {m.tidalStress}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {report.eclipseStatus && (
                <div className="instrument-panel space-y-2">
                  <p className="ui-eyebrow">Eclipses</p>
                  <p className="trad-hero-value">
                    {report.eclipseStatus.daysToNearestEclipse} days to the nearest eclipse (
                    {report.eclipseStatus.nearestEclipseType})
                  </p>
                  <p className="readable-body">
                    {report.eclipseStatus.isNearEclipseSeason
                      ? 'We are in an eclipse season, the few weeks around an eclipse.'
                      : 'We are between eclipse seasons.'}{' '}
                    The Moon’s nodes (the two points where eclipses can happen) are in{' '}
                    {report.eclipseStatus.nodalAxisSign}. {report.eclipseStatus.esotericImpact}
                  </p>
                </div>
              )}

              {report.continentalAndCityOvercast && (
                <div className="instrument-panel space-y-4">
                  <div>
                    <p className="ui-eyebrow">Around the world</p>
                    <p className="chart-note mt-2">
                      These are estimates worked out from the date for each continent. They are not live
                      measurements.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {report.continentalAndCityOvercast.continents.map((cont) => (
                      <div key={cont.continent} className="curious-box space-y-2">
                        <p className="trad-hero-value">{cont.continent}</p>
                        <dl className="trad-facts">
                          <dt>Element</dt>
                          <dd>{cont.dominantElement}</dd>
                          <dt>Magnetic activity</dt>
                          <dd>{cont.geomagneticCurrent}</dd>
                        </dl>
                        <p className="text-sm text-[color:var(--text-secondary)]">{cont.esotericOvercast}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="ui-eyebrow">Cities and how well they match the day</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                      {report.continentalAndCityOvercast.anchorCities.map((city) => (
                        <div key={city.name} className="curious-box">
                          <p className="text-sm font-semibold text-[color:var(--text-primary)]">{city.name}</p>
                          <p className="readable-muted">{city.country}</p>
                          <p className="text-sm text-[color:var(--text-primary)] mt-1">
                            Match score {city.resonanceAffinityScore}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              <div className="instrument-panel space-y-3">
                <p className="ui-eyebrow">Summary</p>
                <p className="readable-body whitespace-pre-line">{report.executiveSynthesis}</p>
                <p className="readable-muted">
                  Numerology day number {report.universalDayNumber}: {report.universalDayVibration}
                </p>
              </div>

              <div className="instrument-panel space-y-2">
                <p className="ui-eyebrow">Main theme for the day</p>
                <p className="readable-body">{report.dailyStrategicActionPlan.goldenThread}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="instrument-panel space-y-3">
                  <CultureHeader culture="callings" title="Today's calling" />
                  <div className="trad-hero">
                    {callingMatches && (
                      <span className="trad-hero-symbol">
                        <CallingEmblem emblemId={topCalling.emblemId} size={26} />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="trad-hero-value">{report.callingResonance.primaryCalling}</p>
                      {callingMatches && <p className="trad-hero-sub">{topCalling.motto}</p>}
                    </div>
                  </div>
                  <dl className="trad-facts">
                    <dt>Quarter</dt>
                    <dd>{report.callingResonance.quarter}</dd>
                    <dt>Gemstone</dt>
                    <dd>{report.callingResonance.gemstone}</dd>
                  </dl>
                  <p className="readable-body">{report.callingResonance.guidance}</p>
                </div>

                <div className="instrument-panel space-y-3">
                  <CultureHeader culture="gene_keys" />
                  <p className="trad-hero-value">
                    Key {report.geneKeyTransit.sunGate}, line {report.geneKeyTransit.line}: {report.geneKeyTransit.name}
                  </p>
                  <p className="readable-muted">
                    Taken from where the Sun is today. Each key names a difficulty, the strength it can turn into, and
                    its highest form.
                  </p>
                  <dl className="trad-facts">
                    <dt>Difficulty (“shadow”)</dt>
                    <dd>{report.geneKeyTransit.shadow}</dd>
                    <dt>Strength (“gift”)</dt>
                    <dd>{report.geneKeyTransit.gift}</dd>
                    <dt>Highest form (“siddhi”)</dt>
                    <dd>{report.geneKeyTransit.siddhi}</dd>
                  </dl>
                </div>
              </div>

              <p className="chart-note">
                These readings come from traditions and are offered for reflection. They are not predictions.
              </p>
            </div>
          )}

          {/* Earth conditions */}
          {activeTab === 'GAIA' && (
            <div className="space-y-4">
              <div className="instrument-panel space-y-3">
                <p className="ui-eyebrow">Earth conditions</p>
                <p className="chart-note">
                  These figures are estimates worked out from the date. They are not live measurements.
                </p>
                <p className="readable-body">{report.gaiaOvercast.atmosphericNarrative}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="instrument-panel space-y-2">
                  <p className="readable-muted">Magnetic activity around the Earth</p>
                  <p className="trad-hero-value">{report.gaiaOvercast.geomagneticStatus}</p>
                  <div className="score-track">
                    <div className="score-fill" style={{ width: `${kpPercent}%` }} />
                  </div>
                  <p className="readable-muted">
                    Kp index {report.gaiaOvercast.geomagneticKp} on a scale of 0 (calm) to 9 (severe storm).
                  </p>
                </div>

                <div className="instrument-panel space-y-2">
                  <p className="readable-muted">Earth’s background hum</p>
                  <p className="trad-hero-value">{report.gaiaOvercast.schumannFrequencyHz} Hz</p>
                  <p className="readable-muted">
                    This is the Schumann resonance, a natural radio hum between the ground and the upper atmosphere.
                    The usual value is 7.83 Hz; today’s estimate differs by{' '}
                    {(report.gaiaOvercast.schumannFrequencyHz - 7.83).toFixed(2)} Hz.
                  </p>
                </div>

                <div className="instrument-panel space-y-2">
                  <p className="readable-muted">Tension between the planets</p>
                  <p className="trad-hero-value">{report.gaiaOvercast.aspectTensionScore} out of 100</p>
                  <div className="score-track">
                    <div className="score-fill" style={{ width: `${tensionPercent}%` }} />
                  </div>
                  <p className="readable-muted">
                    Higher means more planets sit at angles astrologers read as difficult.
                  </p>
                </div>

                <div className="instrument-panel space-y-2">
                  <p className="readable-muted">Leading element (of the five Chinese elements)</p>
                  <p className="trad-hero-value">{report.gaiaOvercast.dominantElement}</p>
                  <p className="readable-muted">Overall mood: {report.gaiaOvercast.collectivePolarity}</p>
                </div>
              </div>
            </div>
          )}

          {/* Planets today */}
          {activeTab === 'TRANSITS' && (
            <div className="space-y-4">
              <div className="instrument-panel space-y-4">
                <CultureHeader culture="western" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="trad-hero">
                    <span className="trad-hero-symbol">
                      <SignGlyph sign={sunSign} size={26} tinted />
                    </span>
                    <div className="min-w-0">
                      <p className="trad-hero-value">
                        <PlanetGlyph planet="sun" size={18} tinted /> Sun in {report.celestialWeather.sunPosition}
                      </p>
                      <p className="trad-hero-sub">Degrees count how far through the sign it is, from 0 to 30.</p>
                    </div>
                  </div>
                  <div className="trad-hero">
                    <span className="trad-hero-symbol">
                      <SignGlyph sign={moonSign} size={26} tinted />
                    </span>
                    <div className="min-w-0">
                      <p className="trad-hero-value">
                        <PlanetGlyph planet="moon" size={18} tinted /> Moon in{' '}
                        {plainPosition(report.celestialWeather.moonPosition)}
                      </p>
                      <p className="trad-hero-sub">{report.gaiaOvercast.lunarTone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="instrument-panel space-y-3">
                <div>
                  <p className="ui-eyebrow">Angles between planets today</p>
                  <p className="readable-muted mt-1">
                    When two planets sit at certain angles, astrologers read them as working together or pulling
                    against each other.
                  </p>
                </div>
                <ul className="space-y-2">
                  {report.celestialWeather.activeAspects.map((asp, idx) => (
                    <li key={idx} className="curious-box space-y-1">
                      <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                        <PlanetGlyph planet={planetId(asp.body1)} size={16} tinted /> {asp.body1}{' '}
                        <AspectGlyph aspect={String(asp.aspect).split(' ')[0]} size={16} />{' '}
                        {String(asp.aspect).toLowerCase()}{' '}
                        <PlanetGlyph planet={planetId(asp.body2)} size={16} tinted /> {asp.body2}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: asp.nature === 'Harmonious' ? 'var(--temporal-deep)' : 'var(--el-fire)' }}
                      >
                        {asp.nature === 'Harmonious' ? 'Easy' : 'Tense'} · {asp.orb}° away from exact
                      </p>
                      <p className="text-sm text-[color:var(--text-secondary)]">{asp.meaning}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="instrument-panel space-y-2">
                <p className="ui-eyebrow">Planets appearing to move backward (retrograde)</p>
                <p className="readable-body">{report.celestialWeather.retrogradeBodies.join(', ')}</p>
                <p className="readable-body">{report.celestialWeather.cosmicCounsel}</p>
              </div>

              {chartDynamics && (
                <div className="space-y-4">
                  <div className="instrument-panel space-y-2">
                    <p className="ui-eyebrow">How today meets your birth chart</p>
                    <p className="readable-muted">Uses the birth details saved in My chart.</p>
                    <p className="readable-body whitespace-pre-line">{chartDynamics.openingBriefing}</p>
                  </div>
                  {chartDynamics.transitToNatal.length > 0 && (
                    <div className="instrument-panel space-y-3">
                      <p className="ui-eyebrow">Today’s planets touching your birth planets</p>
                      <ul className="space-y-2">
                        {chartDynamics.transitToNatal.slice(0, 8).map((hit, idx) => (
                          <li key={idx} className="curious-box space-y-1">
                            <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                              <PlanetGlyph planet={planetId(hit.transitingName)} size={16} tinted /> Today’s{' '}
                              {hit.transitingName} <AspectGlyph aspect={String(hit.aspectType)} size={16} />{' '}
                              {String(hit.aspectType).toLowerCase()} your birth{' '}
                              <PlanetGlyph planet={planetId(hit.natalName)} size={16} tinted /> {hit.natalName}
                              <span className="font-normal text-[color:var(--text-muted)]">
                                {' '}
                                ({hit.orbDeg}° away from exact)
                              </span>
                            </p>
                            <p className="text-sm text-[color:var(--text-secondary)]">{hit.briefing}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {chartDynamics.returns.some((r) => r.applicable) && (
                    <div className="instrument-panel space-y-3">
                      <div>
                        <p className="ui-eyebrow">Returns</p>
                        <p className="readable-muted mt-1">
                          A return is when a planet comes back to where it was when you were born.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {chartDynamics.returns
                          .filter((r) => r.applicable)
                          .map((r) => (
                            <div key={r.kind} className="curious-box">
                              <p className="readable-muted">{r.label}</p>
                              <p className="trad-hero-value">{r.momentIso.slice(0, 10)}</p>
                              <p className="readable-muted">{r.briefing}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Calendars */}
          {activeTab === 'CALENDRICS' && (
            <div className="space-y-4">
              <div className="instrument-panel space-y-3">
                <CultureHeader culture="maya" title="Maya calendar and Dreamspell" />
                <dl className="trad-facts">
                  <dt>Long Count</dt>
                  <dd>{report.mayanProfile.longCount} (a running count of days)</dd>
                  <dt>Tzolk'in</dt>
                  <dd>
                    {report.mayanProfile.tzolkinFormatted}, day {report.mayanProfile.kinNumber} of the 260-day sacred
                    count
                  </dd>
                  <dt>Tone</dt>
                  <dd>{report.mayanProfile.solarTone} (the day’s number from 1 to 13)</dd>
                  <dt>Haab'</dt>
                  <dd>{report.mayanProfile.haabFormatted} (the 365-day year)</dd>
                  <dt>13-day period</dt>
                  <dd>{report.mayanProfile.wavespellName} (Dreamspell calls this a “wavespell”)</dd>
                  <dt>Guide sign</dt>
                  <dd>{report.mayanProfile.fifthForceGuide} (a helper sign in Dreamspell)</dd>
                </dl>
                <p className="readable-body">Suggested practice: {report.mayanProfile.spiritualProtocol}</p>
              </div>

              <div className="instrument-panel space-y-3">
                <CultureHeader culture="chinese" />
                <dl className="trad-facts">
                  <dt>Day</dt>
                  <dd>{report.chineseProfile.dayPillar}</dd>
                  <dt>Month</dt>
                  <dd>{report.chineseProfile.monthPillar}</dd>
                  <dt>Year</dt>
                  <dd>{report.chineseProfile.yearPillar}</dd>
                  <dt>Solar term</dt>
                  <dd>{report.chineseProfile.solarTerm} (a season marker)</dd>
                </dl>
                <p className="readable-body">{report.chineseProfile.wuXingDynamic}</p>
              </div>

              <div className="instrument-panel space-y-3">
                <CultureHeader culture="egyptian" title="Egyptian, Ethiopian and Athenian calendars" explain={false} />
                <dl className="trad-facts">
                  <dt>Egyptian</dt>
                  <dd>{report.ancientCalendars.egyptian}</dd>
                  <dt>Ethiopian</dt>
                  <dd>{report.ancientCalendars.ethiopian}</dd>
                  <dt>Athenian</dt>
                  <dd>{report.ancientCalendars.greekAttic}</dd>
                  <dt>Old Roman</dt>
                  <dd>{report.ancientCalendars.julianEquivalent}</dd>
                </dl>
              </div>

              {(report.ancientCalendars.enochian || report.ancientCalendars.biblicalTekufah) && (
                <div className="instrument-panel space-y-3">
                  <CultureHeader culture="hebrew" title="Seasons, the 364-day calendar and the Roman weekday" />
                  <dl className="trad-facts">
                    {report.ancientCalendars.enochian && (
                      <>
                        <dt>364-day calendar</dt>
                        <dd>{report.ancientCalendars.enochian}</dd>
                      </>
                    )}
                    {report.ancientCalendars.biblicalTekufah && (
                      <>
                        <dt>Biblical season</dt>
                        <dd>{report.ancientCalendars.biblicalTekufah}</dd>
                      </>
                    )}
                    {report.ancientCalendars.romanDies && (
                      <>
                        <dt>Roman weekday</dt>
                        <dd>{report.ancientCalendars.romanDies}</dd>
                      </>
                    )}
                    {report.ancientCalendars.planetaryHour && (
                      <>
                        <dt>Planet of the hour</dt>
                        <dd>{report.ancientCalendars.planetaryHour}</dd>
                      </>
                    )}
                  </dl>
                  {ctx?.enochianBiblical && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="curious-box">
                        <p className="readable-muted">Read by the everyday calendar</p>
                        <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                          {ctx.enochianBiblical.abPeek.pathA.summary}
                        </p>
                      </div>
                      <div className="curious-box">
                        <p className="readable-muted">Read by the 364-day calendar</p>
                        <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                          {ctx.enochianBiblical.abPeek.pathB.summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* What to do */}
          {activeTab === 'STRATEGY' && (
            <div className="space-y-4">
              <div className="instrument-panel flex items-center justify-between gap-3">
                <div>
                  <p className="ui-eyebrow">Best time of day</p>
                  <p className="trad-hero-value mt-1">{report.dailyStrategicActionPlan.peakPowerWindow}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="instrument-panel space-y-2">
                  <p className="ui-eyebrow" style={{ color: 'var(--temporal-deep)' }}>
                    What to use today
                  </p>
                  <ul className="curious-list">
                    {report.dailyStrategicActionPlan.whatToHarness.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="instrument-panel space-y-2">
                  <p className="ui-eyebrow" style={{ color: 'var(--el-fire)' }}>
                    What to watch out for today
                  </p>
                  <ul className="curious-list">
                    {report.dailyStrategicActionPlan.whatToAvoid.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="instrument-panel space-y-3">
                <div>
                  <p className="ui-eyebrow">A choice for today</p>
                  <h3 className="panel-title">{report.dailyStrategicActionPlan.dialecticalFork.title}</h3>
                  <p className="readable-muted mt-1">
                    The traditions point two ways today. Here are both, plus a middle way.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="curious-box space-y-1">
                    <p className="ui-eyebrow">Option A: act and build</p>
                    <p className="text-sm text-[color:var(--text-secondary)]">
                      {report.dailyStrategicActionPlan.dialecticalFork.choiceA}
                    </p>
                  </div>
                  <div className="curious-box space-y-1">
                    <p className="ui-eyebrow">Option B: rest and protect</p>
                    <p className="text-sm text-[color:var(--text-secondary)]">
                      {report.dailyStrategicActionPlan.dialecticalFork.choiceB}
                    </p>
                  </div>
                </div>
                <p className="trad-meaning">
                  <strong>A middle way:</strong> {report.dailyStrategicActionPlan.dialecticalFork.syntheticResolution}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button type="button" onClick={onClose} className="cta-ghost">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
