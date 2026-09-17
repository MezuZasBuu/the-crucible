/**
 * The Crucible — Google Maps 3D Camera & Flight Controller
 * Handles 3D tilt, heading rotation orbit, and smooth flight transitions.
 */

import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface GoogleMapCameraControllerProps {
  tilt: number;
  heading: number;
  center?: { lat: number; lng: number };
  zoom?: number;
  triggerFlyTo?: { lat: number; lng: number; zoom?: number; tilt?: number; heading?: number } | null;
}

export const GoogleMapCameraController: React.FC<GoogleMapCameraControllerProps> = ({
  tilt,
  heading,
  center,
  zoom,
  triggerFlyTo
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    try {
      if (typeof (map as any).moveCamera === 'function') {
        (map as any).moveCamera({
          tilt,
          heading
        });
      } else {
        if (typeof map.setTilt === 'function') map.setTilt(tilt);
        if (typeof map.setHeading === 'function') map.setHeading(heading);
      }
    } catch {
      // Fallback
    }
  }, [map, tilt, heading]);

  useEffect(() => {
    if (!map || !triggerFlyTo) return;
    try {
      if (typeof (map as any).moveCamera === 'function') {
        (map as any).moveCamera({
          center: { lat: triggerFlyTo.lat, lng: triggerFlyTo.lng },
          zoom: triggerFlyTo.zoom ?? 6,
          tilt: triggerFlyTo.tilt ?? 45,
          heading: triggerFlyTo.heading ?? 0
        });
      } else {
        map.panTo({ lat: triggerFlyTo.lat, lng: triggerFlyTo.lng });
        if (triggerFlyTo.zoom) map.setZoom(triggerFlyTo.zoom);
        if (triggerFlyTo.tilt && typeof map.setTilt === 'function') map.setTilt(triggerFlyTo.tilt);
      }
    } catch {
      map.panTo({ lat: triggerFlyTo.lat, lng: triggerFlyTo.lng });
    }
  }, [map, triggerFlyTo]);

  return null;
};
