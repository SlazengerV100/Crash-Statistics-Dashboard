import React, { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { initMap, updateMapData } from './initMap';
import { fetchYearsFromBackend } from '../../services/api';

const MainMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [year, setYear] = useState(2024); // Default year

  // Fetch years and init map
  useEffect(() => {

    const setup = async () => {
      const availableYears = await fetchYearsFromBackend();
      if (!mapContainerRef.current) return;

      const mapInstance = await initMap(
          mapContainerRef.current,
          year,
          setYear,
          availableYears
      );

      mapRef.current = mapInstance;

    };

    setup();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update heatmap on year change
  useEffect(() => {
    if (mapRef.current) {
      updateMapData(mapRef.current, year);
    }
  }, [year]);

  return (
      <div>
        <div
            ref={mapContainerRef}
            style={{ position: 'relative', width: '100%', height: '80vh' }}
        />
      </div>
  );
};

export default MainMap;
