/**
 * Time zone for a place and moment — so a birth time typed as local clock time
 * is converted to UTC correctly, including historical daylight-saving rules.
 *
 * Zone lookup: open-source `tz-lookup` (lat/lon → IANA zone, offline).
 * Offset: the platform's own IANA database via Intl.DateTimeFormat.
 */

import tzlookup from 'tz-lookup';

export function zoneForPlace(latitude: number, longitude: number): string | null {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  try {
    return tzlookup(latitude, longitude);
  } catch {
    return null;
  }
}

/** Offset of `zone` from UTC, in minutes east, at the given UTC instant. */
function offsetAtInstant(zone: string, utcMs: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((asUtc - utcMs) / 60000);
}

/**
 * Minutes east of UTC for a local wall-clock time in `zone`
 * (e.g. −240 for New York in summer). Returns null if the zone is unknown.
 */
export function offsetMinutesForLocalTime(zone: string, dateString: string, timeString: string): number | null {
  const [y, m, d] = dateString.split('-').map(Number);
  const [hh = 12, mm = 0, ss = 0] = (timeString || '12:00:00').split(':').map(Number);
  if (!y || !m || !d) return null;
  try {
    const wall = Date.UTC(y, m - 1, d, hh, mm, ss);
    // Two passes settle the offset on either side of a daylight-saving change.
    let offset = offsetAtInstant(zone, wall);
    offset = offsetAtInstant(zone, wall - offset * 60000);
    return offset;
  } catch {
    return null;
  }
}

export function formatUtcOffset(minutesEast: number): string {
  const sign = minutesEast < 0 ? '−' : '+';
  const abs = Math.abs(minutesEast);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}
