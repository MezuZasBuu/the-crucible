/**
 * The Crucible — Google Maps Geodesic Polyline Component
 * Renders high-precision planetary lines on Google Maps with click interaction.
 */

import React, { useEffect, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface GoogleMapPolylineProps {
  path: Array<{ lat: number; lng: number }>;
  strokeColor: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  strokePattern?: 'solid' | 'dashed';
  geodesic?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const GoogleMapPolyline: React.FC<GoogleMapPolylineProps> = ({
  path,
  strokeColor,
  strokeOpacity = 0.8,
  strokeWeight = 2,
  strokePattern = 'solid',
  geodesic = true,
  isSelected = false,
  onClick
}) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !mapsLib) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor,
      strokeOpacity: isSelected ? 1.0 : strokeOpacity,
      strokeWeight: isSelected ? strokeWeight + 2 : strokeWeight,
      geodesic,
      map
    });

    polylineRef.current = polyline;

    const clickListener = polyline.addListener('click', () => {
      if (onClick) onClick();
    });

    return () => {
      google.maps.event.removeListener(clickListener);
      polyline.setMap(null);
    };
  }, [map, mapsLib, isSelected, strokeColor, strokeWeight, strokeOpacity, geodesic]);

  // Update path dynamically if it changes
  useEffect(() => {
    if (polylineRef.current) {
      polylineRef.current.setPath(path);
    }
  }, [path]);

  return null;
};
