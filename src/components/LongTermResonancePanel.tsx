/**
 * The Crucible — "Next 14 days" panel.
 * Shows two weeks day by day: a match score per day, plus what several
 * traditions (Maya, Chinese, Western, Vedic, Gene Keys) say about the selected day.
 */

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Globe,
  Sparkles,
  Sun,
  Moon,
  Shield,
  Layers,
  Zap,
  Download,
  Flame,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { CompleteCalculationContext, FourteenDayForecastEntry } from '../types';
import {
  generateFourteenDayForecast,
  PRESET_LOCATIONS,
  PresetLocation
} from '../engine/longTermResonance';
import { nearestPresetLocationId } from '../engine/defaultLocation';
import { DomainImpactCards } from './cards/DomainImpactCards';
import { FadeInText } from './ui/FadeInText';
import { SignGlyph, PlanetGlyph, PLANETS, SIGNS } from './symbols/AstroGlyph';
import { CultureHeader, MayaNumeral } from './symbols/CultureSymbols';

const LOCATION_TYPE_LABEL: Record<string, string> = {
  ALL: 'All',
  CITY: 'Cities',
  SANCTUARY: 'Sacred sites',
  CONTINENT: 'Continents',
  COUNTRY: 'Countries'
};

const LOCATION_KIND: Record<string, string> = {
  CITY: 'City',
  SANCTUARY: 'Sacred site',
  CONTINENT: 'Continent',
  COUNTRY: 'Country'
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-11-25" → "25 Nov" (no time-zone maths, so the day never shifts). */
function shortDate(iso: string): string {
  const parts = (iso || '').split('-');
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!m || !d || !MONTHS[m - 1]) return iso;
  return `${d} ${MONTHS[m - 1]}`;
}

/** Finds a zodiac sign name inside free text such as "Leo 12.4°". */
function findSign(text: string): string | null {
  const lower = (text || '').toLowerCase();
  const hit = SIGNS.find((x) => lower.includes(x.name.toLowerCase()));
  return hit ? hit.name : null;
}

/** Finds a planet id inside free text such as "Mercury" or "Moon of Jupiter". */
function findPlanet(text: string): string | null {
  const lower = (text || '').toLowerCase();
  const id = Object.keys(PLANETS).find((k) => k !== 'moon' && lower.includes(PLANETS[k].name.toLowerCase()));
  if (id) return id;
  return lower.includes('moon') ? 'moon' : null;
}

const SignText: React.FC<{ text: string }> = ({ text }) => {
  const sign = findSign(text);
  return (
    <span className="inline-flex items-center gap-1.5">
      {sign && <SignGlyph sign={sign} size={18} tinted />}
      <span>{text}</span>
    </span>
  );
};

const PlanetText: React.FC<{ text: string }> = ({ text }) => {
  const planet = findPlanet(text);
  return (
    <span className="inline-flex items-center gap-1.5">
      {planet && <PlanetGlyph planet={planet} size={18} tinted />}
      <span>{text}</span>
    </span>
  );
};

interface LongTermResonancePanelProps {
  ctx: CompleteCalculationContext;
  onDateSelect?: (dateString: string) => void;
}

