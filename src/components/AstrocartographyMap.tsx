/**
 * The Crucible — Astrocartography World Matrix Component
 * Google Maps Platform 3D Navigation & Geo Satellite Imagery Integration
 * High Density Theme: #0a0a0a surfaces, #222 borders, sharp corners,
 * accurate geodesic lines (MC, IC, ASC, DSC), sanctuary nodes, parans, and 3D camera flight.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { AstrocartographyLine, CelestialCoordinate, LocationCoordinates, SanctuaryNode, EnochianCompassOrientation } from '../types';
import { SANCTUARY_NODES } from '../engine/astrocartography';
import { GoogleMapPolyline } from './GoogleMapPolyline';
import { GoogleMapCameraController } from './GoogleMapCameraController';
import {
  Compass,
  Globe,
  Layers,
  RotateCw,
  RotateCcw,
  Maximize2,
  Key,
  Eye,
  Crosshair,
  ExternalLink,
  Shield,
  Info,
  Navigation2,
  FlipHorizontal2
} from 'lucide-react';

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
  // State for API Key & Map Configuration
  const defaultApiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const [apiKey, setApiKey] = useState<string>(defaultApiKey);

  const [showKeyInput, setShowKeyInput] = useState<boolean>(!defaultApiKey);
  const [tempKeyInput, setTempKeyInput] = useState<string>('');

  const [mapProvider, setMapProvider] = useState<'google' | 'osm' | 'vector'>(
    defaultApiKey ? 'google' : 'osm'
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
        city: `Probe (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
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
      city: `Probe (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
    });
  };

  return (
    <div className="instrument-panel motion-enter !p-4 space-y-4 text-[color:var(--text-secondary)]">
      {/* Top Header & Map Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--line-soft)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-[var(--radius-md)] border border-cyan-300/20 bg-cyan-300/[0.06] p-2 text-[color:var(--temporal)] shadow-[var(--glow-temporal)]">
            <Globe className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="panel-title">
                Astrocartography Geodetic Matrix
              </h3>
              <span className="ui-eyebrow rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2 py-1 text-[color:var(--temporal-bright)]">
                Google Geo 3D Satellite
              </span>
            </div>
            <p className="ui-eyebrow mt-1">
              Precision Geodesic Meridian (MC/IC) & Horizon (ASC/DSC) Great Circles
            </p>
          </div>
        </div>

        {/* Action Buttons & 3D Camera Controls */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <div className="flex rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-1">
            {(
              [
                { id: 'osm' as const, label: 'OSM Free' },
                { id: 'vector' as const, label: 'Vector' },
                { id: 'google' as const, label: 'Google' }
              ]
            ).map((mode) => (
              <button
                key={mode.id}
                onClick={() => setMapProvider(mode.id)}
                className={`nav-tab !px-2 !py-1 text-[10px] uppercase ${
                  mapProvider === mode.id
                    ? 'nav-tab-active bg-amber-300/[0.06] text-[color:var(--solar-bright)]'
                    : ''
                }`}
                title="Map provider — OSM requires no API key"
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Map Type Mode Switcher */}
          <div className="flex rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-1">
            {(
              [
                { id: 'hybrid', label: '3D Satellite' },
                { id: 'satellite', label: 'Pure Space' },
                { id: 'roadmap', label: 'Night Vector' },
                { id: 'terrain', label: 'Terrain' }
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                onClick={() => setMapTypeId(mode.id)}
                className={`nav-tab !px-2 !py-1 text-[10px] uppercase ${
                  mapTypeId === mode.id
                    ? 'nav-tab-active bg-cyan-300/[0.06]'
                    : ''
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* 3D Tilt & Heading Navigation Toggles */}
          <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-1">
            <button
              onClick={handleTiltToggle}
              className={`nav-tab !px-2 !py-1 text-[9px] uppercase ${
                tilt > 0
                  ? 'nav-tab-active bg-cyan-300/[0.06]'
                  : ''
              }`}
              title="Toggle 3D Horizon Tilt (0° / 45° / 65°)"
            >
              3D Tilt: {tilt}°
            </button>
            <button
              onClick={() => handleRotateHeading(-30)}
              className="cta-ghost min-h-0 p-1.5"
              title="Rotate Heading Orbit Left (-30°)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleRotateHeading(30)}
              className="cta-ghost min-h-0 p-1.5"
              title="Rotate Heading Orbit Right (+30°)"
            >
              <RotateCw className="w-3 h-3" />
            </button>
            <button
              onClick={handleResetNorth}
              className="data-readout px-1.5 py-1 text-[9px]"
              title="Reset True North (0°)"
            >
              N {effectiveHeading}°
            </button>
            <button
              onClick={handleEnochianFlipToggle}
              className={`cta-ghost min-h-0 px-2 py-1 text-[9px] uppercase ${
                enochianFlip
                  ? 'border-amber-300/40 bg-amber-300/[0.08] text-[color:var(--solar-bright)]'
                  : ''
              }`}
              title="Enochian compass directional flip + world map East–West mirror"
            >
              <FlipHorizontal2 className="w-3 h-3" />
              Enoch Flip
            </button>
          </div>

          {/* API Key Modal / Drawer Toggle */}
          <button
            onClick={() => setShowKeyInput((prev) => !prev)}
            className="cta-ghost min-h-0 px-3 py-2 text-[10px]"
            title="Google Maps Platform API Key Configuration"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>{apiKey ? 'API Key Active' : 'Configure Key'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Layer Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3 text-[10px]">
        {/* Line Type Filter */}
        <div className="flex items-center gap-1.5">
          <span className="ui-eyebrow">Power Line:</span>
          <div className="flex rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-black/10 p-1">
            {(['ALL', 'MC', 'IC', 'ASC', 'DSC'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`nav-tab !px-2 !py-1 text-[10px] uppercase ${
                  filterType === t
                    ? 'nav-tab-active bg-cyan-300/[0.06]'
                    : ''
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Planet Filter */}
        <div className="flex items-center gap-2">
          <span className="ui-eyebrow">Planet:</span>
          <select
            value={filterPlanet}
            onChange={(e) => setFilterPlanet(e.target.value)}
            className="field-input py-1.5 text-[10px]"
          >
            <option value="all">All Celestial Bodies ({bodies.length})</option>
            {bodies.slice(0, 8).map((b) => (
              <option key={b.id} value={b.id}>
                {b.symbol} {b.name} ({b.zodiacSign} {b.signDegree.toFixed(0)}°)
              </option>
            ))}
          </select>

          {/* Toggle Sanctuaries & Parans */}
          <button
            onClick={() => setShowSanctuaries((p) => !p)}
            className={`cta-ghost min-h-0 px-2 py-1.5 text-[9px] uppercase ${
              showSanctuaries
                ? 'border-cyan-300/30 bg-cyan-300/[0.07] text-[color:var(--temporal-bright)]'
                : ''
            }`}
          >
            Sanctuary Nodes ({SANCTUARY_NODES.length})
          </button>

          <button
            onClick={() => setShowParans((p) => !p)}
            className={`cta-ghost min-h-0 px-2 py-1.5 text-[9px] uppercase ${
              showParans
                ? 'border-amber-300/30 bg-amber-300/[0.07] text-[color:var(--solar-bright)]'
                : ''
            }`}
          >
            Paran Crossings
          </button>
        </div>
      </div>

      {/* API Key Configuration Notification / Drawer */}
      {showKeyInput && (
        <div className="rounded-[var(--radius-md)] border border-cyan-300/20 bg-cyan-300/[0.045] p-4 text-xs space-y-3 shadow-[var(--glow-temporal)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase text-[11px]">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Maps Platform 3D Satellite Imagery Setup</span>
            </div>
            <button
              onClick={() => setShowKeyInput(false)}
              className="text-gray-400 hover:text-white text-[10px] uppercase font-bold"
            >
              Dismiss
            </button>
          </div>
          <p className="text-gray-300 text-[11px] leading-relaxed">
            To view full 3D Google Geo Satellite imagery, photorealistic tiles, and hardware-accelerated globe navigation, provide a Google Maps Platform API Key (or use the free Maps Demo Key for prototyping).
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <input
              type="text"
              value={tempKeyInput}
              onChange={(e) => setTempKeyInput(e.target.value)}
              placeholder="Paste VITE_GOOGLE_MAPS_API_KEY here..."
              className="field-input flex-1"
            />
            <button
              onClick={() => {
                if (tempKeyInput.trim()) {
                  setApiKey(tempKeyInput.trim());
                  setShowKeyInput(false);
                }
              }}
              className="cta-primary min-h-0 shrink-0 px-4 py-2"
            >
              Activate Google 3D Map
            </button>
            <a
              href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-ghost min-h-0 shrink-0 px-3 py-2 text-[11px] text-[color:var(--solar-bright)]"
            >
              <span>Get Free Demo Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Map Viewer Canvas: Live Google Maps or Geodesic Vector Engine */}
      <div
        className="relative w-full h-[540px] overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--line-medium)] bg-[#050505] shadow-[var(--shadow-raised)]"
        style={{ transform: `scaleX(${mapScaleX})`, transformOrigin: 'center' }}
      >
        {enochianFlip && (
          <div
            className="absolute top-2 left-2 z-20 px-2 py-1 bg-amber-950/90 border border-amber-600 text-amber-200 text-[9px] uppercase font-bold font-mono"
            style={{ transform: `scaleX(${mapScaleX})` }}
          >
            Enochian World Flip Active · Heading {effectiveHeading}° · N→S / E↔W
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
                      <span className="text-[8px] font-mono px-1 py-0.2 bg-black/90 text-cyan-300 border border-cyan-800/80 rounded-xs mt-0.5 whitespace-nowrap opacity-85 group-hover:opacity-100">
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
                    <span className="text-[8px] font-mono px-1 py-0.2 bg-black/90 text-amber-300 border border-amber-500/80 rounded-xs mt-0.5 whitespace-nowrap">
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
              title="OpenStreetMap Free Basemap"
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
            <div className="absolute top-2 left-2 z-20 px-2 py-1 bg-black/80 border border-amber-700 text-amber-200 text-[9px] uppercase font-bold font-mono">
              OSM + Full Line Overlay · Free · Click map to probe
            </div>
            <div className="absolute bottom-2 right-2 z-20 flex gap-1">
              <a
                href={`https://www.openstreetmap.org/#map=3/${currentLocation.latitude}/${currentLocation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-black/80 border border-[#333] text-[9px] text-cyan-300 uppercase font-mono"
              >
                Open full OSM
              </a>
            </div>
          </div>
        ) : (
          /* High-Precision Interactive Geodesic Vector World Canvas (Immediate Zero-Latency Fallback) */
          <div className="relative w-full h-full">
            <div className="absolute top-2 left-2 z-20 px-2 py-1 bg-black/80 border border-cyan-800 text-cyan-200 text-[9px] uppercase font-bold font-mono">
              Free vector canvas · OSM tiles optional via provider toggle
            </div>
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
                        fontSize="8"
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                        className="select-none pointer-events-none"
                      >
                        {line.planetName.slice(0, 3)} {line.lineType}
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

            {/* Overlay Notice when operating in Fallback Geodesic Mode */}
            <div className="pointer-events-none absolute left-3 top-3 max-w-sm rounded-[var(--radius-md)] border border-cyan-300/20 bg-[color:var(--surface-glass)] p-3 shadow-[var(--glow-temporal)] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[10px] uppercase">
                <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Geodesic Vector Matrix Active</span>
              </div>
              <p className="text-[10px] text-gray-300 mt-0.5 leading-relaxed">
                Click "Configure Key" to enable full Google Maps 3D photorealistic satellite imagery and oblique flight controls.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Telemetry & Detailed Inspector Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Panel 1: Active Planetary Corridor */}
        <div className="rounded-[var(--radius-md)] border border-cyan-300/10 border-l-2 border-l-[color:var(--temporal)] bg-cyan-300/[0.025] p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
            <span className="ui-eyebrow">Active Power Line</span>
            {selectedLine && (
              <span
                className="rounded-[var(--radius-sm)] border px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: `${selectedLine.color}15`,
                  borderColor: selectedLine.color,
                  color: selectedLine.color
                }}
              >
                {selectedLine.lineTypeName}
              </span>
            )}
          </div>
          {selectedLine ? (
            <div className="space-y-1 text-[11px]">
              <p className="text-white leading-snug">{selectedLine.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedLine.themes.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-[color:var(--line-soft)] bg-white/[0.035] px-2 py-0.5 text-[9px] text-[color:var(--text-muted)]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <div className="data-readout flex justify-between border-t border-[color:var(--line-soft)] pt-2 text-[9px]">
                <span>Meridian Longitude: <strong className="text-cyan-400">{selectedLine.subSolarLongitude}°</strong></span>
                {selectedLine.declinationDegrees !== undefined && (
                  <span>Declination: <strong className="text-gray-300">{selectedLine.declinationDegrees.toFixed(1)}°</strong></span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic text-[10px]">Click any planetary line to inspect its geodetic archetype.</p>
          )}
        </div>

        {/* Panel 2: Geographic Probe & Closest Corridors */}
        <div className="rounded-[var(--radius-md)] border border-amber-300/10 border-l-2 border-l-[color:var(--solar)] bg-amber-300/[0.025] p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
            <span className="ui-eyebrow">Coordinate Probe</span>
            <span className="data-readout text-[10px] text-[color:var(--solar-bright)]">
              {inspectorCoord.lat >= 0 ? `${inspectorCoord.lat.toFixed(2)}°N` : `${Math.abs(inspectorCoord.lat).toFixed(2)}°S`},{' '}
              {inspectorCoord.lng >= 0 ? `${inspectorCoord.lng.toFixed(2)}°E` : `${Math.abs(inspectorCoord.lng).toFixed(2)}°W`}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-gray-500 uppercase">Closest Planetary Corridors:</p>
            {closestLines.map(({ line, distanceDeg }, idx) => (
              <div
                key={idx}
                className="flex cursor-pointer items-center justify-between rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] p-2 transition-colors hover:border-cyan-300/30"
                onClick={() => {
                  setSelectedLine(line);
                  setSelectedSanctuary(null);
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: line.color }} />
                  <span className="text-[10px] text-white font-bold">{line.lineTypeName}</span>
                </div>
                <span className="data-readout text-[9px]">{distanceDeg}° orb</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Sanctuary Node Dossier */}
        <div className="rounded-[var(--radius-md)] border border-emerald-300/10 border-l-2 border-l-emerald-500 bg-emerald-300/[0.025] p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
            <span className="ui-eyebrow">Sanctuary Dossier</span>
            {selectedSanctuary && (
              <span className="text-emerald-400 font-bold text-[10px]">
                {selectedSanctuary.elevationMeters}m Alt
              </span>
            )}
          </div>
          {selectedSanctuary ? (
            <div className="space-y-1 text-[11px]">
              <div className="font-bold text-white font-serif">{selectedSanctuary.name}</div>
              <div className="ui-eyebrow text-emerald-400">{selectedSanctuary.archetype}</div>
              <p className="text-gray-300 text-[10px] leading-snug">{selectedSanctuary.description}</p>
              <div className="text-[9px] text-gray-500 pt-2 border-t border-[color:var(--line-soft)]">
                Tradition: {selectedSanctuary.tradition}
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-gray-500 space-y-1">
              <p className="italic">Select a Sanctuary Node to view its ancient astronomical alignment and initiate 3D flight.</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {SANCTUARY_NODES.slice(0, 4).map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => flyToSanctuary(s)}
                    className="nav-tab border border-[color:var(--line-soft)] !px-2 !py-1 text-[9px]"
                  >
                    {s.name.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Sanctuary Jump Navigation Ribbon */}
      <div className="pt-3 border-t border-[color:var(--line-soft)] flex flex-wrap items-center gap-1.5 text-[10px]">
        <span className="ui-eyebrow">3D Flight Portals:</span>
        {SANCTUARY_NODES.map((s, idx) => (
          <button
            key={idx}
            onClick={() => flyToSanctuary(s)}
            className={`nav-tab border !px-2 !py-1 text-[10px] ${
              selectedSanctuary?.name === s.name
                ? 'nav-tab-active border-cyan-300/30 bg-cyan-300/[0.07]'
                : 'border-transparent'
            }`}
          >
            {s.name.split(',')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};
