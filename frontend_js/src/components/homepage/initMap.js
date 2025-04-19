import maplibregl from 'maplibre-gl';
import { fetchMapDataFromYear } from '../../services/api';
import { YearSliderControl } from './yearSliderControl';
import { heatmapLegend } from './heatmapLegend';

export const updateHeatmapData = async (map, year) => {
  const crashLocationsByRegion = await fetchMapDataFromYear(year);

  const allCrashLocations = {
    type: 'FeatureCollection',
    features: Object.values(crashLocationsByRegion).flatMap(region => region.features),
  };

  console.log(`Updating heatmap to year ${year}`, allCrashLocations);

  const source = map.getSource('crashes-heatmap');
  if (source) {
    source.setData(allCrashLocations);
    console.log("Heatmap source updated with new data");
  } else {
    console.warn(`Heatmap source not found, looking for {sourceId: 'crashes-heatmap'}`);
  }
};


function waitForMapLoad(map) {
  return new Promise(resolve => {
    if (map.loaded()) {
      resolve();
    } else {
      map.on('load', resolve);
    }
  });
}

export const initMap = async (container, year, setYear, availableYears) => {

  const map = new maplibregl.Map({
    container: container,
    style: `https://api.maptiler.com/maps/019632d1-1e12-7540-8db2-66efc02123a7/style.json?key=MmRTvJbsmvS37AW7dAoc`,
    center: [172.5, -41],
    zoom: 5,
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  map.addControl(
    new YearSliderControl({ year, setYear, availableYears }),
    'top-left'
  );


  // Create D3 overlay and heatmap after the map loads
  map.on('load', () => {
    heatmapLegend(map); // Add heatmap legend
    const canvasContainer = map.getCanvasContainer();
  });


  // Waits for map to load before adding heatmap layer
  // This is important to ensure that the map is fully loaded before adding layers or sources
  await waitForMapLoad(map);
  
  const crashLocationsByRegion = await fetchMapDataFromYear(year);

  // flattens crash locations for all locations and converts to geojson format
  const allCrashLocations = {
    type: 'FeatureCollection',
    features: Object.values(crashLocationsByRegion).flatMap(region => region.features),
  };

  // Add data source
  map.addSource('crashes-heatmap', {
    type: 'geojson',
    data: allCrashLocations,
  });

  console.log(`All crash locations in ${year}:`, allCrashLocations);
  // Add the heatmap layer
  map.addLayer({
    id: 'crash-heatmap-layer',
    type: 'heatmap',
    source: 'crashes-heatmap',
    maxzoom: 15,
    paint: {
      // Reduce intensity at all zoom levels
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 5, 0.4, 15, 0.6],

      // Soften color transition – keep the lower density range cooler longer
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(33,102,172,0)',
        0.3, 'rgb(103,169,207)',
        0.5, 'rgb(209,229,240)',
        0.7, 'rgb(253,219,199)',
        0.9, 'rgb(239,138,98)',
        1, 'rgb(178,24,43)'
      ],

      // Smaller radius = more pinpointed data = less glowing blobs
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 5, 5, 10, 8, 15, 30],

      // Keep opacity subtle
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 15, 0.4]
    }
  });


  return map;
};