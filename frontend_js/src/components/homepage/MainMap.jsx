import React, { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { initMap, updateHeatmapData } from './initMap';
import { fetchYearsFromBackend } from '../../services/api'; // Adjust the import path as necessary

const MainMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [year, setYear] = useState(2020);
  
  // fetch years available from backend
  const availableYears = fetchYearsFromBackend(); 

  useEffect(() => {
    let mapInstance;

    const setup = async () => {
      mapInstance = await initMap(mapContainerRef.current, year);
      mapRef.current = mapInstance;
    };

    setup();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  // Re-fetch when year changes
  useEffect(() => {
    if (mapRef.current) {
      updateHeatmapData(mapRef.current, year);
    }
  }, [year]);

  return (
    <div>
      {/* <label>
        Select Year:
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          <option value={2018}>2018</option>
          <option value={2019}>2019</option>
          <option value={2020}>2020</option>
          <option value={2021}>2021</option>
        </select>
      </label> */}
      <div
        ref={mapContainerRef}
        style={{ position: 'relative', width: '100%', height: '80vh' }}
      />
    </div>
  );
};

export default MainMap;
