import React, { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { initMap } from './initMap';

const MainMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let mapInstance;

    const setup = async () => {
      mapInstance = await initMap(mapContainerRef.current);
      mapRef.current = mapInstance;
    };

    setup();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ position: 'relative', width: '100%', height: '100vh' }}
    />
  );
};

export default MainMap;
