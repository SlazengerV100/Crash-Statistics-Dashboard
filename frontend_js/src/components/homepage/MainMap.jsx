import React, { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { initMap, updateHeatmapData } from './initMap';
import { fetchYearsFromBackend } from '../../services/api'; // Adjust the import path as necessary

const MainMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const hasInitialized = useRef(false); // Track if the map has been initialized
  const [year, setYear] = useState(2020);
  const [availableYears, setAvailableYears] = useState([]);  

  // Fetch available years on mount
  useEffect(() => {
    const fetchYears = async () => {
      const years = await fetchYearsFromBackend();
      setAvailableYears(years);
    };
    fetchYears();
  }, []);

  // Initialize the map only after availableYears are loaded
  useEffect(() => {
    const setup = async () => {
      console.log(`Setting up map with year: ${year}`);
      if (!mapContainerRef.current || availableYears.length === 0){
        console.log("Map container ref is not set or available years are not loaded yet. Skipping map initialization.");
        return;
      }
  
      if (hasInitialized.current) {
        console.log("Map setup already done, skipping.");
        return;
      }
  
      hasInitialized.current = true;
  
      const mapInstance = await initMap(
        mapContainerRef.current,
        year,
        setYear,
        availableYears
      );
      mapRef.current = mapInstance;
      setMapReady(true);
    };
  
    setup();
  
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [availableYears]);
  

  // Re-fetch when year changes
  useEffect(() => {
    if (!mapReady || !mapRef.current) {
      console.warn("Map is not ready or mapRef is not set. Skipping heatmap update.");
      return;
    };
  
    console.log(`Updating heatmap to year ${year}`);
    updateHeatmapData(mapRef.current, year);
  }, [year]);

  return (
    <div>
      <label>
        Select Year:
        <select value={year} onChange={(e) => {
            const selectedYear = parseInt(e.target.value);
            console.log(`Selected year: ${selectedYear}`);
            console.log(`previous year: ${year}`);
            setYear(parseInt(e.target.value))
          }}>
          <option value={2018}>2018</option>
          <option value={2019}>2019</option>
          <option value={2020}>2020</option>
          <option value={2021}>2021</option>
        </select>
      </label>
      <div
        ref={mapContainerRef}
        style={{ position: 'relative', width: '100%', height: '80vh' }}
      />
    </div>
  );
};

export default MainMap;
