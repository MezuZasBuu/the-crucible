/**
 * The Crucible — world map of planet lines.
 * Shows where each planet is overhead (MC), underfoot (IC), rising (ASC) or setting (DSC),
 * on a satellite map when available, otherwise on the built-in street or outline map.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { AstrocartographyLine, CelestialCoordinate, LocationCoordinates, SanctuaryNode, EnochianCompassOrientation } from '../types';
import { SANCTUARY_NODES } from '../engine/astrocartography';
import { GoogleMapPolyline } from './GoogleMapPolyline';
import { GoogleMapCameraController } from './GoogleMapCameraController';
import { RotateCw, RotateCcw, FlipHorizontal2 } from 'lucide-react';
import { CultureHeader } from './symbols/CultureSymbols';
import { PlanetGlyph } from './symbols/AstroGlyph';

/** Plain word for each of the four line types. */
const LINE_WORD: Record<'MC' | 'IC' | 'ASC' | 'DSC', string> = {
  MC: 'overhead',
  IC: 'underfoot',
  ASC: 'rising',
  DSC: 'setting'
};

const LINE_FILTERS: ReadonlyArray<{ id: 'ALL' | 'MC' | 'IC' | 'ASC' | 'DSC'; label: string }> = [
  { id: 'ALL', label: 'All' },
  { id: 'MC', label: 'Overhead (MC)' },
  { id: 'IC', label: 'Underfoot (IC)' },
  { id: 'ASC', label: 'Rising (ASC)' },
  { id: 'DSC', label: 'Setting (DSC)' }
];

/** "Sun overhead", "Moon rising" … */
const lineLabel = (line: AstrocartographyLine) => `${line.planetName} ${LINE_WORD[line.lineType]}`;

const formatLatLng = (lat: number, lng: number) =>
  `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}`;

interface AstrocartographyMapProps {
  lines: AstrocartographyLine[];
  bodies: CelestialCoordinate[];
  currentLocation: LocationCoordinates;
  onLocationSelect: (loc: LocationCoordinates) => void;
  enochianFlip?: boolean;
  onEnochianFlipChange?: (enabled: boolean) => void;
  enochianOrientation?: EnochianCompassOrientation;
}

