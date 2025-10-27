// src/components/about/barawe/map/MapClient.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useState, useCallback } from 'react';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.scss';

import somaliaGeo from './somaliaGeo.json';

const pinIcon = L.icon({
  iconUrl: '/assets/pin.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const baraaweCoords: LatLngTuple = [1.1167, 44.0333];

const initialBounds: [LatLngTuple, LatLngTuple] = [
  [11.5, 40.5],
  [-2.0, 52.5],
];

function MapZoom({
  zoomed,
  setHideBorder,
}: {
  zoomed: boolean;
  setHideBorder: (v: boolean) => void;
}) {
  const map = useMap();

  const flyToBaraawe = useCallback(() => {
    map.flyTo(baraaweCoords, 14, { duration: 2.5 });
    setTimeout(() => setHideBorder(true), 500);
  }, [map, setHideBorder]);

  const resetView = useCallback(() => {
    map.flyToBounds(initialBounds, { duration: 1.5 });
    setHideBorder(false);
  }, [map, setHideBorder]);

  useEffect(() => {
    if (zoomed) flyToBaraawe();
    else resetView();
  }, [zoomed, flyToBaraawe, resetView]);

  return null;
}

export default function MapClient() {
  const [zoomed, setZoomed] = useState(false);
  const [hideBorder, setHideBorder] = useState(false);

  return (
    <div
      className={styles.mapWrapper}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
    >
      <MapContainer
        bounds={initialBounds}
        scrollWheelZoom={false}
        zoomControl={false}
        doubleClickZoom={false}
        dragging={false}
        className={styles.map}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

        {!hideBorder && (
          <GeoJSON
            data={somaliaGeo as GeoJSON.GeoJsonObject}
            style={{
              color: 'red',
              weight: 2,
              fillOpacity: 0.04,
              fillColor: '#f6f6f6',
            }}
          />
        )}

        <Marker position={baraaweCoords} icon={pinIcon}>
          <Popup>Baraawe, Somalia</Popup>
        </Marker>

        <MapZoom zoomed={zoomed} setHideBorder={setHideBorder} />
      </MapContainer>

      <div className={styles.blurLayer} aria-hidden />
    </div>
  );
}
