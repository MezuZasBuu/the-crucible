/**
 * World location picker — region → country → place dropdowns, minimal typing.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { LocationCoordinates } from '../../types';
import {
  catalogCountries,
  catalogPlaces,
  catalogRegions,
  catalogLocationToCoordinates,
  findCatalogLocation,
  matchCatalogFromCoordinates,
  WORLD_CATALOG_ENTRY
} from '../../engine/locationCatalog';

interface LocationPickerProps {
  value: LocationCoordinates;
  onChange: (loc: LocationCoordinates) => void;
  compact?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, compact = false }) => {
  const matched = useMemo(() => matchCatalogFromCoordinates(value), [value.latitude, value.longitude, value.city]);

  const [region, setRegion] = useState(matched.region);
  const [country, setCountry] = useState(matched.country);
  const [placeId, setPlaceId] = useState(matched.id);

  useEffect(() => {
    const m = matchCatalogFromCoordinates(value);
    setRegion(m.region);
    setCountry(m.country);
    setPlaceId(m.id);
  }, [value.latitude, value.longitude, value.city]);

  const countries = useMemo(() => catalogCountries(region), [region]);
  const places = useMemo(() => catalogPlaces(region, country), [region, country]);

  useEffect(() => {
    if (!countries.includes(country) && countries[0]) setCountry(countries[0]);
  }, [region, countries, country]);

  useEffect(() => {
    if (!places.find((p) => p.id === placeId) && places[0]) setPlaceId(places[0].id);
  }, [region, country, places, placeId]);

  const applyPlace = (id: string) => {
    setPlaceId(id);
    const loc = findCatalogLocation(id) || WORLD_CATALOG_ENTRY;
    onChange(catalogLocationToCoordinates(loc));
  };

  const selectClass = compact ? 'field-select field-select-compact' : 'field-select';

  return (
    <div className={`location-picker ${compact ? 'location-picker-compact' : ''}`}>
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-[color:var(--temporal)]" />
          <p className="ui-eyebrow">Where this lands on Earth (optional overlay)</p>
        </div>
      )}
      <div className="location-picker-grid">
        <label className="field-label">
          Region
          <select
            className={selectClass}
            value={region}
            onChange={(e) => {
              const nextRegion = e.target.value;
              setRegion(nextRegion);
              const nextCountries = catalogCountries(nextRegion);
              const nextCountry = nextCountries[0] || 'Global';
              setCountry(nextCountry);
              const nextPlaces = catalogPlaces(nextRegion, nextCountry);
              if (nextPlaces[0]) applyPlace(nextPlaces[0].id);
            }}
          >
            {catalogRegions().map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Country
          <select
            className={selectClass}
            value={country}
            onChange={(e) => {
              const nextCountry = e.target.value;
              setCountry(nextCountry);
              const nextPlaces = catalogPlaces(region, nextCountry);
              if (nextPlaces[0]) applyPlace(nextPlaces[0].id);
            }}
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          City / island / town
          <select className={selectClass} value={placeId} onChange={(e) => applyPlace(e.target.value)}>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};
