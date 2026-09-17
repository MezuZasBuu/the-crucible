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

/** Static sanctuary presets — always available offline */
export const FREE_SANCTUARY_PRESETS: GeocodeResult[] = [
  { displayName: 'Jerusalem Sanctuary', latitude: 31.778, longitude: 35.2354, city: 'Jerusalem Sanctuary', country: 'Israel' },
  { displayName: 'Giza Plateau, Egypt', latitude: 29.9792, longitude: 31.1342, city: 'Giza', country: 'Egypt' },
  { displayName: 'Chichen Itza, Mexico', latitude: 20.6843, longitude: -88.5678, city: 'Chichen Itza', country: 'Mexico' },
  { displayName: 'Stonehenge, UK', latitude: 51.1789, longitude: -1.8262, city: 'Stonehenge', country: 'United Kingdom' },
  { displayName: 'Varanasi, India', latitude: 25.3176, longitude: 82.9739, city: 'Varanasi', country: 'India' },
  { displayName: 'Lhasa, Tibet', latitude: 29.652, longitude: 91.172, city: 'Lhasa', country: 'China' },
  { displayName: 'Machu Picchu, Peru', latitude: -13.1631, longitude: -72.545, city: 'Machu Picchu', country: 'Peru' },
  { displayName: 'Delphi, Greece', latitude: 38.4824, longitude: 22.501, city: 'Delphi', country: 'Greece' }
];
