/**
 * Open-source map stacks researched for Crucible astrocartography.
 * TGOLD vector 5 — alternative technical / geospatial knowledge.
 */

export interface MapProviderOption {
  id: string;
  name: string;
  license: string;
  repo: string;
  role: string;
  crucibleUse: string;
}

/** Curated OSS geospatial projects — extract patterns, not wholesale forks. */
export const OPEN_SOURCE_MAP_CATALOG: MapProviderOption[] = [
  {
    id: 'maplibre',
    name: 'MapLibre GL JS',
    license: 'BSD-3-Clause',
    repo: 'https://github.com/maplibre/maplibre-gl-js',
    role: 'Vector tile renderer (Mapbox GL fork)',
    crucibleUse: 'Primary OSS replacement for Google Maps — 3D tilt, custom styles, line overlays for MC/IC/ASC/DSC'
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    license: 'ODbL',
    repo: 'https://github.com/openstreetmap/openstreetmap-website',
    role: 'Community map data + raster tiles',
    crucibleUse: 'Fallback embed when no API key — already wired in AstrocartographyMap'
  },
  {
    id: 'vector',
    name: 'Crucible SVG Equirectangular',
    license: 'Proprietary (in-app)',
    repo: 'internal',
    role: 'Offline vector fallback',
    crucibleUse: 'Zero-dependency astrocartography line preview'
  },
  {
    id: 'openfreemap',
    name: 'OpenFreeMap',
    license: 'Open data tiles',
    repo: 'https://github.com/hyperknot/openfreemap',
    role: 'Free vector tile hosting for MapLibre',
    crucibleUse: 'Style URL for MapLibre without Mapbox billing'
  },
  {
    id: 'cesium',
    name: 'CesiumJS',
    license: 'Apache-2.0',
    repo: 'https://github.com/CesiumGS/cesium',
    role: 'Globe-scale 3D terrain and imagery',
    crucibleUse: 'Future: true 3D sanctuary flight paths and planetary line arcs'
  },
  {
    id: 'protomaps',
    name: 'Protomaps',
    license: 'BSD-3-Clause (client) + tile license',
    repo: 'https://github.com/protomaps/protomaps-leaflet',
    role: 'PMTiles single-file planet tiles',
    crucibleUse: 'Offline-first astrocartography for mobile / low-bandwidth'
  }
];

export const DEFAULT_MAPLIBRE_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export function recommendMapProvider(hasGoogleKey: boolean): string {
  if (hasGoogleKey) return 'google';
  return 'maplibre';
}
