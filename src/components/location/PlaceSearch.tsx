/**
 * Type-to-find place picker: instant matches from the built-in list,
 * plus a worldwide search (OpenStreetMap) for anywhere else.
 */

import React, { useMemo, useState } from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
import { LOCATION_CATALOG } from '../../engine/locationCatalog';
import { geocodeNominatim } from '../../engine/freeGeocode';

export interface PickedPlace {
  label: string;
  latitude: number;
  longitude: number;
}

export const PlaceSearch: React.FC<{
  value: string;
  onPick: (place: PickedPlace) => void;
  placeholder?: string;
  inputId?: string;
}> = ({ value, onPick, placeholder = 'Start typing a city or town', inputId }) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [remote, setRemote] = useState<PickedPlace[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => setQuery(value), [value]);

  const local = useMemo<PickedPlace[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return LOCATION_CATALOG.filter(
      (l) => l.kind !== 'world' && (l.label.toLowerCase().includes(q) || l.country.toLowerCase().includes(q) || (l.searchTerms ?? '').toLowerCase().includes(q))
    )
      .slice(0, 6)
      .map((l) => ({ label: `${l.label}, ${l.country}`, latitude: l.latitude, longitude: l.longitude }));
  }, [query]);

  const searchWorld = async () => {
    setBusy(true);
    setError(null);
    try {
      const results = await geocodeNominatim(query, 6);
      setRemote(results.map((r) => ({ label: r.displayName, latitude: r.latitude, longitude: r.longitude })));
      if (!results.length) setError('No places found — try a nearby larger town.');
    } catch {
      setError('Worldwide search is unavailable right now. Pick the nearest city from the list instead.');
    } finally {
      setBusy(false);
    }
  };

  const pick = (p: PickedPlace) => {
    onPick(p);
    setQuery(p.label);
    setOpen(false);
    setRemote(null);
  };

  const options = remote ?? local;

  return (
    <div className="place-search">
      <div className="place-search-row">
        <MapPin className="place-search-icon w-4 h-4" />
        <input
          id={inputId}
          className="field-input w-full place-search-input"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setRemote(null);
            setError(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (options[0]) pick(options[0]);
              else void searchWorld();
            }
          }}
        />
      </div>
      {open && query.trim().length >= 2 && (
        <div className="place-search-menu">
          {options.map((p, i) => (
            <button key={`${p.label}-${i}`} type="button" className="place-search-option" onClick={() => pick(p)}>
              {p.label}
            </button>
          ))}
          <button type="button" className="place-search-world" onClick={searchWorld} disabled={busy}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search the whole world for “{query.trim()}”
          </button>
          {error && <p className="place-search-error">{error}</p>}
        </div>
      )}
    </div>
  );
};
