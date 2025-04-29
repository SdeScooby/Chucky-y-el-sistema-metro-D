'use client';

import { useEffect, useRef } from 'react';
import * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DynamicMap = () => {
  const mapRef = useRef<Leaflet.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const initializeMap = async () => {
        const newMap = Leaflet.map('map').setView([6.2442, -75.5812], 13);

        Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(newMap);

        Leaflet.marker([6.2442, -75.5812]).addTo(newMap)
          .bindPopup('Medellín')
          .openPopup();

        mapRef.current = newMap;
      };

      initializeMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="map" className="h-64 rounded-md shadow-md z-0"></div>;
};

export default DynamicMap;