export const LongTermResonancePanel: React.FC<LongTermResonancePanelProps> = ({
  ctx,
  onDateSelect
}) => {
  // Birth profile state — empty until the person enters their own data
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [userName, setUserName] = useState<string>(ctx.input.querentName || '');
  
  // Forecast Start Date (Defaults to current context date)
  const [startDate, setStartDate] = useState<string>(ctx.input.dateString || new Date().toISOString().split('T')[0]);
  
  // Target Location State
  const [selectedLocationId, setSelectedLocationId] = useState<string>(() =>
    nearestPresetLocationId(ctx.input.location.latitude, ctx.input.location.longitude, PRESET_LOCATIONS)
  );
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'CITY' | 'SANCTUARY' | 'CONTINENT'>('ALL');

  // Active Selected Day in the 14-Day Grid (0 to 13)
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [domainSlideIndex, setDomainSlideIndex] = useState(0);

  // Active tab in the selected-day detail
  const [activeDossierTab, setActiveDossierTab] = useState<
    'IMPACTS' | 'SYNCHRONIC' | 'ASTROLOGY' | 'VEDIC_SIDEREAL' | 'GENE_KEYS' | 'ASTEROIDS_MOONS' | 'TERRESTRIAL' | 'SYNASTRY' | 'NARRATIVE'
  >('IMPACTS');

  const activeLocation = useMemo(() => {
    return PRESET_LOCATIONS.find((l) => l.id === selectedLocationId) || PRESET_LOCATIONS[0];
  }, [selectedLocationId]);

  // Compute the 14-Day Forecast deterministically (requires birth lock)
  const forecast = useMemo(() => {
    const safeBirth = birthDate || ctx.input.dateString;
    const safeTime = birthTime || '12:00:00';
    return generateFourteenDayForecast(
      {
        dateString: safeBirth,
        timeString: safeTime,
        timezoneOffsetMinutes: 0,
        isUTC: true,
        location: {
          latitude: activeLocation.lat,
          longitude: activeLocation.lng,
          city: activeLocation.name
        },
        querentName: userName || undefined
      },
      startDate,
      selectedLocationId,
      userName || 'you'
    );
  }, [birthDate, birthTime, startDate, selectedLocationId, userName, activeLocation, ctx.input.dateString]);

  const activeEntry: FourteenDayForecastEntry = forecast.fourteenDayEntries[activeDayIndex] || forecast.fourteenDayEntries[0];

  const filteredLocations = useMemo(() => {
    if (locationFilter === 'ALL') return PRESET_LOCATIONS;
    return PRESET_LOCATIONS.filter((l) => l.type === locationFilter);
  }, [locationFilter]);

  // Export 14-Day Forecast as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(forecast, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `the_crucible_14day_forecast_${forecast.startDateString}_to_${forecast.endDateString}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const peakIndex = forecast.macroFourteenDaySynthesis.peakTransmutationDayIndex;
  const peakEntry = forecast.fourteenDayEntries[peakIndex];
  const portalIndices = forecast.macroFourteenDaySynthesis.portalDayIndices;
  const hasBirthDate = Boolean(birthDate);

  const boxClass = 'curious-box space-y-3';
  const subTitle = 'text-sm font-semibold text-[color:var(--text-primary)]';

  return (
    <div className="space-y-6 motion-enter text-[color:var(--text-secondary)]">
      {/* 1. Slim summary row */}
      <div className="instrument-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 text-sm md:grid-cols-4">
            <div>
              <dt className="ui-eyebrow">Dates</dt>
              <dd className="mt-1 font-semibold text-[color:var(--text-primary)]">
                {shortDate(forecast.startDateString)} – {shortDate(forecast.endDateString)}
              </dd>
            </div>
            <div>
              <dt className="ui-eyebrow">Strongest day</dt>
              <dd className="mt-1 font-semibold text-[color:var(--text-primary)]">
                {peakEntry ? `${peakEntry.dayOfWeek}, ${shortDate(peakEntry.dateString)}` : '—'}
              </dd>
              {peakEntry && (
                <dd className="text-xs text-[color:var(--text-muted)]">
                  Match score {peakEntry.synchronicResonanceScore}%
                </dd>
              )}
            </div>
            <div>
              <dt className="ui-eyebrow">Portal days</dt>
              <dd className="mt-1 font-semibold text-[color:var(--text-primary)]">
                {portalIndices.length > 0 ? portalIndices.length : 'None'}
              </dd>
              <dd className="text-xs text-[color:var(--text-muted)]">
                {portalIndices.length > 0
                  ? portalIndices
                      .map((i) => shortDate(forecast.fourteenDayEntries[i]?.dateString || ''))
                      .filter(Boolean)
                      .join(', ')
                  : 'A steady two weeks'}
              </dd>
            </div>
            <div>
              <dt className="ui-eyebrow">Place</dt>
              <dd className="mt-1 flex items-center gap-1 font-semibold text-[color:var(--text-primary)]">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{activeLocation.name}</span>
              </dd>
              <dd className="truncate text-xs text-[color:var(--text-muted)]">{activeLocation.countryOrRegion}</dd>
            </div>
          </dl>

          <button
            onClick={handleExportJSON}
            className="cta-ghost shrink-0"
            title="Save all 14 days as a data file (JSON)"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download as file</span>
          </button>
        </div>
        <p className="field-help mt-4">
          A portal day is a marked day in the Dreamspell calendar, a modern calendar inspired by the Maya one.
          The match score is this app's own measure of how closely a day lines up with your birth date across the
          traditions. It is offered for reflection, not as a prediction.
        </p>
      </div>

      {/* 2. Settings row */}
      <div className="instrument-panel space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="field-label">Name (optional)</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="field-input w-full"
            />
          </label>
          <label className="block">
            <span className="field-label">Birth date (optional)</span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="field-input w-full"
            />
            <span className="field-help">Adds a personal match score.</span>
          </label>
          <label className="block">
            <span className="field-label">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="field-input w-full"
            />
            <span className="field-help">The first of the 14 days.</span>
          </label>
          <div>
            <label className="block">
              <span className="field-label">Place</span>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="field-input w-full"
              >
                {filteredLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} — {loc.countryOrRegion}
                  </option>
                ))}
              </select>
            </label>
            <div className="seg mt-2" role="group" aria-label="Show places of this kind">
              {(['ALL', 'CITY', 'SANCTUARY', 'CONTINENT'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLocationFilter(cat)}
                  className={locationFilter === cat ? 'seg-btn seg-btn-active' : 'seg-btn'}
                >
                  {LOCATION_TYPE_LABEL[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!hasBirthDate && (
          <p className="field-help">
            No birth date entered yet, so the scores below compare each day with the date shown in Today
            rather than with you.
          </p>
        )}

        <details>
          <summary className="cursor-pointer text-sm text-[color:var(--text-secondary)]">Technical details</summary>
          <dl className="trad-facts mt-3">
            <dt>{hasBirthDate ? 'Birth-date Sun sign' : 'Sun sign of the comparison date'}</dt>
            <dd><SignText text={forecast.birthProfile.sunSign} /></dd>
            <dt>Life path number (numerology)</dt>
            <dd>{forecast.birthProfile.lifePathNumber}</dd>
            <dt>Chinese day sign</dt>
            <dd>{forecast.birthProfile.chineseDayPillar}</dd>
            <dt>Maya day number (kin, 1–260)</dt>
            <dd>{forecast.birthProfile.mayanKin}</dd>
            <dt>Gene Key of the Sun</dt>
            <dd>{forecast.birthProfile.geneKeySunGate}</dd>
            <dt>Place coordinates</dt>
            <dd>
              {activeLocation.lat.toFixed(2)}°, {activeLocation.lng.toFixed(2)}°
            </dd>
            <dt>Landmark</dt>
            <dd>{activeLocation.leyLineNode}</dd>
            <dt>Longitude line</dt>
            <dd>{activeLocation.geodeticMeridian}</dd>
          </dl>
        </details>
      </div>

      {/* 3. The 14 day cards */}
      <div className="instrument-panel">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="panel-title text-base">Pick a day</h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[color:var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: 'var(--solar-deep)' }} />
              Strongest days
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: 'var(--temporal-deep)' }} />
              Portal day
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {forecast.fourteenDayEntries.map((entry, idx) => {
            const isSelected = activeDayIndex === idx;
            const isPortal = entry.mayan.isGalacticPortalDay;
            const isPeak = entry.isPeakResonanceDay;
            const marker = isPeak ? 'Strongest day' : isPortal ? 'Portal day' : null;

            return (
              <button
                key={entry.dateString}
                onClick={() => setActiveDayIndex(idx)}
                aria-pressed={isSelected}
                title={`${entry.dayOfWeek}, ${shortDate(entry.dateString)} — match score ${entry.synchronicResonanceScore}%${
                  marker ? ` — ${marker}` : ''
                } — Maya day number ${entry.mayan.kinNumber}, Chinese day ${entry.chinese.dayPillar}`}
                className="relative flex flex-col rounded-[var(--radius-md)] border p-3 text-left transition-colors"
                style={{
                  borderColor: isSelected ? 'var(--text-primary)' : 'var(--line-soft)',
                  background: isSelected ? 'var(--surface-raised)' : 'transparent',
                  boxShadow: isSelected ? 'inset 0 0 0 1px var(--text-primary)' : undefined
                }}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[color:var(--text-primary)]">
                    {entry.dayOfWeek.slice(0, 3)}
                  </span>
                  {marker && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: isPeak ? 'var(--solar-deep)' : 'var(--temporal-deep)' }}
                      aria-label={marker}
                    />
                  )}
                </div>
                <div className="text-xs text-[color:var(--text-muted)]">{shortDate(entry.dateString)}</div>

                <div className="score-track mt-3 w-full">
                  <div
                    className="score-fill"
                    style={{
                      width: `${entry.synchronicResonanceScore}%`,
                      ...(isPeak ? { background: 'var(--solar-deep)' } : {})
                    }}
                  />
                </div>
                <div className="mt-1 text-xs text-[color:var(--text-secondary)]">
                  {entry.synchronicResonanceScore}% match
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Selected day detail */}
      <div className="instrument-panel !p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[color:var(--line-soft)] p-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="ui-eyebrow">Day {activeDayIndex + 1} of 14</p>
            <h3 className="panel-title mt-1">
              {activeEntry.gregorianFormatted}
            </h3>
            <p className="readable-muted mt-1 text-sm">
              {activeEntry.resonanceArchetype}
              {activeEntry.isPeakResonanceDay && ' · One of the strongest days'}
              {activeEntry.mayan.isGalacticPortalDay && ' · Portal day (a marked day in the Dreamspell calendar)'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[9rem]">
              <span className="block text-xs text-[color:var(--text-muted)]">Match score</span>
              <span className="text-lg font-semibold text-[color:var(--text-primary)]">
                {activeEntry.synchronicResonanceScore}%
              </span>
              <div className="score-track mt-1 w-full">
                <div className="score-fill" style={{ width: `${activeEntry.synchronicResonanceScore}%` }} />
              </div>
            </div>

            {onDateSelect && (
              <button
                onClick={() => onDateSelect(activeEntry.dateString)}
                className="cta-primary"
                title="See this date in full on the Today screen"
              >
                <span>Open this day in Today</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Detail tabs */}
        <div className="explore-tabs border-b border-[color:var(--line-soft)] px-4 py-3">
          {[
            { id: 'IMPACTS', label: 'Summary', icon: Flame },
            { id: 'SYNCHRONIC', label: 'Calendars', icon: Layers },
            { id: 'ASTROLOGY', label: 'Planets', icon: Sun },
            { id: 'VEDIC_SIDEREAL', label: 'Vedic', icon: Moon },
            { id: 'GENE_KEYS', label: 'Gene Keys', icon: Sparkles },
            { id: 'ASTEROIDS_MOONS', label: 'Asteroids & moons', icon: Zap },
            { id: 'TERRESTRIAL', label: 'Place', icon: Globe },
            { id: 'SYNASTRY', label: 'You and this day', icon: Shield },
            { id: 'NARRATIVE', label: 'Story', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDossierTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDossierTab(tab.id as any)}
                aria-pressed={isActive}
                className={`explore-tab inline-flex shrink-0 items-center gap-1.5 ${isActive ? 'explore-tab-active' : ''}`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-5 text-sm">
          {/* Summary */}
          {activeDossierTab === 'IMPACTS' && (
            <div className="space-y-5">
              <div className={boxClass}>
                <p className="ui-eyebrow">Theme of the day</p>
                <FadeInText text={activeEntry.dailyTheme} as="h3" className="panel-title text-xl" />
                <FadeInText
                  text={`Something to try: ${activeEntry.dailyPractice}`}
                  className="readable-body"
                  delayMs={160}
                />
                <p className="readable-muted text-sm">
                  Match score {activeEntry.synchronicResonanceScore}% · {activeLocation.name}
                </p>
              </div>
              <DomainImpactCards
                domains={activeEntry.domains}
                slideIndex={domainSlideIndex}
                onSlideIndexChange={setDomainSlideIndex}
                deepReadingBase={{
                  forecastEntry: activeEntry,
                  targetLocationName: activeLocation.name,
                  mode: 'personal',
                  profile: {
                    id: 'forecast-panel',
                    displayName: userName || forecast.birthProfile.name,
                    querentName: userName || forecast.birthProfile.name,
                    birth: {
                      dateString: birthDate || forecast.birthProfile.dateString,
                      timeString: birthTime || forecast.birthProfile.timeString,
                      timezoneOffsetMinutes: 0,
                      isUTC: true,
                      location: {
                        latitude: forecast.birthProfile.coordinates.lat,
                        longitude: forecast.birthProfile.coordinates.lng,
                        city: forecast.birthProfile.city
                      }
                    },
                    birthTimeConfidence: 'approximate',
                    createdAtIso: forecast.generatedAt,
                    updatedAtIso: forecast.generatedAt
                  }
                }}
              />
            </div>
          )}

          {/* Calendars */}
          {activeDossierTab === 'SYNCHRONIC' && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div className={boxClass}>
                <CultureHeader culture="maya" />
                <div className="trad-hero">
                  <span className="trad-hero-symbol">
                    <MayaNumeral value={activeEntry.mayan.galacticTone.number} size={28} />
                  </span>
                  <div>
                    <p className="trad-hero-value">{activeEntry.mayan.tzolkinFormatted}</p>
                    <p className="trad-hero-sub">Day name in the 260-day count (Tzolk'in)</p>
                  </div>
                </div>
                <dl className="trad-facts">
                  <dt>Day sign</dt>
                  <dd>{activeEntry.mayan.signName}</dd>
                  <dt>Day number (1–13)</dt>
                  <dd>
                    {activeEntry.mayan.galacticTone.number} — {activeEntry.mayan.galacticTone.name}
                  </dd>
                  <dt>Its quality</dt>
                  <dd>{activeEntry.mayan.galacticTone.power}</dd>
                  <dt>Date in the 365-day year (Haab')</dt>
                  <dd>{activeEntry.mayan.haabFormatted}</dd>
                  <dt>Current 13-day period</dt>
                  <dd>{activeEntry.mayan.wavespellName}</dd>
                  <dt>Position in the 260-day count (kin)</dt>
                  <dd>{activeEntry.mayan.kinNumber}</dd>
                  <dt>Long Count (days since the Maya start date)</dt>
                  <dd>{activeEntry.mayan.longCount}</dd>
                </dl>
              </div>

              <div className={boxClass}>
                <CultureHeader culture="chinese" />
                <div className="trad-hero">
                  <div>
                    <p className="trad-hero-value">
                      {activeEntry.chinese.stemElement} {activeEntry.chinese.branchAnimal}
                    </p>
                    <p className="trad-hero-sub">Element and animal of this day in the 60-day cycle</p>
                  </div>
                </div>
                <dl className="trad-facts">
                  <dt>Day</dt>
                  <dd>{activeEntry.chinese.dayPillar}</dd>
                  <dt>Month</dt>
                  <dd>{activeEntry.chinese.monthPillar}</dd>
                  <dt>Year</dt>
                  <dd>{activeEntry.chinese.yearPillar}</dd>
                  <dt>Strongest element today</dt>
                  <dd>{activeEntry.chinese.dominantWuXing}</dd>
                  <dt>Season marker (solar term)</dt>
                  <dd>{activeEntry.chinese.solarTerm}</dd>
                  <dt>Poetic image (Na Yin)</dt>
                  <dd>{activeEntry.chinese.naYin}</dd>
                </dl>
              </div>

              <div className={boxClass}>
                <p className={subTitle}>How the calendars line up</p>
                <p className="trad-meaning">
                  <strong>In plain words:</strong> the Maya day {activeEntry.mayan.tzolkinFormatted} and the Chinese
                  day {activeEntry.chinese.stemElement} {activeEntry.chinese.branchAnimal} are compared with{' '}
                  {hasBirthDate ? 'your birth date' : 'the comparison date'}. Together they give this day a match
                  score of {activeEntry.synchronicResonanceScore}% and the theme “{activeEntry.resonanceArchetype}”.
                </p>
                <ul className="curious-list">
                  {activeEntry.birthSynastry.harmoniousInteractions.slice(0, 2).map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
                <dl className="trad-facts">
                  <dt>Astronomers' day count (Julian day)</dt>
                  <dd>{activeEntry.julianDayUT}</dd>
                </dl>
              </div>
            </div>
          )}

          {/* Planets */}
          {activeDossierTab === 'ASTROLOGY' && (
            <div className="space-y-4">
              <CultureHeader culture="western" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="curious-box">
                  <span className="flex items-center gap-1.5 text-xs text-[color:var(--text-muted)]">
                    <PlanetGlyph planet="sun" size={18} tinted /> Sun is in
                  </span>
                  <div className="mt-1 font-semibold text-[color:var(--text-primary)]">
                    <SignText text={activeEntry.planetary.sunZodiac} />
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--text-muted)]">
                    {activeEntry.planetary.sunDegree}° around the zodiac circle
                  </div>
                </div>
                <div className="curious-box">
                  <span className="flex items-center gap-1.5 text-xs text-[color:var(--text-muted)]">
                    <PlanetGlyph planet="moon" size={18} tinted /> Moon is in
                  </span>
                  <div className="mt-1 font-semibold text-[color:var(--text-primary)]">
                    <SignText text={activeEntry.planetary.moonZodiac} />
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--text-muted)]">
                    {activeEntry.planetary.moonPhase}, {activeEntry.planetary.moonIlluminationPercent}% lit
                  </div>
                </div>
                <div className="curious-box">
                  <span className="block text-xs text-[color:var(--text-muted)]">
                    Planets appearing to move backward (retrograde)
                  </span>
                  <div className="mt-1 font-semibold text-[color:var(--text-primary)]">
                    {activeEntry.planetary.retrogradeCount}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[color:var(--text-secondary)]">
                    {activeEntry.planetary.retrogradeBodies.map((body, i) => (
                      <PlanetText key={i} text={body} />
                    ))}
                  </div>
                </div>
                <div className="curious-box">
                  <span className="block text-xs text-[color:var(--text-muted)]">Eclipses</span>
                  <div
                    className="mt-1 font-semibold"
                    style={{ color: activeEntry.eclipses.isEclipseWindow ? 'var(--el-fire)' : 'var(--text-primary)' }}
                  >
                    {activeEntry.eclipses.isEclipseWindow ? 'An eclipse is close' : 'No eclipse nearby'}
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--text-muted)]">
                    {activeEntry.eclipses.daysToNearestEclipse} days to the nearest one ({activeEntry.eclipses.nearestEclipseType})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className={boxClass}>
                  <p className={subTitle}>Star groups highlighted on this day</p>
                  <ul className="curious-list">
                    {activeEntry.celestialMoonsAndAsteroids.activeConstellations.map((constellation, idx) => (
                      <li key={idx}>{constellation}</li>
                    ))}
                  </ul>
                </div>

                <div className={boxClass}>
                  <p className={subTitle}>Eclipse details</p>
                  <dl className="trad-facts">
                    <dt>Signs where eclipses fall this season</dt>
                    <dd className="inline-flex items-center gap-1.5">
                      <PlanetGlyph planet="north_node" size={18} tinted />
                      {activeEntry.eclipses.nodalAxis}
                    </dd>
                    <dt>Nearest eclipse</dt>
                    <dd>{activeEntry.eclipses.nearestEclipseType}</dd>
                    <dt>How far away</dt>
                    <dd>{activeEntry.eclipses.daysToNearestEclipse} days</dd>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Vedic */}
          {activeDossierTab === 'VEDIC_SIDEREAL' && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className={boxClass}>
                <CultureHeader culture="vedic" />
                <div className="trad-hero">
                  <div>
                    <p className="trad-hero-value">{activeEntry.vedic.nakshatraName}</p>
                    <p className="trad-hero-sub">
                      Nakshatra (lunar mansion): the stretch of sky the Moon is passing through
                    </p>
                  </div>
                </div>
                <dl className="trad-facts">
                  <dt>Quarter of the mansion (pada)</dt>
                  <dd>{activeEntry.vedic.nakshatraPada} of 4</dd>
                  <dt>Ruling planet</dt>
                  <dd><PlanetText text={activeEntry.vedic.nakshatraLord} /></dd>
                  <dt>Tithi (lunar day)</dt>
                  <dd>{activeEntry.vedic.tithiName}</dd>
                  <dt>Paksha (waxing or waning half of the month)</dt>
                  <dd>{activeEntry.vedic.paksha}</dd>
                  <dt>Yoga (Sun and Moon combination)</dt>
                  <dd>{activeEntry.vedic.yogaName}</dd>
                  <dt>Karana (half of a lunar day)</dt>
                  <dd>{activeEntry.vedic.karanaName}</dd>
                </dl>
              </div>

              <div className={boxClass}>
                <p className={subTitle}>Signs measured against the actual stars</p>
                <dl className="trad-facts">
                  <dt>Sun sign (star-based)</dt>
                  <dd><SignText text={activeEntry.sidereal.sunSign} /></dd>
                  <dt>Constellation behind the Sun</dt>
                  <dd><SignText text={activeEntry.sidereal.constellationSun} /></dd>
                  <dt>Moon sign (star-based)</dt>
                  <dd><SignText text={activeEntry.sidereal.moonSign} /></dd>
                  <dt>Constellation behind the Moon</dt>
                  <dd><SignText text={activeEntry.sidereal.constellationMoon} /></dd>
                </dl>
                <p className="trad-meaning">
                  <strong>In plain words:</strong> Western astrology ties its signs to the seasons. Indian astrology
                  ties them to the stars, which have slowly drifted about 24° since the two systems matched. That is
                  why these signs can differ from the ones on the Planets tab. The offset used here is{' '}
                  {activeEntry.vedic.lahiriAyanamshaDeg}° (the Lahiri standard).
                </p>
              </div>
            </div>
          )}

          {/* Gene Keys */}
          {activeDossierTab === 'GENE_KEYS' && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className={boxClass}>
                <CultureHeader culture="gene_keys" />
                <div className="trad-hero">
                  <span className="trad-hero-symbol">{activeEntry.geneKeys.sunGate}</span>
                  <div>
                    <p className="trad-hero-value">{activeEntry.geneKeys.name}</p>
                    <p className="trad-hero-sub">
                      Gene Key {activeEntry.geneKeys.sunGate} of 64, line {activeEntry.geneKeys.line} — set by where
                      the Sun is today
                    </p>
                  </div>
                </div>
                <dl className="trad-facts">
                  <dt>Shadow (the difficult side)</dt>
                  <dd>{activeEntry.geneKeys.shadow}</dd>
                  <dt>Gift (the constructive side)</dt>
                  <dd>{activeEntry.geneKeys.gift}</dd>
                  <dt>Siddhi (the highest ideal)</dt>
                  <dd>{activeEntry.geneKeys.siddhi}</dd>
                </dl>
              </div>

              <div className={boxClass}>
                <p className={subTitle}>The balancing key</p>
                <dl className="trad-facts">
                  <dt>Gene Key opposite the Sun (Earth key)</dt>
                  <dd>{activeEntry.geneKeys.earthGate}</dd>
                  <dt>Its gift</dt>
                  <dd>{activeEntry.geneKeys.earthGift}</dd>
                </dl>
                <p className="trad-meaning">
                  <strong>In plain words:</strong> each day has a main key and a balancing one. Gene Keys suggests
                  leaning on “{activeEntry.geneKeys.earthGift}” to stay steady today.
                </p>
                <p className="chart-note">
                  Something to try: if you notice “{activeEntry.geneKeys.shadow}” showing up in a conversation, pause
                  for a breath and aim for “{activeEntry.geneKeys.gift}” instead.
                </p>
              </div>
            </div>
          )}

          {/* Asteroids & moons */}
          {activeDossierTab === 'ASTEROIDS_MOONS' && (
            <div className="space-y-5">
              <div className={boxClass}>
                <p className={subTitle}>Large asteroids and the sign each is in</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeEntry.celestialMoonsAndAsteroids.activeAsteroids.map((ast) => (
                    <div key={ast.name} className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[color:var(--text-primary)]">{ast.name}</span>
                        <span className="text-xs text-[color:var(--text-secondary)]">
                          <SignText text={ast.sign} />
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{ast.theme}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={boxClass}>
                <p className={subTitle}>Moons of other planets</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {activeEntry.celestialMoonsAndAsteroids.otherMoonsTelemetry.map((m) => (
                    <div key={m.moon} className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[color:var(--text-primary)]">{m.moon}</span>
                        <span className="text-xs text-[color:var(--text-secondary)]">
                          <PlanetText text={`Moon of ${m.system}`} />
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{m.energeticQuality}</p>
                    </div>
                  ))}
                </div>
                <p className="field-help">
                  These are symbolic associations for reflection. They are not part of any traditional calendar.
                </p>
              </div>
            </div>
          )}

          {/* Place */}
          {activeDossierTab === 'TERRESTRIAL' && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className={boxClass}>
                <p className={`${subTitle} flex items-center gap-1.5`}>
                  <MapPin className="h-4 w-4" />
                  {activeEntry.geographicalResonance.targetLocationName}
                </p>
                <div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-[color:var(--text-muted)]">How well this place fits the day</span>
                    <span className="font-semibold text-[color:var(--text-primary)]">
                      {activeEntry.geographicalResonance.resonanceAffinity}%
                    </span>
                  </div>
                  <div className="score-track mt-1 w-full">
                    <div
                      className="score-fill"
                      style={{ width: `${activeEntry.geographicalResonance.resonanceAffinity}%` }}
                    />
                  </div>
                </div>
                <dl className="trad-facts">
                  <dt>Kind of place</dt>
                  <dd>
                    {LOCATION_KIND[activeEntry.geographicalResonance.locationType] ||
                      activeEntry.geographicalResonance.locationType}
                  </dd>
                  <dt>Coordinates</dt>
                  <dd>
                    {activeEntry.geographicalResonance.coordinates.lat.toFixed(2)}°,{' '}
                    {activeEntry.geographicalResonance.coordinates.lng.toFixed(2)}°
                  </dd>
                  <dt>Sky point directly overhead</dt>
                  <dd>{activeEntry.geographicalResonance.localGeodeticZenith}</dd>
                </dl>

                <div className="border-t border-[color:var(--line-soft)] pt-3">
                  <span className="mb-2 block text-xs text-[color:var(--text-muted)]">
                    Planet lines passing near this place (astrocartography: mapping planets onto the globe)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeEntry.geographicalResonance.powerLinesIntersecting.map((line, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-[color:var(--line-soft)] px-2.5 py-0.5 text-xs text-[color:var(--text-secondary)]"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={boxClass}>
                <p className={subTitle}>The wider region</p>
                <p className="readable-body">{activeEntry.geographicalResonance.regionalOvercastVector}</p>
                <p className="chart-note">
                  Something to try: if you are in {activeLocation.name}, or simply thinking about it, keep the day's
                  strongest Chinese element, {activeEntry.chinese.dominantWuXing}, in mind as a theme.
                </p>
              </div>
            </div>
          )}

          {/* You and this day */}
          {activeDossierTab === 'SYNASTRY' && (
            <div className="space-y-4">
              <div className={boxClass}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className={subTitle}>
                    How well this day fits {hasBirthDate ? (userName ? `${userName}'s birth date` : 'your birth date') : 'the comparison date'}
                  </p>
                  <span className="text-lg font-semibold text-[color:var(--text-primary)]">
                    {activeEntry.birthSynastry.resonanceWithBirthScore}%
                  </span>
                </div>
                <div className="score-track w-full">
                  <div
                    className="score-fill"
                    style={{ width: `${activeEntry.birthSynastry.resonanceWithBirthScore}%` }}
                  />
                </div>
                <p className="field-help">
                  {hasBirthDate
                    ? `Worked out from the birth date's Maya day number (${forecast.birthProfile.mayanKin}) and numerology life path number (${forecast.birthProfile.lifePathNumber}).`
                    : 'Add a birth date in the settings above to make this score personal.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className={boxClass}>
                  <p className={subTitle} style={{ color: 'var(--temporal-deep)' }}>What fits well</p>
                  <ul className="curious-list">
                    {activeEntry.birthSynastry.harmoniousInteractions.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className={boxClass}>
                  <p className={subTitle} style={{ color: 'var(--el-fire)' }}>Where there may be friction</p>
                  <ul className="curious-list">
                    {activeEntry.birthSynastry.karmicTensionWindows.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className={boxClass}>
                  <p className={subTitle} style={{ color: 'var(--solar-deep)' }}>Things to try</p>
                  <ul className="curious-list">
                    {activeEntry.birthSynastry.actionableOpportunities.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={boxClass}>
                <p className="ui-eyebrow">A choice the day may put in front of you</p>
                <p className={subTitle}>{activeEntry.dialecticalFork.title}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3">
                    <span className="mb-1 block font-semibold text-[color:var(--text-primary)]">One way to go</span>
                    <p>{activeEntry.dialecticalFork.pathA}</p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3">
                    <span className="mb-1 block font-semibold text-[color:var(--text-primary)]">Another way</span>
                    <p>{activeEntry.dialecticalFork.pathB}</p>
                  </div>
                </div>
                <p className="trad-meaning">
                  <strong>A middle path:</strong> {activeEntry.dialecticalFork.synthesis}
                </p>
              </div>
            </div>
          )}

          {/* Story */}
          {activeDossierTab === 'NARRATIVE' && (
            <div className={boxClass}>
              <p className="ui-eyebrow">The day told as a story</p>
              <h4 className="panel-title text-base">
                {activeEntry.gregorianFormatted}
              </h4>
              <div className="readable-body whitespace-pre-line">{activeEntry.dailyNovelisticForecast}</div>
              <p className="chart-note">
                This story weaves the day's calendar signs into one picture. It is written for reflection, not as a
                prediction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
