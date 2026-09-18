/**
 * World location catalog — linked across every module (no regional default bias).
 */

import { LocationCoordinates } from '../types';
import { WORLD_DEFAULT_LOCATION } from './defaultLocation';
import { PRESET_LOCATIONS } from './longTermResonance';

export type LocationKind = 'world' | 'continent' | 'country' | 'region' | 'city' | 'island' | 'town' | 'sanctuary';

export interface CatalogLocation {
  id: string;
  label: string;
  kind: LocationKind;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  searchTerms?: string;
}

const EXTRA_CITIES: CatalogLocation[] = [
  { id: 'nyc', label: 'New York City', kind: 'city', region: 'North America', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { id: 'la', label: 'Los Angeles', kind: 'city', region: 'North America', country: 'United States', latitude: 34.0522, longitude: -118.2437 },
  { id: 'chicago', label: 'Chicago', kind: 'city', region: 'North America', country: 'United States', latitude: 41.8781, longitude: -87.6298 },
  { id: 'toronto', label: 'Toronto', kind: 'city', region: 'North America', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { id: 'vancouver', label: 'Vancouver', kind: 'city', region: 'North America', country: 'Canada', latitude: 49.2827, longitude: -123.1207 },
  { id: 'miami', label: 'Miami', kind: 'city', region: 'North America', country: 'United States', latitude: 25.7617, longitude: -80.1918 },
  { id: 'sao_paulo', label: 'São Paulo', kind: 'city', region: 'South America', country: 'Brazil', latitude: -23.5505, longitude: -46.6333 },
  { id: 'buenos_aires', label: 'Buenos Aires', kind: 'city', region: 'South America', country: 'Argentina', latitude: -34.6037, longitude: -58.3816 },
  { id: 'bogota', label: 'Bogotá', kind: 'city', region: 'South America', country: 'Colombia', latitude: 4.711, longitude: -74.0721 },
  { id: 'lima', label: 'Lima', kind: 'city', region: 'South America', country: 'Peru', latitude: -12.0464, longitude: -77.0428 },
  { id: 'mumbai', label: 'Mumbai', kind: 'city', region: 'South Asia', country: 'India', latitude: 19.076, longitude: 72.8777 },
  { id: 'delhi', label: 'Delhi', kind: 'city', region: 'South Asia', country: 'India', latitude: 28.7041, longitude: 77.1025 },
  { id: 'bangkok', label: 'Bangkok', kind: 'city', region: 'Southeast Asia', country: 'Thailand', latitude: 13.7563, longitude: 100.5018 },
  { id: 'singapore', label: 'Singapore', kind: 'city', region: 'Southeast Asia', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { id: 'jakarta', label: 'Jakarta', kind: 'city', region: 'Southeast Asia', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { id: 'seoul', label: 'Seoul', kind: 'city', region: 'East Asia', country: 'South Korea', latitude: 37.5665, longitude: 126.978 },
  { id: 'shanghai', label: 'Shanghai', kind: 'city', region: 'East Asia', country: 'China', latitude: 31.2304, longitude: 121.4737 },
  { id: 'hong_kong', label: 'Hong Kong', kind: 'city', region: 'East Asia', country: 'China', latitude: 22.3193, longitude: 114.1694 },
  { id: 'dubai', label: 'Dubai', kind: 'city', region: 'Middle East', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
  { id: 'istanbul', label: 'Istanbul', kind: 'city', region: 'Middle East', country: 'Türkiye', latitude: 41.0082, longitude: 28.9784 },
  { id: 'cairo', label: 'Cairo', kind: 'city', region: 'Africa', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { id: 'lagos', label: 'Lagos', kind: 'city', region: 'Africa', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792 },
  { id: 'nairobi', label: 'Nairobi', kind: 'city', region: 'Africa', country: 'Kenya', latitude: -1.2921, longitude: 36.8219 },
  { id: 'cape_town', label: 'Cape Town', kind: 'city', region: 'Africa', country: 'South Africa', latitude: -33.9249, longitude: 18.4241 },
  { id: 'berlin', label: 'Berlin', kind: 'city', region: 'Europe', country: 'Germany', latitude: 52.52, longitude: 13.405 },
  { id: 'madrid', label: 'Madrid', kind: 'city', region: 'Europe', country: 'Spain', latitude: 40.4168, longitude: -3.7038 },
  { id: 'amsterdam', label: 'Amsterdam', kind: 'city', region: 'Europe', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041 },
  { id: 'stockholm', label: 'Stockholm', kind: 'city', region: 'Europe', country: 'Sweden', latitude: 59.3293, longitude: 18.0686 },
  { id: 'moscow', label: 'Moscow', kind: 'city', region: 'Europe', country: 'Russia', latitude: 55.7558, longitude: 37.6173 },
  { id: 'auckland', label: 'Auckland', kind: 'city', region: 'Oceania', country: 'New Zealand', latitude: -36.8509, longitude: 174.7645 },
  { id: 'melbourne', label: 'Melbourne', kind: 'city', region: 'Oceania', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
  { id: 'bali', label: 'Bali', kind: 'island', region: 'Southeast Asia', country: 'Indonesia', latitude: -8.4095, longitude: 115.1889 },
  { id: 'hawaii', label: 'Honolulu', kind: 'island', region: 'Pacific', country: 'United States', latitude: 21.3069, longitude: -157.8583 },
  { id: 'reykjavik', label: 'Reykjavík', kind: 'town', region: 'Europe', country: 'Iceland', latitude: 64.1466, longitude: -21.9426 },
  { id: 'santorini', label: 'Santorini', kind: 'island', region: 'Europe', country: 'Greece', latitude: 36.3932, longitude: 25.4615 },
  { id: 'maui', label: 'Maui', kind: 'island', region: 'Pacific', country: 'United States', latitude: 20.7984, longitude: -156.3319 }
];

function presetToCatalog(p: (typeof PRESET_LOCATIONS)[0]): CatalogLocation {
  const kind: LocationKind =
    p.type === 'CONTINENT' ? 'continent' : p.type === 'SANCTUARY' ? 'sanctuary' : 'city';
  return {
    id: p.id,
    label: p.name,
    kind,
    region: p.countryOrRegion,
    country: p.countryOrRegion,
    latitude: p.lat,
    longitude: p.lng,
    searchTerms: `${p.name} ${p.countryOrRegion} ${p.leyLineNode}`.toLowerCase()
  };
}

export const WORLD_CATALOG_ENTRY: CatalogLocation = {
  id: 'world_utc',
  label: 'World · UTC (global sky)',
  kind: 'world',
  region: 'Global',
  country: 'Global',
  latitude: WORLD_DEFAULT_LOCATION.latitude,
  longitude: WORLD_DEFAULT_LOCATION.longitude
};

export const LOCATION_CATALOG: CatalogLocation[] = [
  WORLD_CATALOG_ENTRY,
  ...PRESET_LOCATIONS.map(presetToCatalog),
  ...EXTRA_CITIES
];

export function catalogRegions(): string[] {
  const set = new Set(LOCATION_CATALOG.map((l) => l.region));
  return ['Global', ...Array.from(set).filter((r) => r !== 'Global').sort()];
}

export function catalogCountries(region: string): string[] {
  const rows = LOCATION_CATALOG.filter((l) => l.region === region || (region === 'Global' && l.kind === 'world'));
  return Array.from(new Set(rows.map((l) => l.country))).sort();
}

export function catalogPlaces(region: string, country: string): CatalogLocation[] {
  return LOCATION_CATALOG.filter((l) => {
    if (l.kind === 'world') return region === 'Global';
    return l.region === region && l.country === country;
  }).sort((a, b) => a.label.localeCompare(b.label));
}

export function findCatalogLocation(id: string): CatalogLocation | undefined {
  return LOCATION_CATALOG.find((l) => l.id === id);
}

export function catalogLocationToCoordinates(loc: CatalogLocation): LocationCoordinates {
  return {
    latitude: loc.latitude,
    longitude: loc.longitude,
    city: loc.label,
    country: loc.country
  };
}

export function nearestCatalogLocation(lat: number, lng: number): CatalogLocation {
  let best = WORLD_CATALOG_ENTRY;
  let bestDist = Infinity;
  for (const loc of LOCATION_CATALOG) {
    const d = (loc.latitude - lat) ** 2 + (loc.longitude - lng) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = loc;
    }
  }
  return best;
}

export function matchCatalogFromCoordinates(loc: LocationCoordinates): CatalogLocation {
  const hit = LOCATION_CATALOG.find(
    (c) =>
      Math.abs(c.latitude - loc.latitude) < 0.02 &&
      Math.abs(c.longitude - loc.longitude) < 0.02 &&
      (loc.city ? c.label.includes(loc.city.split(' ·')[0]) || loc.city.includes(c.label) : true)
  );
  return hit || nearestCatalogLocation(loc.latitude, loc.longitude);
}
