/**
 * Free geocoding via OpenStreetMap Nominatim (no API key).
 * Respect Nominatim usage policy: identify app; cache results; don't hammer.
 */

export interface GeocodeResult {
  displayName: string;
  latitude: number;
  longitude: number;
  city: string;
  country?: string;
}

const cache = new Map<string, GeocodeResult[]>();

export async function geocodeNominatim(query: string, limit = 5): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const key = `${q.toLowerCase()}|${limit}`;
  if (cache.has(key)) return cache.get(key)!;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=${limit}&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      // Nominatim requires a valid identifying User-Agent in browsers via Referer;
      // browser fetch cannot set User-Agent — identify via query appname.
    }
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    name?: string;
    address?: { city?: string; town?: string; village?: string; country?: string };
  }>;

  const mapped: GeocodeResult[] = data.map((row) => {
    const city =
      row.address?.city ||
      row.address?.town ||
      row.address?.village ||
      row.name ||
      row.display_name.split(',')[0];
    return {
      displayName: row.display_name,
      latitude: parseFloat(row.lat),
      longitude: parseFloat(row.lon),
      city,
      country: row.address?.country
    };
  });
  cache.set(key, mapped);
  return mapped;
}

/** Static world presets — synced with locationCatalog (offline fallback) */
export const FREE_SANCTUARY_PRESETS: GeocodeResult[] = [
  { displayName: 'World · UTC', latitude: 51.4779, longitude: 0, city: 'World · UTC', country: 'Global' },
  { displayName: 'London, UK', latitude: 51.5074, longitude: -0.1278, city: 'London', country: 'United Kingdom' },
  { displayName: 'New York, USA', latitude: 40.7128, longitude: -74.006, city: 'New York City', country: 'United States' },
  { displayName: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, city: 'Tokyo', country: 'Japan' },
  { displayName: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, city: 'Sydney', country: 'Australia' },
  { displayName: 'São Paulo, Brazil', latitude: -23.5505, longitude: -46.6333, city: 'São Paulo', country: 'Brazil' },
  { displayName: 'Cape Town, South Africa', latitude: -33.9249, longitude: 18.4241, city: 'Cape Town', country: 'South Africa' },
  { displayName: 'Singapore', latitude: 1.3521, longitude: 103.8198, city: 'Singapore', country: 'Singapore' }
];
