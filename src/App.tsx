/**
 * The Crucible — Master Application Root
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArchetypalMatrixPanel } from './components/ArchetypalMatrixPanel';
import { AstrocartographyMap } from './components/AstrocartographyMap';
import { CalendarComparisonGrid } from './components/CalendarComparisonGrid';
import { ConversationalCompass } from './components/ConversationalCompass';
import { DiagnosticMicroTestsModal } from './components/DiagnosticMicroTestsModal';
import { DreamspellSynchronometerPanel } from './components/DreamspellSynchronometerPanel';
import { GearsVisualizer } from './components/GearsVisualizer';
import { PlanetaryEphemerisWidget } from './components/PlanetaryEphemerisWidget';
import { ReportExportModal } from './components/ReportExportModal';
import { SecureDashboardHeader } from './components/SecureDashboardHeader';
import { CompactContextBar } from './components/CompactContextBar';
import { TotalSystemsReportPanel } from './components/TotalSystemsReportPanel';
import { LongTermResonancePanel } from './components/LongTermResonancePanel';
import { EnochianBiblicalPanel } from './components/EnochianBiblicalPanel';
import { ProfileWhatChangedPanel } from './components/ProfileWhatChangedPanel';
import { CompatibilityAtlasPanel } from './components/CompatibilityAtlasPanel';
import { TransitsProgressionsPanel } from './components/TransitsProgressionsPanel';
import { executeCrucibleCalculation } from './engine/crucibleCore';
import { CompleteCalculationContext, LocationCoordinates, TemporalInput } from './types';
import { TodayScreen } from './components/TodayScreen';
import { AppNavRail, MobileTabBar } from './components/navigation/AppNavigation';
import { EXPLORE_TABS, ExploreTab, PrimaryDestination } from './app/viewModel';
import { getActiveProfile } from './engine/crucibleProfile';
import { synthesizeDailyBearing } from './engine/editorialSynthesis';
import { loadInsights } from './engine/savedInsights';
import { NatalChartPanel } from './components/chart/NatalChartPanel';
import { DreamspellCalendarWorkspace } from './components/calendar/DreamspellCalendarWorkspace';

export default function App() {
  const [primary, setPrimary] = useState<PrimaryDestination>('TODAY');
  const [exploreTab, setExploreTab] = useState<ExploreTab>('SYSTEMS');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isGearSpinning, setIsGearSpinning] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [enochianMapFlip, setEnochianMapFlip] = useState<boolean>(false);
  const [profileTick, setProfileTick] = useState(0);

  const [correlationKey, setCorrelationKey] = useState<'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384'>('GMT_584283');

  const [temporalInput, setTemporalInput] = useState<TemporalInput>(() => {
    const now = new Date();
    return {
      dateString: now.toISOString().slice(0, 10),
      timeString: now.toTimeString().slice(0, 8),
      timezoneOffsetMinutes: now.getTimezoneOffset(),
      isUTC: false,
      location: {
        latitude: 31.778,
        longitude: 35.2354,
        city: 'Jerusalem'
      },
      querentName: '',
      methodology: {
        includeVedic: true,
        includeGaiaOverlay: true
      }
    };
  });

  const calculationContext = useMemo<CompleteCalculationContext>(() => {
    return executeCrucibleCalculation(temporalInput, correlationKey);
  }, [temporalInput, correlationKey]);

  const profile = useMemo(() => {
    void profileTick;
    return typeof window === 'undefined' ? null : getActiveProfile();
  }, [profileTick]);

  const localPreview = useMemo(
    () => synthesizeDailyBearing(calculationContext, 'overview', profile).localContext,
    [calculationContext, profile]
  );

  useEffect(() => {
    if (!isStreaming) return;
    const timer = setInterval(() => {
      const now = new Date();
      setTemporalInput((prev) => ({
        ...prev,
        dateString: now.toISOString().slice(0, 10),
        timeString: now.toTimeString().slice(0, 8)
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [isStreaming]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [primary, exploreTab]);

  const handleLocationSelect = (loc: LocationCoordinates) => {
    setTemporalInput((prev) => ({
      ...prev,
      location: loc
    }));
  };

  const goExplore = (tab: ExploreTab) => {
    setExploreTab(tab);
    setPrimary('EXPLORE');
  };

  const savedCount = typeof window === 'undefined' ? 0 : loadInsights().length;

  return (
    <div className="min-h-screen crucible-atmosphere flex relative">
      <AppNavRail current={primary} onChange={setPrimary} />

      <div className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-0">
        <SecureDashboardHeader
          ctx={calculationContext}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        />

        <main className="app-main flex-1 w-full px-4 md:px-6 lg:px-8 py-5 md:py-8 space-y-6 md:space-y-8">
          <CompactContextBar
            ctx={calculationContext}
            local={localPreview}
            isStreaming={isStreaming}
            onToggleStreaming={() => setIsStreaming((prev) => !prev)}
            correlationKey={correlationKey}
            onCorrelationChange={setCorrelationKey}
            onInputChange={(newInput, newCorr) => {
              setTemporalInput(newInput);
              if (newCorr) setCorrelationKey(newCorr);
            }}
          />

          {primary === 'TODAY' && (
            <TodayScreen
              ctx={calculationContext}
              profile={profile}
              onOpenCodex={() => setIsExportOpen(true)}
              onOpenCompass={() => goExplore('COMPASS')}
              onOpenYou={() => setPrimary('YOU')}
              onOpenExplore={() => goExplore('CALENDARS')}
            />
          )}

          {primary === 'YOU' && (
            <div className="space-y-5">
              <div className="instrument-panel">
                <p className="ui-eyebrow text-[color:var(--solar-deep)]">Your pattern</p>
                <h2 className="panel-title mt-1">Birth chart, transits, and saved reflections</h2>
                <p className="font-garamond text-[17px] text-[color:var(--text-secondary)] mt-3 max-w-2xl">
                  {profile
                    ? `${profile.displayName || profile.querentName} is the active profile. Missing or approximate birth time keeps houses and angles limited.`
                    : 'Create a profile with your city and optional birth details. Today still works without this — it just stays a shared reading.'}
                </p>
                {savedCount > 0 && (
                  <p className="text-sm text-[color:var(--text-muted)] mt-2">{savedCount} saved insight{savedCount === 1 ? '' : 's'} on this device.</p>
                )}
              </div>
              <NatalChartPanel profile={profile} correlationKey={correlationKey} />
              <TransitsProgressionsPanel
                transitCtx={calculationContext}
                correlationKey={correlationKey}
                refreshKey={profileTick}
              />
              <CompatibilityAtlasPanel correlationKey={correlationKey} />
              <ProfileWhatChangedPanel
                transitCtx={calculationContext}
                correlationKey={correlationKey}
                onLoadBirthIntoTransit={(birth, name) => {
                  setIsStreaming(false);
                  setTemporalInput({ ...birth, querentName: name });
                  setProfileTick((n) => n + 1);
                }}
                onApplyDate={(dateStr) => {
                  setIsStreaming(false);
                  setTemporalInput((prev) => ({ ...prev, dateString: dateStr }));
                }}
                onProfilesChanged={() => setProfileTick((n) => n + 1)}
              />
            </div>
          )}

          {primary === 'TIMELINE' && (
            <div className="space-y-4">
              <div className="instrument-panel">
                <p className="ui-eyebrow">Next 14 days</p>
                <h2 className="panel-title mt-1">How the atmosphere moves forward</h2>
              </div>
              <LongTermResonancePanel
                ctx={calculationContext}
                onDateSelect={(dateStr) => {
                  setTemporalInput((prev) => ({ ...prev, dateString: dateStr }));
                  setPrimary('TODAY');
                }}
              />
            </div>
          )}

          {primary === 'EXPLORE' && (
            <div className="space-y-5">
              <nav className="flex items-center gap-0.5 overflow-x-auto pb-0.5" aria-label="Explore">
                {EXPLORE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setExploreTab(tab.id)}
                    className={`nav-tab whitespace-nowrap ${exploreTab === tab.id ? 'nav-tab-active' : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {exploreTab === 'SYSTEMS' && (
                <div className="space-y-6 md:space-y-8">
                  <GearsVisualizer
                    ctx={calculationContext}
                    isPlaying={isGearSpinning}
                    onTogglePlay={() => setIsGearSpinning((prev) => !prev)}
                  />
                  <PlanetaryEphemerisWidget ctx={calculationContext} />
                  <DreamspellSynchronometerPanel ctx={calculationContext} />
                  <CalendarComparisonGrid ctx={calculationContext} />
                  <ArchetypalMatrixPanel ctx={calculationContext} />
                </div>
              )}

              {exploreTab === 'CALENDARS' && (
                <div className="space-y-6">
                  <DreamspellCalendarWorkspace ctx={calculationContext} />
                  <DreamspellSynchronometerPanel ctx={calculationContext} />
                </div>
              )}

              {exploreTab === 'REPORT' && <TotalSystemsReportPanel currentCtx={calculationContext} />}

              {exploreTab === 'GEARS' && (
                <div className="space-y-4">
                  <GearsVisualizer
                    ctx={calculationContext}
                    isPlaying={isGearSpinning}
                    onTogglePlay={() => setIsGearSpinning((prev) => !prev)}
                  />
                  <div className="instrument-panel">
                    <p className="ui-eyebrow text-[color:var(--temporal)]">Observatory</p>
                    <h3 className="panel-title mt-1">Calendar Round dynamics</h3>
                    <p className="font-garamond italic text-[17px] text-[color:var(--text-secondary)] mt-3 leading-relaxed max-w-4xl">
                      This view is for inspecting interlocking cycles after you have a daily bearing. It is a diagram, not the home reading.
                    </p>
                  </div>
                </div>
              )}

              {exploreTab === 'MAP' && (
                <AstrocartographyMap
                  lines={calculationContext.astrocartographyLines}
                  bodies={calculationContext.celestialBodies}
                  currentLocation={temporalInput.location}
                  onLocationSelect={handleLocationSelect}
                  enochianFlip={enochianMapFlip}
                  onEnochianFlipChange={setEnochianMapFlip}
                  enochianOrientation={calculationContext.enochianBiblical.compassOrientation}
                />
              )}

              {exploreTab === 'ENOCHIAN' && (
                <EnochianBiblicalPanel
                  ctx={calculationContext}
                  mapFlipEnabled={enochianMapFlip}
                  onEnableMapFlip={(enabled) => {
                    setEnochianMapFlip(enabled);
                    if (enabled) goExplore('MAP');
                  }}
                />
              )}

              {exploreTab === 'COMPASS' && <ConversationalCompass ctx={calculationContext} />}
            </div>
          )}
        </main>

        <footer className="border-t border-[color:var(--line-soft)] bg-[color:var(--void-950)]/80 backdrop-blur-md py-3 px-4 md:px-6 lg:px-8">
          <div className="w-full flex flex-wrap items-center justify-between gap-2 text-[12px] text-[color:var(--text-muted)]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rotate-45 bg-[color:var(--temporal)] motion-glow" />
              <span className="font-medium text-[color:var(--text-secondary)]">Crucible ledger</span>
              <span className="data-readout">[{calculationContext.calculationId}]</span>
            </div>
            <div className="flex items-center gap-4">
              <span>
                Latency{' '}
                <strong className="text-[color:var(--temporal-bright)] font-normal data-readout">
                  {calculationContext.executionDurationMs} ms
                </strong>
              </span>
              <span>
                Ruleset{' '}
                <strong className="text-[color:var(--text-secondary)] font-normal data-readout">
                  {calculationContext.rulesetHash}
                </strong>
              </span>
            </div>
          </div>
        </footer>
      </div>

      <MobileTabBar current={primary} onChange={setPrimary} />

      <ReportExportModal
        ctx={calculationContext}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <DiagnosticMicroTestsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />
    </div>
  );
}