export const AstrocartographyMap: React.FC<AstrocartographyMapProps> = ({
  lines,
  bodies,
  currentLocation,
  onLocationSelect,
  enochianFlip = false,
  onEnochianFlipChange,
  enochianOrientation
}) => {
  // Google Maps only when the service provides a key at build/deploy time — never user-entered.
  const apiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const googleMapsAvailable = Boolean(apiKey);

  const [mapProvider, setMapProvider] = useState<'google' | 'osm' | 'vector'>(
    googleMapsAvailable ? 'google' : 'osm'
  );
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('hybrid');
  const [tilt, setTilt] = useState<number>(45);
  const [heading, setHeading] = useState<number>(0);
  const [flightTarget, setFlightTarget] = useState<{ lat: number; lng: number; zoom?: number; tilt?: number; heading?: number } | null>(null);

  // Filter & Inspection State
  const [selectedLine, setSelectedLine] = useState<AstrocartographyLine | null>(lines[0] || null);
  const [filterType, setFilterType] = useState<'ALL' | 'MC' | 'IC' | 'ASC' | 'DSC'>('ALL');
  const [filterPlanet, setFilterPlanet] = useState<string>('all');
  const [selectedSanctuary, setSelectedSanctuary] = useState<SanctuaryNode | null>(null);
  const [showSanctuaries, setShowSanctuaries] = useState<boolean>(true);
  const [showParans, setShowParans] = useState<boolean>(true);

  // Inspector Probe Coordinates
  const [inspectorCoord, setInspectorCoord] = useState<{ lat: number; lng: number }>({
    lat: currentLocation.latitude,
    lng: currentLocation.longitude
  });

  // Filter lines based on user selection
  const filteredLines = useMemo(() => {
    return lines.filter((l) => {
      if (filterType !== 'ALL' && l.lineType !== filterType) return false;
      if (filterPlanet !== 'all' && l.planetId !== filterPlanet) return false;
      return true;
    });
  }, [lines, filterType, filterPlanet]);

  // Find nearest planetary lines to current probe
  const closestLines = useMemo(() => {
    if (!inspectorCoord) return [];
    return [...lines]
      .map((l) => {
        let dist = Math.abs(l.subSolarLongitude - inspectorCoord.lng);
        if (dist > 180) dist = 360 - dist;
        return { line: l, distanceDeg: Math.round(dist * 10) / 10 };
      })
      .sort((a, b) => a.distanceDeg - b.distanceDeg)
      .slice(0, 3);
  }, [lines, inspectorCoord]);

  // Handle Map Click on Google Map
  const handleGoogleMapClick = useCallback(
    (e: any) => {
      if (!e.detail || !e.detail.latLng) return;
      const lat = Math.round(e.detail.latLng.lat * 1000) / 1000;
      const lng = Math.round(e.detail.latLng.lng * 1000) / 1000;
      setInspectorCoord({ lat, lng });
      setSelectedSanctuary(null);
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        city: `Map point (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
      });
    },
    [onLocationSelect]
  );

  // Fly to specific Sanctuary
  const flyToSanctuary = (s: SanctuaryNode) => {
    setSelectedSanctuary(s);
    setInspectorCoord({ lat: s.lat, lng: s.lng });
    setFlightTarget({
      lat: s.lat,
      lng: s.lng,
      zoom: 7,
      tilt: 45,
      heading: 25
    });
    onLocationSelect({
      latitude: s.lat,
      longitude: s.lng,
      elevationMeters: s.elevationMeters,
      city: s.name
    });
  };

  // 3D Navigation Handlers
  const handleTiltToggle = () => {
    setTilt((prev) => (prev === 0 ? 45 : prev === 45 ? 65 : 0));
  };

  const handleRotateHeading = (delta: number) => {
    setHeading((prev) => (prev + delta + 360) % 360);
  };

  const handleResetNorth = () => {
    setHeading(0);
    setTilt(0);
  };

  const handleEnochianFlipToggle = () => {
    onEnochianFlipChange?.(!enochianFlip);
  };

  const effectiveHeading = enochianFlip
    ? (heading + (enochianOrientation?.headingOffsetDegrees ?? 180)) % 360
    : heading;
  const mapScaleX = enochianFlip && enochianOrientation?.mirrorEastWest !== false ? -1 : 1;

  // Fallback equirectangular projection converters for SVG canvas
  const lonToX = (lon: number) => ((lon + 180) / 360) * 1000;
  const latToY = (lat: number) => ((90 - lat) / 180) * 500;
  const xToLon = (x: number) => (x / 1000) * 360 - 180;
  const yToLat = (y: number) => 90 - (y / 500) * 180;

  const handleSvgMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    const lng = Math.round(xToLon(xRatio * 1000) * 100) / 100;
    const lat = Math.round(yToLat(yRatio * 500) * 100) / 100;
    setInspectorCoord({ lat, lng });
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      city: `Map point (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
    });
  };

  return (
    <div className="instrument-panel motion-enter space-y-4">
      <CultureHeader culture="map" title="Where the planets are over the world" />

      <p className="readable-body max-w-3xl">
        Each coloured line shows where a planet is rising, setting, directly overhead or directly underfoot at this
        moment. Click a line to read what astrologers associate with it, or click anywhere on the map to pick a point and
        see which lines pass closest. These are traditions offered for reflection, not predictions.
      </p>

      {!googleMapsAvailable && (
        <p className="chart-note">The satellite map is unavailable, showing the built-in map instead.</p>
      )}

      {/* Map style and view controls */}
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <div className="space-y-1">
          <span className="field-label">Map style</span>
          <div className="seg">
            {(
              [
                { id: 'osm' as const, label: 'Street map' },
                { id: 'vector' as const, label: 'Simple outline' },
                { id: 'google' as const, label: 'Satellite' }
              ]
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  if (mode.id === 'google' && !googleMapsAvailable) return;
                  setMapProvider(mode.id);
                }}
                disabled={mode.id === 'google' && !googleMapsAvailable}
                className={`seg-btn ${mapProvider === mode.id ? 'seg-btn-active' : ''} ${
                  mode.id === 'google' && !googleMapsAvailable ? 'seg-btn-locked cursor-not-allowed' : ''
                }`}
                title={mode.id === 'google' && !googleMapsAvailable ? 'The satellite map is unavailable' : undefined}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {mapProvider === 'google' && googleMapsAvailable && (
          <>
            <div className="space-y-1">
              <span className="field-label">Satellite view</span>
              <div className="seg">
                {(
                  [
                    { id: 'hybrid', label: 'Photo with labels' },
                    { id: 'satellite', label: 'Photo only' },
                    { id: 'roadmap', label: 'Roads' },
                    { id: 'terrain', label: 'Hills and valleys' }
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setMapTypeId(mode.id)}
                    className={`seg-btn ${mapTypeId === mode.id ? 'seg-btn-active' : ''}`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="field-label">Camera</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTiltToggle}
                  className="cta-ghost !min-h-[36px] !px-3 text-sm"
                  title="Tilt the view: flat, 45° or 65°"
                >
                  {tilt === 0 ? 'Tilt: flat' : `Tilt: ${tilt}°`}
                </button>
                <button
                  type="button"
                  onClick={() => handleRotateHeading(-30)}
                  className="cta-ghost !min-h-[36px] !px-2.5"
                  title="Turn the map left"
                  aria-label="Turn the map left"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRotateHeading(30)}
                  className="cta-ghost !min-h-[36px] !px-2.5"
                  title="Turn the map right"
                  aria-label="Turn the map right"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetNorth}
                  className="cta-ghost !min-h-[36px] !px-3 text-sm"
                  title={`The map is turned ${effectiveHeading}° from north`}
                >
                  Reset view
                </button>
              </div>
            </div>
          </>
        )}

        <label className="flex items-center gap-2 cursor-pointer text-sm text-[color:var(--text-primary)] min-h-[36px]">
          <input
            type="checkbox"
            checked={enochianFlip}
            onChange={handleEnochianFlipToggle}
            className="h-4 w-4 accent-[color:var(--solar-deep)]"
          />
          <FlipHorizontal2 className="w-4 h-4 text-[color:var(--text-muted)]" aria-hidden="true" />
          Flipped ancient view (south at top, mirrored)
        </label>
      </div>

      {/* What to show */}
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3 curious-box !p-3">
        <div className="space-y-1">
          <span className="field-label">Show lines where a planet is</span>
          <div className="seg flex-wrap">
            {LINE_FILTERS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterType(t.id)}
                className={`seg-btn ${filterType === t.id ? 'seg-btn-active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <label className="space-y-1">
          <span className="field-label">Planet</span>
          <select value={filterPlanet} onChange={(e) => setFilterPlanet(e.target.value)} className="field-input">
            <option value="all">All planets</option>
            {bodies.slice(0, 8).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} (in {b.zodiacSign})
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-[color:var(--text-primary)] min-h-[42px]">
          <input
            type="checkbox"
            checked={showSanctuaries}
            onChange={() => setShowSanctuaries((p) => !p)}
            className="h-4 w-4 accent-[color:var(--temporal-deep)]"
          />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00c2d1]" aria-hidden="true" />
          Notable places ({SANCTUARY_NODES.length})
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-[color:var(--text-primary)] min-h-[42px]">
          <input
            type="checkbox"
            checked={showParans}
            onChange={() => setShowParans((p) => !p)}
            className="h-4 w-4 accent-[color:var(--solar-deep)]"
          />
          <span className="inline-block w-2.5 h-2.5 rotate-45 bg-[#f59e0b]" aria-hidden="true" />
          Points where two lines cross
        </label>
      </div>

      {/* Main Map Viewer Canvas: Live Google Maps or Geodesic Vector Engine */}
      <div
        className="relative w-full h-[540px] overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--line-medium)] bg-[#050505] shadow-[var(--shadow-raised)]"
        style={{ transform: `scaleX(${mapScaleX})`, transformOrigin: 'center' }}
      >
        {enochianFlip && (
          <div
            className="absolute top-2 left-2 z-20 rounded-md px-2.5 py-1 bg-white/95 border border-[color:var(--line-medium)] text-[color:var(--text-primary)] text-xs font-medium"
            style={{ transform: `scaleX(${mapScaleX})` }}
          >
            Flipped ancient view is on: south is at the top and east and west are swapped
          </div>
        )}
        {mapProvider === 'google' && apiKey ? (
          <APIProvider apiKey={apiKey} libraries={['maps', 'marker', 'geometry']}>
            <Map
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: currentLocation.latitude || 25, lng: currentLocation.longitude || 0 }}
              defaultZoom={2.5}
              mapTypeId={mapTypeId}
              tilt={tilt}
              heading={effectiveHeading}
              onClick={handleGoogleMapClick}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {/* 3D Camera & Flight Controller */}
              <GoogleMapCameraController
                tilt={tilt}
                heading={effectiveHeading}
                triggerFlyTo={flightTarget}
              />

              {/* Render Planetary Geodesic Polylines (MC, IC, ASC, DSC) */}
              {filteredLines.map((line, idx) => {
                if (!line.pathPoints || line.pathPoints.length < 2) return null;
                const isSelected = selectedLine?.lineTypeName === line.lineTypeName;
                return (
                  <GoogleMapPolyline
                    key={`${line.planetId}-${line.lineType}-${idx}`}
                    path={line.pathPoints}
                    strokeColor={line.color}
                    strokeOpacity={isSelected ? 1.0 : line.lineType === 'IC' ? 0.6 : 0.85}
                    strokeWeight={isSelected ? 3.5 : 2}
                    strokePattern={line.lineType === 'IC' ? 'dashed' : 'solid'}
                    geodesic={true}
                    isSelected={isSelected}
                    onClick={() => {
                      setSelectedLine(line);
                      setSelectedSanctuary(null);
                    }}
                  />
                );
              })}

              {/* Render Sanctuary Advanced Markers */}
              {showSanctuaries &&
                SANCTUARY_NODES.map((s, idx) => (
                  <AdvancedMarker
                    key={`sanctuary-${idx}`}
                    position={{ lat: s.lat, lng: s.lng }}
                    title={s.name}
                    onClick={() => flyToSanctuary(s)}
                  >
                    <div className="cursor-pointer group flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform backdrop-blur-xs">
                        <div className="w-2 h-2 rounded-full bg-cyan-300" />
                      </div>
                      <span className="text-xs px-1.5 py-0.5 bg-white/95 text-[#1b1f3b] border border-black/20 rounded mt-0.5 whitespace-nowrap">
                        {s.name.split(',')[0]}
                      </span>
                    </div>
                  </AdvancedMarker>
                ))}

              {/* Render Paran Crossings */}
              {showParans &&
                lines.flatMap((line, lIdx) =>
                  (line.paranCrossings || []).map((paran, pIdx) => (
                    <AdvancedMarker
                      key={`paran-${lIdx}-${pIdx}`}
                      position={{ lat: paran.lat, lng: paran.lng }}
                      title={paran.title}
                      onClick={() => {
                        setInspectorCoord({ lat: paran.lat, lng: paran.lng });
                        setSelectedLine(line);
                      }}
                    >
                      <div className="cursor-pointer flex items-center justify-center w-3.5 h-3.5 bg-amber-500/40 border border-amber-400 rotate-45 group hover:scale-150 transition-transform">
                        <div className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
                      </div>
                    </AdvancedMarker>
                  ))
                )}

              {/* Coordinate Probe Advanced Marker */}
              {inspectorCoord && (
                <AdvancedMarker position={{ lat: inspectorCoord.lat, lng: inspectorCoord.lng }}>
                  <div className="flex flex-col items-center pointer-events-none">
                    <div className="w-6 h-6 rounded-full border-2 border-amber-400 flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    </div>
                    <span className="text-xs px-1.5 py-0.5 bg-white/95 text-[#1b1f3b] border border-black/20 rounded mt-0.5 whitespace-nowrap">
                      {inspectorCoord.lat.toFixed(1)}°, {inspectorCoord.lng.toFixed(1)}°
                    </span>
                  </div>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        ) : mapProvider === 'osm' ? (
          <div className="relative w-full h-full bg-[#050505]">
            <iframe
              title="Street map of the world"
              className="absolute inset-0 w-full h-full border-0 opacity-75 pointer-events-none"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.longitude - 40}%2C${currentLocation.latitude - 25}%2C${currentLocation.longitude + 40}%2C${currentLocation.latitude + 25}&layer=mapnik&marker=${currentLocation.latitude}%2C${currentLocation.longitude}`}
            />
            {/* Full planetary line overlay on OSM — pointer events on SVG */}
            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 w-full h-full cursor-crosshair select-none"
              onClick={handleSvgMapClick}
            >
              {filteredLines.map((line, idx) => {
                const isSelected = selectedLine?.lineTypeName === line.lineTypeName;
                if (line.lineType === 'MC' || line.lineType === 'IC') {
                  const x = lonToX(line.subSolarLongitude);
                  return (
                    <g key={`osm-${line.planetId}-${line.lineType}-${idx}`}>
                      <line
                        x1={x}
                        y1="0"
                        x2={x}
                        y2="500"
                        stroke={line.color}
                        strokeWidth={isSelected ? '3' : '1.6'}
                        strokeDasharray={line.lineType === 'IC' ? '4 4' : 'none'}
                        strokeOpacity={isSelected ? '1' : '0.85'}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLine(line);
                          setSelectedSanctuary(null);
                        }}
                      />
                    </g>
                  );
                }
                if (line.pathPoints && line.pathPoints.length > 0) {
                  const svgPath = line.pathPoints
                    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${lonToX(pt.lng)} ${latToY(pt.lat)}`)
                    .join(' ');
                  return (
                    <path
                      key={`osm-${line.planetId}-${line.lineType}-${idx}`}
                      d={svgPath}
                      stroke={line.color}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      strokeDasharray="3 3"
                      strokeOpacity={isSelected ? '1' : '0.8'}
                      fill="none"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLine(line);
                        setSelectedSanctuary(null);
                      }}
                    />
                  );
                }
                return null;
              })}
              {showSanctuaries &&
                SANCTUARY_NODES.map((s, idx) => (
                  <g
                    key={`osm-s-${idx}`}
                    transform={`translate(${lonToX(s.lng)}, ${latToY(s.lat)})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      flyToSanctuary(s);
                    }}
                  >
                    <title>{s.name}</title>
                    <circle cx="0" cy="0" r="5" fill="#00f0ff" stroke="#fff" strokeWidth="0.8" />
                  </g>
                ))}
              {showParans &&
                lines.flatMap((line, lIdx) =>
                  (line.paranCrossings || []).map((paran, pIdx) => (
                    <g
                      key={`osm-paran-${lIdx}-${pIdx}`}
                      transform={`translate(${lonToX(paran.lng)}, ${latToY(paran.lat)})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectorCoord({ lat: paran.lat, lng: paran.lng });
                        setSelectedLine(line);
                      }}
                    >
                      <rect x="-4" y="-4" width="8" height="8" fill="#f59e0b" fillOpacity="0.5" stroke="#fbbf24" transform="rotate(45)" />
                    </g>
                  ))
                )}
              {inspectorCoord && (
                <g transform={`translate(${lonToX(inspectorCoord.lng)}, ${latToY(inspectorCoord.lat)})`}>
                  <circle cx="0" cy="0" r="10" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
                  <circle cx="0" cy="0" r="4" fill="#f59e0b" />
                </g>
              )}
            </svg>
            {!enochianFlip && (
              <div className="absolute top-2 left-2 z-20 rounded-md px-2.5 py-1 bg-white/95 border border-[color:var(--line-medium)] text-[color:var(--text-primary)] text-xs font-medium">
                Click the map to pick a point
              </div>
            )}
            <div className="absolute bottom-2 right-2 z-20 flex gap-1">
              <a
                href={`https://www.openstreetmap.org/#map=3/${currentLocation.latitude}/${currentLocation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md px-2.5 py-1 bg-white/95 border border-[color:var(--line-medium)] text-xs font-medium text-[color:var(--temporal-deep)]"
              >
                Open in OpenStreetMap
              </a>
            </div>
          </div>
        ) : (
          /* High-Precision Interactive Geodesic Vector World Canvas (Immediate Zero-Latency Fallback) */
          <div className="relative w-full h-full">
            {!enochianFlip && (
              <div className="absolute top-2 left-2 z-20 rounded-md px-2.5 py-1 bg-white/95 border border-[color:var(--line-medium)] text-[color:var(--text-primary)] text-xs font-medium">
                Click the map to pick a point
              </div>
            )}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full cursor-crosshair select-none"
              onClick={handleSvgMapClick}
            >
              {/* Graticule Latitude/Longitude grid */}
              {[-60, -30, 0, 30, 60].map((lat) => (
                <line
                  key={`lat-${lat}`}
                  x1="0"
                  y1={latToY(lat)}
                  x2="1000"
                  y2={latToY(lat)}
                  stroke="#151515"
                  strokeWidth="0.8"
                  strokeDasharray={lat === 0 ? 'none' : '3 3'}
                />
              ))}
              {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => (
                <line
                  key={`lon-${lon}`}
                  x1={lonToX(lon)}
                  y1="0"
                  x2={lonToX(lon)}
                  y2="500"
                  stroke="#151515"
                  strokeWidth="0.8"
                  strokeDasharray={lon === 0 ? 'none' : '3 3'}
                />
              ))}

              {/* Equator & Prime Meridian */}
              <line x1="0" y1={latToY(0)} x2="1000" y2={latToY(0)} stroke="#222" strokeWidth="1" />
              <line x1={lonToX(0)} y1="0" x2={lonToX(0)} y2="500" stroke="#222" strokeWidth="1" />

              {/* Low-poly world continents */}
              <g fill="#0c0d12" stroke="#1d202b" strokeWidth="1">
                {/* North America */}
                <path d="M 120 70 L 220 70 L 260 120 L 240 170 L 210 200 L 190 240 L 170 260 L 140 230 L 110 180 L 90 120 Z" />
                {/* South America */}
                <path d="M 230 260 L 300 270 L 330 330 L 300 420 L 260 450 L 230 380 L 220 310 Z" />
                {/* Europe */}
                <path d="M 450 80 L 550 80 L 540 140 L 490 170 L 450 160 L 440 120 Z" />
                {/* Africa */}
                <path d="M 450 180 L 560 180 L 590 260 L 560 380 L 510 420 L 470 360 L 440 240 Z" />
                {/* Asia */}
                <path d="M 550 70 L 850 70 L 890 150 L 820 250 L 730 280 L 680 230 L 620 220 L 550 150 Z" />
                {/* Australia */}
                <path d="M 760 330 L 850 330 L 860 410 L 780 420 L 750 370 Z" />
              </g>

              {/* Planetary Geodesic Power Lines */}
              {filteredLines.map((line, idx) => {
                const isSelected = selectedLine?.lineTypeName === line.lineTypeName;

                if (line.lineType === 'MC' || line.lineType === 'IC') {
                  const x = lonToX(line.subSolarLongitude);
                  return (
                    <g key={`${line.planetId}-${line.lineType}-${idx}`}>
                      <line
                        x1={x}
                        y1="0"
                        x2={x}
                        y2="500"
                        stroke={line.color}
                        strokeWidth={isSelected ? '2.5' : '1.3'}
                        strokeDasharray={line.lineType === 'IC' ? '4 4' : 'none'}
                        strokeOpacity={isSelected ? '1' : '0.75'}
                        className="cursor-pointer hover:stroke-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLine(line);
                          setSelectedSanctuary(null);
                        }}
                      />
                      <text
                        x={x + 3}
                        y={line.lineType === 'MC' ? 14 : 26}
                        fill={line.color}
                        fontSize="10"
                        fontWeight="600"
                        className="select-none pointer-events-none"
                      >
                        {lineLabel(line)}
                      </text>
                    </g>
                  );
                } else if (line.pathPoints && line.pathPoints.length > 0) {
                  // Render the mathematically accurate spherical horizon curve
                  const svgPath = line.pathPoints
                    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${lonToX(pt.lng)} ${latToY(pt.lat)}`)
                    .join(' ');
                  return (
                    <path
                      key={`${line.planetId}-${line.lineType}-${idx}`}
                      d={svgPath}
                      stroke={line.color}
                      strokeWidth={isSelected ? '2.5' : '1.2'}
                      strokeDasharray="3 3"
                      strokeOpacity={isSelected ? '1' : '0.65'}
                      fill="none"
                      className="cursor-pointer hover:stroke-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLine(line);
                        setSelectedSanctuary(null);
                      }}
                    />
                  );
                }
                return null;
              })}

              {/* Sanctuary Nodes on Canvas */}
              {showSanctuaries &&
                SANCTUARY_NODES.map((s, idx) => {
                  const x = lonToX(s.lng);
                  const y = latToY(s.lat);
                  return (
                    <g
                      key={`sanctuary-node-${idx}`}
                      transform={`translate(${x}, ${y})`}
                      className="cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        flyToSanctuary(s);
                      }}
                    >
                      <title>{s.name}</title>
                      <circle cx="0" cy="0" r="4.5" fill="#00f0ff" stroke="#ffffff" strokeWidth="0.8" />
                      <circle cx="0" cy="0" r="9" fill="none" stroke="#00f0ff" strokeWidth="0.5" className="animate-ping opacity-40" />
                    </g>
                  );
                })}

              {showParans &&
                lines.flatMap((line, lIdx) =>
                  (line.paranCrossings || []).map((paran, pIdx) => (
                    <g
                      key={`vec-paran-${lIdx}-${pIdx}`}
                      transform={`translate(${lonToX(paran.lng)}, ${latToY(paran.lat)})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectorCoord({ lat: paran.lat, lng: paran.lng });
                        setSelectedLine(line);
                      }}
                    >
                      <rect x="-3.5" y="-3.5" width="7" height="7" fill="#f59e0b" fillOpacity="0.45" stroke="#fbbf24" transform="rotate(45)" />
                    </g>
                  ))
                )}

              {/* Inspected Coordinate Probe */}
              {inspectorCoord && (
                <g transform={`translate(${lonToX(inspectorCoord.lng)}, ${latToY(inspectorCoord.lat)})`}>
                  <circle cx="0" cy="0" r="10" stroke="#f59e0b" strokeWidth="1.2" fill="none" className="animate-ping opacity-60" />
                  <circle cx="0" cy="0" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="#f59e0b" strokeWidth="0.8" />
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="#f59e0b" strokeWidth="0.8" />
                </g>
              )}
            </svg>
          </div>
        )}
      </div>

      {/* What is selected */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Selected line */}
        <div className="curious-box space-y-2">
          <p className="ui-eyebrow">Selected line</p>
          {selectedLine ? (
            <>
              <p className="flex items-center gap-2 text-base font-semibold text-[color:var(--text-primary)]">
                <span className="inline-block h-1 w-5 rounded-full" style={{ backgroundColor: selectedLine.color }} aria-hidden="true" />
                <PlanetGlyph planet={selectedLine.planetId} size={18} tinted />
                {lineLabel(selectedLine)}
              </p>
              <p className="readable-muted text-sm">
                Along this line, {selectedLine.planetName} is {LINE_WORD[selectedLine.lineType]} right now. Astrologers
                associate places on it with:
              </p>
              <p className="readable-body text-sm">{selectedLine.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedLine.themes.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-[color:var(--line-soft)] px-2 py-0.5 text-xs text-[color:var(--text-secondary)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <details>
                <summary className="cursor-pointer text-sm text-[color:var(--text-secondary)]">Technical details</summary>
                <dl className="trad-facts mt-2">
                  <dt>Astrology name</dt>
                  <dd>{selectedLine.lineTypeName}</dd>
                  <dt>Longitude</dt>
                  <dd>{selectedLine.subSolarLongitude}°</dd>
                  {selectedLine.declinationDegrees !== undefined && (
                    <>
                      <dt>Angle north or south of the equator</dt>
                      <dd>{selectedLine.declinationDegrees.toFixed(1)}°</dd>
                    </>
                  )}
                </dl>
              </details>
            </>
          ) : (
            <p className="readable-muted text-sm">Click any coloured line on the map to read about it.</p>
          )}
        </div>

        {/* Selected point */}
        <div className="curious-box space-y-2">
          <p className="ui-eyebrow">Selected point</p>
          <p className="text-base font-semibold text-[color:var(--text-primary)]">
            {formatLatLng(inspectorCoord.lat, inspectorCoord.lng)}
          </p>
          <p className="readable-muted text-sm">Nearest planet lines (distance in degrees east or west):</p>
          <div className="space-y-1.5">
            {closestLines.map(({ line, distanceDeg }, idx) => (
              <button
                key={idx}
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded-md border border-[color:var(--line-soft)] px-2.5 py-2 text-left text-sm hover:border-[color:var(--line-bright)]"
                onClick={() => {
                  setSelectedLine(line);
                  setSelectedSanctuary(null);
                }}
              >
                <span className="flex items-center gap-2 font-medium text-[color:var(--text-primary)]">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: line.color }} aria-hidden="true" />
                  {lineLabel(line)}
                </span>
                <span className="text-[color:var(--text-muted)]">{distanceDeg}° away</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected notable place */}
        <div className="curious-box space-y-2">
          <p className="ui-eyebrow">Notable place</p>
          {selectedSanctuary ? (
            <>
              <p className="text-base font-semibold text-[color:var(--text-primary)]">{selectedSanctuary.name}</p>
              <p className="readable-body text-sm">{selectedSanctuary.description}</p>
              <dl className="trad-facts">
                <dt>Height above sea level</dt>
                <dd>{selectedSanctuary.elevationMeters} m</dd>
                <dt>Tradition</dt>
                <dd>{selectedSanctuary.tradition}</dd>
              </dl>
              <details>
                <summary className="cursor-pointer text-sm text-[color:var(--text-secondary)]">Traditional associations</summary>
                <p className="readable-muted text-sm mt-2">{selectedSanctuary.archetype}</p>
              </details>
            </>
          ) : (
            <p className="readable-muted text-sm">
              Choose a place from the list below, or click its dot on the map, to move the map there and read about it.
            </p>
          )}
        </div>
      </div>

      {/* Notable places list */}
      <div className="pt-3 border-t border-[color:var(--line-soft)] space-y-2">
        <p className="field-label">Notable places</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {SANCTUARY_NODES.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => flyToSanctuary(s)}
              className={`explore-tab ${selectedSanctuary?.name === s.name ? 'explore-tab-active' : ''}`}
            >
              {s.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      <p className="readable-muted text-xs">Street map data © OpenStreetMap contributors.</p>
    </div>
  );
};
