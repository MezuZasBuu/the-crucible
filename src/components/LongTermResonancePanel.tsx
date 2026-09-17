/**
 * The Crucible — Long-Term Energetic Resonance Panel
 * 14-Day Multi-Tradition Forecast Dashboard.
 * Synchronizes Mayan Long Count, 60-Year Chinese BaZi, Planetary Transits,
 * Vedic Jyotish, Sidereal Constellations, Gene Keys, Asteroids & Moons,
 * and Global Terrestrial Geodetic Field across Cities, Countries, and Continents.
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar,
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
  AlertTriangle,
  ChevronRight,
  MapPin,
  Clock,
  User,
  Sliders
} from 'lucide-react';
import { CompleteCalculationContext, FourteenDayForecastEntry } from '../types';
import {
  generateFourteenDayForecast,
  PRESET_LOCATIONS,
  PresetLocation
} from '../engine/longTermResonance';

interface LongTermResonancePanelProps {
  ctx: CompleteCalculationContext;
  onDateSelect?: (dateString: string) => void;
}

export const LongTermResonancePanel: React.FC<LongTermResonancePanelProps> = ({
  ctx,
  onDateSelect
}) => {
  // Birth Profile State — empty until querent enters their own data
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [userName, setUserName] = useState<string>(ctx.input.querentName || '');
  
  // Forecast Start Date (Defaults to current context date)
  const [startDate, setStartDate] = useState<string>(ctx.input.dateString || new Date().toISOString().split('T')[0]);
  
  // Target Location State
  const [selectedLocationId, setSelectedLocationId] = useState<string>('jerusalem');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'CITY' | 'SANCTUARY' | 'CONTINENT'>('ALL');

  // Active Selected Day in the 14-Day Grid (0 to 13)
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // Active Sub-Tab in the Day Dossier
  const [activeDossierTab, setActiveDossierTab] = useState<
    'SYNCHRONIC' | 'ASTROLOGY' | 'VEDIC_SIDEREAL' | 'GENE_KEYS' | 'ASTEROIDS_MOONS' | 'TERRESTRIAL' | 'SYNASTRY' | 'NARRATIVE'
  >('SYNCHRONIC');

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
      userName || 'Querent'
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

  return (
    <div className="space-y-6 motion-enter text-[color:var(--text-secondary)]">
      {/* 1. Header Banner & Executive Synthesis */}
      <div className="instrument-panel instrument-panel-solar relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-950/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="ui-eyebrow flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2.5 py-1 text-[color:var(--temporal-bright)]">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Multi-Tradition 14-Day Arc
              </span>
              <span className="ui-eyebrow rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-2.5 py-1 text-[color:var(--solar-bright)]">
                Synchronic Resonance Matrix
              </span>
            </div>
            <h2 className="panel-title text-xl md:text-2xl">
              Long-Term Energetic Resonance Forecast
            </h2>
            <p className="font-garamond mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--text-secondary)]">
              Synthesizing the user's natal birth coordinates against 14 consecutive daily ephemerides:
              Mayan Long Count, Chinese 60-Year Sexagenary Pillars, Tropical & Sidereal transits, Vedic Nakshatras,
              Gene Keys neutrino stream, Asteroids & Moons, and Geodetic Terrestrial Resonance across planetary hubs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportJSON}
              className="cta-ghost"
              title="Export complete 14-day dataset as JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Macro Synthesis Highlight Strip */}
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[color:var(--line-soft)] pt-5 text-xs md:grid-cols-4">
          <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
            <div className="ui-eyebrow">14-Day Passage Range</div>
            <div className="data-readout mt-1 text-white">
              {forecast.startDateString} → {forecast.endDateString}
            </div>
            <div className="text-cyan-400 text-[10px] mt-1">14 Earth-Sun diurnal cycles</div>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
            <div className="ui-eyebrow">Peak Alchemical Crescendo</div>
            <div className="text-emerald-400 font-bold mt-0.5">
              Day {forecast.macroFourteenDaySynthesis.peakTransmutationDayIndex + 1} ({forecast.fourteenDayEntries[forecast.macroFourteenDaySynthesis.peakTransmutationDayIndex]?.dayOfWeek})
            </div>
            <div className="text-gray-400 text-[10px] mt-1">
              Resonance Score: {forecast.fourteenDayEntries[forecast.macroFourteenDaySynthesis.peakTransmutationDayIndex]?.synchronicResonanceScore}%
            </div>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
            <div className="ui-eyebrow">Portal Days in Arc</div>
            <div className="text-amber-300 font-bold mt-0.5">
              {forecast.macroFourteenDaySynthesis.portalDayIndices.length > 0
                ? `${forecast.macroFourteenDaySynthesis.portalDayIndices.length} Galactic Portal Days`
                : 'Zero Portal Days (Steady consolidation)'}
            </div>
            <div className="text-gray-400 text-[10px] mt-1">
              {forecast.macroFourteenDaySynthesis.portalDayIndices.length > 0
                ? `Days: ${forecast.macroFourteenDaySynthesis.portalDayIndices.map((i) => i + 1).join(', ')}`
                : 'Equilibrium phase'}
            </div>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
            <div className="ui-eyebrow">Target Terrestrial Anchor</div>
            <div className="text-orange-400 font-bold mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {activeLocation.name}
            </div>
            <div className="text-gray-400 text-[10px] mt-1 truncate" title={activeLocation.geodeticMeridian}>
              {activeLocation.geodeticMeridian}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Configuration & Parameter Controls */}
      <div className="instrument-panel grid grid-cols-1 gap-4 text-xs lg:grid-cols-12">
        {/* User Natal Birth Coordinates */}
        <div className="lg:col-span-4 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
            <span className="ui-eyebrow flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              User Natal Birth Profile
            </span>
            <span className="data-readout text-[10px]">Kin {forecast.birthProfile.mayanKin}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="ui-eyebrow block mb-1">Querent Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="field-input w-full"
              />
            </div>
            <div>
              <label className="ui-eyebrow block mb-1">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="field-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 pt-1">
            <div>Life Path: <span className="text-white font-bold">{forecast.birthProfile.lifePathNumber}</span></div>
            <div>Sun Gate: <span className="text-amber-300 font-bold">GK {forecast.birthProfile.geneKeySunGate}</span></div>
            <div>Day Pillar: <span className="text-white font-bold">{forecast.birthProfile.chineseDayPillar}</span></div>
            <div>Sun Sign: <span className="text-cyan-400 font-bold">{forecast.birthProfile.sunSign}</span></div>
          </div>
        </div>

        {/* Forecast Window & Start Date */}
        <div className="lg:col-span-3 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
            <span className="ui-eyebrow flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Forecast Window (14 Days)
            </span>
            <span className="text-[10px] text-amber-400">14-Day Horizon</span>
          </div>

          <div>
            <label className="ui-eyebrow block mb-1">Start Date of 14-Day Arc</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="field-input w-full"
            />
          </div>

          <p className="text-[10px] text-gray-400 leading-tight">
            Iterates 14 consecutive diurnal cycles through all calendrical engines and astronomical ephemerides.
          </p>
        </div>

        {/* Global Terrestrial Target Location (City / Country / Continent / Sanctuary) */}
        <div className="lg:col-span-5 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
            <span className="ui-eyebrow flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Terrestrial Grid Anchor (City / Continent)
            </span>
            
            <div className="flex items-center gap-1 text-[9px]">
              {(['ALL', 'CITY', 'SANCTUARY', 'CONTINENT'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLocationFilter(cat)}
                  className={`nav-tab !px-2 !py-1 text-[9px] ${
                    locationFilter === cat
                      ? 'nav-tab-active bg-emerald-300/[0.06] text-emerald-300'
                      : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="ui-eyebrow block mb-1">Select Target Planetary Node</label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="field-input w-full"
            >
              {filteredLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  [{loc.type}] {loc.name} — {loc.countryOrRegion} ({loc.geodeticMeridian})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
            <span className="text-emerald-400 font-bold">{activeLocation.name}</span>
            <span>Lat: {activeLocation.lat.toFixed(2)}°, Lng: {activeLocation.lng.toFixed(2)}°</span>
            <span className="text-gray-500 truncate max-w-[150px]">{activeLocation.leyLineNode}</span>
          </div>
        </div>
      </div>

      {/* 3. The 14-Day Timeline Ribbon / Interactive Grid */}
      <div className="instrument-panel instrument-panel-maya">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="panel-title text-base">
              14-Day Synchronic Resonance Timeline
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Peak Resonance (≥88%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Galactic Portal Day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Active Selection
            </span>
          </div>
        </div>

        {/* Horizontal Scrollable Day Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-14 gap-2">
          {forecast.fourteenDayEntries.map((entry, idx) => {
            const isSelected = activeDayIndex === idx;
            const isPortal = entry.mayan.isGalacticPortalDay;
            const isPeak = entry.isPeakResonanceDay;

            return (
              <button
                key={entry.dateString}
                onClick={() => setActiveDayIndex(idx)}
                className={`relative flex flex-col rounded-[var(--radius-md)] border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-cyan-300/40 bg-cyan-300/[0.08] text-white shadow-[var(--glow-temporal)]'
                    : isPeak
                    ? 'border-emerald-300/25 bg-emerald-300/[0.05] text-gray-300 hover:border-emerald-300/40'
                    : isPortal
                    ? 'border-amber-300/25 bg-amber-300/[0.05] text-gray-300 hover:border-amber-300/40'
                    : 'border-[color:var(--line-soft)] bg-white/[0.025] text-gray-400 hover:border-[color:var(--line-medium)]'
                }`}
              >
                {/* Badges */}
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[9px] font-bold text-gray-500">D{idx + 1}</span>
                  {isPortal && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Galactic Portal Day" />
                  )}
                  {isPeak && !isPortal && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Peak Resonance" />
                  )}
                </div>

                <div className="text-[11px] font-bold text-white truncate">
                  {entry.dayOfWeek.slice(0, 3)}
                </div>
                <div className="text-[9px] text-gray-500">
                  {entry.dateString.slice(5)}
                </div>

                <div className="mt-2 pt-1 border-t border-[color:var(--line-soft)] space-y-0.5 text-[9px]">
                  <div className="text-cyan-400 font-medium truncate">
                    Kin {entry.mayan.kinNumber}
                  </div>
                  <div className="text-orange-300 truncate">
                    {entry.chinese.dayPillar.split(' ')[0]}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="score-track mt-2 w-full">
                  <div
                    className={`score-fill ${
                      entry.synchronicResonanceScore >= 88
                        ? 'bg-emerald-400'
                        : entry.synchronicResonanceScore >= 75
                        ? 'bg-cyan-400'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${entry.synchronicResonanceScore}%` }}
                  />
                </div>
                <div className="text-right text-[8px] text-gray-400 mt-0.5">
                  {entry.synchronicResonanceScore}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Day Dossier View */}
      <div className="instrument-panel !p-0 overflow-hidden">
        {/* Day Dossier Header */}
        <div className="flex flex-col gap-3 border-b border-[color:var(--line-soft)] bg-white/[0.025] p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-cyan-300/25 bg-cyan-300/[0.08] font-cinzel text-base font-bold text-[color:var(--temporal-bright)] shadow-[var(--glow-temporal)]">
              {activeDayIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="panel-title">
                  Day {activeDayIndex + 1}: {activeEntry.gregorianFormatted} ({activeEntry.dayOfWeek})
                </h3>
                {activeEntry.mayan.isGalacticPortalDay && (
                  <span className="ui-eyebrow rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-2 py-1 text-[color:var(--solar-bright)]">
                    Galactic Portal Day
                  </span>
                )}
                {activeEntry.isPeakResonanceDay && (
                  <span className="ui-eyebrow rounded-full border border-emerald-300/25 bg-emerald-300/[0.07] px-2 py-1 text-emerald-300">
                    Peak Resonance
                  </span>
                )}
              </div>
              <p className="data-readout mt-1">
                {activeEntry.resonanceArchetype} · Julian Day {activeEntry.julianDayUT}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-gray-500 text-[9px] uppercase block">Resonance With Birth</span>
              <span className="text-emerald-400 font-bold text-sm">
                {activeEntry.synchronicResonanceScore}% Affinity
              </span>
            </div>

            {onDateSelect && (
              <button
                onClick={() => onDateSelect(activeEntry.dateString)}
                className="cta-ghost min-h-0 px-3 py-2 text-[10px] uppercase"
                title="Inspect in Main Grid / System Report"
              >
                <span>Load in Master Grid</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dossier Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-[color:var(--line-soft)] bg-black/10 px-4 py-2 text-xs">
          {[
            { id: 'SYNCHRONIC', label: 'Synchronic Core', icon: Layers },
            { id: 'ASTROLOGY', label: 'Planetary Transits', icon: Sun },
            { id: 'VEDIC_SIDEREAL', label: 'Vedic & Sidereal', icon: Moon },
            { id: 'GENE_KEYS', label: 'Gene Keys & HD', icon: Sparkles },
            { id: 'ASTEROIDS_MOONS', label: 'Asteroids & Moons', icon: Zap },
            { id: 'TERRESTRIAL', label: 'Terrestrial Field Grid', icon: Globe },
            { id: 'SYNASTRY', label: 'Birth Synastry', icon: Shield },
            { id: 'NARRATIVE', label: 'Novelistic Forecast', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDossierTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDossierTab(tab.id as any)}
                className={`nav-tab flex items-center gap-1.5 uppercase text-[10px] ${
                  isActive
                    ? 'nav-tab-active bg-cyan-300/[0.06]'
                    : ''
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="p-5 text-xs">
          {/* TAB 1: SYNCHRONIC CORE */}
          {activeDossierTab === 'SYNCHRONIC' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Mayan Long Count & Tzolk'in */}
              <div className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-cyan-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Mayan Classical Computus
                  </span>
                  <span className="text-[10px] text-gray-400">Kin {activeEntry.mayan.kinNumber}</span>
                </div>
                <div className="space-y-1.5 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Long Count:</span>
                    <span className="text-white font-medium">{activeEntry.mayan.longCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sacred Tzolk'in:</span>
                    <span className="text-cyan-300 font-bold">{activeEntry.mayan.tzolkinFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Solar Glyph:</span>
                    <span className="text-white">{activeEntry.mayan.signName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Galactic Tone:</span>
                    <span className="text-amber-300">
                      Tone {activeEntry.mayan.galacticTone.number} ({activeEntry.mayan.galacticTone.name})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Galactic Power:</span>
                    <span className="text-white">{activeEntry.mayan.galacticTone.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Haab' Date:</span>
                    <span className="text-white">{activeEntry.mayan.haabFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Wavespell:</span>
                    <span className="text-cyan-400">{activeEntry.mayan.wavespellName}</span>
                  </div>
                </div>
              </div>

              {/* Chinese Sexagenary 60-Year Cycle */}
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-orange-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    Chinese 60-Year Cycle (BaZi)
                  </span>
                  <span className="text-[10px] text-gray-400">{activeEntry.chinese.solarTerm}</span>
                </div>
                <div className="space-y-1.5 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Day Pillar:</span>
                    <span className="text-orange-300 font-bold">{activeEntry.chinese.dayPillar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Month Pillar:</span>
                    <span className="text-white">{activeEntry.chinese.monthPillar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Year Pillar:</span>
                    <span className="text-white">{activeEntry.chinese.yearPillar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Day Stem Element:</span>
                    <span className="text-white font-medium">{activeEntry.chinese.stemElement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Zodiac Animal:</span>
                    <span className="text-white">{activeEntry.chinese.branchAnimal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dominant Wu Xing:</span>
                    <span className="text-emerald-400 font-bold">{activeEntry.chinese.dominantWuXing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Na Yin Melodic:</span>
                    <span className="text-gray-300">{activeEntry.chinese.naYin}</span>
                  </div>
                </div>
              </div>

              {/* Synchronic Triad Alignment */}
              <div className="rounded-[var(--radius-md)] border border-emerald-300/10 bg-emerald-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-emerald-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Cross-Tradition Synthesis
                  </span>
                  <span className="text-[10px] text-emerald-400">{activeEntry.synchronicResonanceScore}%</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  The triad between Mayan Kin {activeEntry.mayan.kinNumber}, Chinese {activeEntry.chinese.stemElement} {activeEntry.chinese.branchAnimal}, and Natal Kin {forecast.birthProfile.mayanKin} establishes an alchemical vector of {activeEntry.resonanceArchetype}.
                </p>
                <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-black/10 p-3 text-[10px] space-y-1">
                  <div className="text-gray-400">
                    <strong className="text-white">Primary Synthesis:</strong> {activeEntry.birthSynastry.harmoniousInteractions[0]}
                  </div>
                  <div className="text-gray-400">
                    <strong className="text-white">Transit Vector:</strong> {activeEntry.birthSynastry.harmoniousInteractions[1]}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANETARY TRANSITS */}
          {activeDossierTab === 'ASTROLOGY' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-3">
                  <span className="text-gray-500 text-[9px] uppercase">Solar Position</span>
                  <div className="text-amber-300 font-bold text-sm mt-0.5">{activeEntry.planetary.sunZodiac}</div>
                  <div className="text-gray-400 text-[10px] mt-1">Ecliptic Longitude: {activeEntry.planetary.sunDegree}°</div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-3">
                  <span className="text-gray-500 text-[9px] uppercase">Lunar Position & Phase</span>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{activeEntry.planetary.moonZodiac}</div>
                  <div className="text-gray-400 text-[10px] mt-1">
                    {activeEntry.planetary.moonPhase} ({activeEntry.planetary.moonIlluminationPercent}% Illum)
                  </div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-orange-300/10 bg-orange-300/[0.025] p-3">
                  <span className="text-gray-500 text-[9px] uppercase">Retrograde Spheres</span>
                  <div className="text-orange-400 font-bold text-sm mt-0.5">
                    {activeEntry.planetary.retrogradeCount} Active Stations
                  </div>
                  <div className="text-gray-400 text-[10px] mt-1 truncate" title={activeEntry.planetary.retrogradeBodies.join(', ')}>
                    {activeEntry.planetary.retrogradeBodies.join(', ')}
                  </div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-emerald-300/10 bg-emerald-300/[0.025] p-3">
                  <span className="text-gray-500 text-[9px] uppercase">Eclipse Season Window</span>
                  <div className={`font-bold text-sm mt-0.5 ${activeEntry.eclipses.isEclipseWindow ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeEntry.eclipses.isEclipseWindow ? 'Active Eclipse Window' : 'Intersession Interval'}
                  </div>
                  <div className="text-gray-400 text-[10px] mt-1">
                    {activeEntry.eclipses.daysToNearestEclipse} days to {activeEntry.eclipses.nearestEclipseType}
                  </div>
                </div>
              </div>

              {/* Active Constellations & Eclipses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-4 space-y-2">
                  <h4 className="text-cyan-400 font-bold uppercase text-[11px]">
                    Active Deep Sky Constellations & Portals
                  </h4>
                  <div className="space-y-1 text-gray-300">
                    {activeEntry.celestialMoonsAndAsteroids.activeConstellations.map((constellation, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{constellation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-4 space-y-2">
                  <h4 className="text-amber-400 font-bold uppercase text-[11px]">
                    Karmic Nodal Axis & Eclipse Status
                  </h4>
                  <div className="space-y-1.5 text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nodal Axis:</span>
                      <span className="text-white font-medium">{activeEntry.eclipses.nodalAxis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nearest Eclipse:</span>
                      <span className="text-amber-300">{activeEntry.eclipses.nearestEclipseType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Proximity:</span>
                      <span className="text-white">{activeEntry.eclipses.daysToNearestEclipse} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VEDIC & SIDEREAL */}
          {activeDossierTab === 'VEDIC_SIDEREAL' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-amber-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5" />
                    Vedic Jyotish Panchanga
                  </span>
                  <span className="text-[10px] text-gray-400">Lahiri Ayanamsha: -{activeEntry.vedic.lahiriAyanamshaDeg}°</span>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lunar Nakshatra:</span>
                    <span className="text-amber-300 font-bold">
                      {activeEntry.vedic.nakshatraName} (Pada {activeEntry.vedic.nakshatraPada})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nakshatra Planetary Lord:</span>
                    <span className="text-white">{activeEntry.vedic.nakshatraLord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tithi (Lunar Day):</span>
                    <span className="text-white">{activeEntry.vedic.tithiName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paksha:</span>
                    <span className="text-cyan-400">{activeEntry.vedic.paksha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nitya Yoga:</span>
                    <span className="text-white">{activeEntry.vedic.yogaName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Karana:</span>
                    <span className="text-white">{activeEntry.vedic.karanaName}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-cyan-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Sidereal Astronomical Sky (IAU)
                  </span>
                  <span className="text-[10px] text-cyan-400">True Celestial Constellations</span>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sidereal Sun Sign:</span>
                    <span className="text-white font-medium">{activeEntry.sidereal.sunSign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Astronomical Sun Constellation:</span>
                    <span className="text-amber-300 font-bold">{activeEntry.sidereal.constellationSun}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sidereal Moon Sign:</span>
                    <span className="text-white font-medium">{activeEntry.sidereal.moonSign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Astronomical Moon Constellation:</span>
                    <span className="text-cyan-300 font-bold">{activeEntry.sidereal.constellationMoon}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 pt-2 border-t border-[color:var(--line-soft)]">
                    Accounts for ~24.1° of axial precession since the epoch of Hipparchus, aligning consciousness with the true physical starry vault.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GENE KEYS & HUMAN DESIGN */}
          {activeDossierTab === 'GENE_KEYS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-amber-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" />
                    Solar Transit Gate (64-Gate Matrix)
                  </span>
                  <span className="text-[10px] text-amber-400">
                    Gate {activeEntry.geneKeys.sunGate}.{activeEntry.geneKeys.line}
                  </span>
                </div>
                <div className="text-white font-serif text-sm">{activeEntry.geneKeys.name}</div>
                <div className="space-y-2 text-gray-300 pt-1">
                  <div className="rounded-[var(--radius-sm)] border border-rose-300/15 bg-rose-300/[0.035] p-2">
                    <span className="text-rose-400 text-[10px] uppercase font-bold block">Shadow Frequency</span>
                    <span className="text-rose-200">{activeEntry.geneKeys.shadow}</span>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-emerald-300/15 bg-emerald-300/[0.035] p-2">
                    <span className="text-emerald-400 text-[10px] uppercase font-bold block">Gift Frequency</span>
                    <span className="text-emerald-200">{activeEntry.geneKeys.gift}</span>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-cyan-300/15 bg-cyan-300/[0.035] p-2">
                    <span className="text-cyan-400 text-[10px] uppercase font-bold block">Siddhi Divine State</span>
                    <span className="text-cyan-200">{activeEntry.geneKeys.siddhi}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-emerald-300/10 bg-emerald-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-emerald-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Earth Grounding Gate
                  </span>
                  <span className="text-[10px] text-emerald-400">Gate {activeEntry.geneKeys.earthGate}</span>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  The Earth gate provides the somatic grounding foundation for the day. Grounding into the Gift of <strong className="text-emerald-300">{activeEntry.geneKeys.earthGift}</strong> anchors the high-frequency revelations received through the Solar gate.
                </p>
                <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-black/10 p-3 text-gray-400 text-[11px]">
                  <strong className="text-white block mb-1">Daily Evolutionary Guidance:</strong>
                  Whenever you notice the tension of "{activeEntry.geneKeys.shadow}" arising in negotiations or personal dialogue, consciously breathe and pivot into "{activeEntry.geneKeys.gift}" to unlock sovereign resolution.
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ASTEROIDS & MOONS */}
          {activeDossierTab === 'ASTEROIDS_MOONS' && (
            <div className="space-y-5">
              {/* Asteroids */}
              <div className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-4 space-y-3">
                <h4 className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Active Major Asteroids Telemetry
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeEntry.celestialMoonsAndAsteroids.activeAsteroids.map((ast) => (
                    <div key={ast.name} className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xs">{ast.name}</span>
                        <span className="text-cyan-400 text-[10px]">{ast.sign}</span>
                      </div>
                      <p className="text-gray-400 text-[10px] mt-1">{ast.theme}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moons of the Solar System */}
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-4 space-y-3">
                <h4 className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5" />
                  Planetary Moons of the Solar System Telemetry
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeEntry.celestialMoonsAndAsteroids.otherMoonsTelemetry.map((m) => (
                    <div key={m.moon} className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xs">[{m.system}] Moon {m.moon}</span>
                        <span className="text-[10px] text-amber-300">Tidal Stress Pulse</span>
                      </div>
                      <p className="text-gray-400 text-[10px] mt-1">{m.energeticQuality}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TERRESTRIAL FIELD GRID */}
          {activeDossierTab === 'TERRESTRIAL' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-[var(--radius-md)] border border-emerald-300/10 bg-emerald-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-emerald-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Selected Planetary Hub: {activeEntry.geographicalResonance.targetLocationName}
                  </span>
                  <span className="text-[10px] text-emerald-400">{activeEntry.geographicalResonance.locationType}</span>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coordinates:</span>
                    <span className="text-white">
                      {activeEntry.geographicalResonance.coordinates.lat.toFixed(2)}°, {activeEntry.geographicalResonance.coordinates.lng.toFixed(2)}°
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Geodetic Zenith:</span>
                    <span className="text-cyan-300 font-medium">{activeEntry.geographicalResonance.localGeodeticZenith}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Local Grid Resonance:</span>
                    <span className="text-emerald-400 font-bold">{activeEntry.geographicalResonance.resonanceAffinity}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[color:var(--line-soft)]">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Intersecting Astrocartography Lines:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeEntry.geographicalResonance.powerLinesIntersecting.map((line, idx) => (
                      <span key={idx} className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.045] px-2 py-0.5 text-[9px] text-[color:var(--temporal-bright)]">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-orange-300/10 bg-orange-300/[0.025] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
                  <span className="text-orange-400 font-bold text-[11px] uppercase">
                    Regional Overcast Dynamics
                  </span>
                  <span className="text-[10px] text-orange-400">Telluric Currents</span>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {activeEntry.geographicalResonance.regionalOvercastVector}
                </p>
                <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-black/10 p-3 text-[10px] text-gray-400">
                  <strong className="text-white block mb-1">Sovereign Geodetic Directive:</strong>
                  When operating within or meditating upon the {activeLocation.name} nexus, orient your intent along the {activeLocation.geodeticMeridian} to anchor the Day's {activeEntry.chinese.dominantWuXing} frequency cleanly into physical matter.
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BIRTH SYNASTRY */}
          {activeDossierTab === 'SYNASTRY' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-emerald-300/10 bg-emerald-300/[0.025] p-4">
                <div>
                  <h4 className="text-white font-bold text-sm">
                    Birth Synastry Affinity Score: {activeEntry.birthSynastry.resonanceWithBirthScore}%
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Calculated against {userName}'s Natal Kin {forecast.birthProfile.mayanKin} and Life Path {forecast.birthProfile.lifePathNumber}.
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-300/50 bg-emerald-300/[0.06] text-lg font-bold text-emerald-400 shadow-[var(--glow-temporal)]">
                  {activeEntry.birthSynastry.resonanceWithBirthScore}%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-[var(--radius-md)] border border-emerald-300/10 bg-emerald-300/[0.025] p-4 space-y-2">
                  <h5 className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Harmonious Alignments
                  </h5>
                  <ul className="space-y-1 text-gray-300 text-[11px]">
                    {activeEntry.birthSynastry.harmoniousInteractions.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[var(--radius-md)] border border-rose-300/10 bg-rose-300/[0.025] p-4 space-y-2">
                  <h5 className="text-rose-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    Karmic Tension Thresholds
                  </h5>
                  <ul className="space-y-1 text-gray-300 text-[11px]">
                    {activeEntry.birthSynastry.karmicTensionWindows.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 mt-0.5">⚠</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-4 space-y-2">
                  <h5 className="text-cyan-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    Actionable Opportunities
                  </h5>
                  <ul className="space-y-1 text-gray-300 text-[11px]">
                    {activeEntry.birthSynastry.actionableOpportunities.map((o, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 mt-0.5">★</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dialectical Fork for the Day */}
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-amber-400 font-bold uppercase text-[11px]">
                    {activeEntry.dialecticalFork.title}
                  </h5>
                  <span className="text-[9px] text-gray-500">Bifurcated Trajectory</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                  <div className="rounded-[var(--radius-sm)] border border-cyan-300/10 bg-cyan-300/[0.025] p-3">
                    <span className="text-cyan-400 font-bold block mb-1">Path A: Thesis</span>
                    <p className="text-gray-300">{activeEntry.dialecticalFork.pathA}</p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-amber-300/10 bg-amber-300/[0.025] p-3">
                    <span className="text-orange-400 font-bold block mb-1">Path B: Antithesis</span>
                    <p className="text-gray-300">{activeEntry.dialecticalFork.pathB}</p>
                  </div>
                </div>
                <div className="rounded-[var(--radius-sm)] border border-emerald-300/15 bg-emerald-300/[0.04] p-3 text-[11px]">
                  <span className="text-emerald-400 font-bold block mb-1">The Alchemical Synthesis:</span>
                  <p className="text-emerald-200">{activeEntry.dialecticalFork.synthesis}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: NOVELISTIC FORECAST */}
          {activeDossierTab === 'NARRATIVE' && (
            <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
                <h4 className="text-base font-serif text-white tracking-wide">
                  Novelistic Daily Forecast: {activeEntry.gregorianFormatted}
                </h4>
                <span className="data-readout font-bold">
                  {activeEntry.resonanceArchetype}
                </span>
              </div>
              <div className="text-gray-300 font-serif text-sm leading-relaxed space-y-3 whitespace-pre-line">
                {activeEntry.dailyNovelisticForecast}
              </div>
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-4 text-xs text-gray-400">
                <strong className="text-cyan-300 block mb-1">Sovereign Golden Thread for Day {activeDayIndex + 1}:</strong>
                "Stand immovably in your own center. When the celestial gears turn and external currents roar, the sovereign sovereignly chooses what to absorb and what to let wash past the stone."
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
