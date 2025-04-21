import maplibregl from 'maplibre-gl';
import { fetchMapDataFromYear } from '../../services/api';
import { YearSliderControl } from './yearSliderControl';
import { heatmapLegend } from './heatmapLegend';

export const updateMapData = async (map, year) => {
  const crashLocationsByRegion = await fetchMapDataFromYear(year);

  const allCrashLocations = {
    type: 'FeatureCollection',
    features: Object.values(crashLocationsByRegion).flatMap(region => region.features),
  };

  console.log(`Updating heatmap to year ${year}`, allCrashLocations);

  const heatmapSource = map.getSource('crashes-heatmap');
  if (heatmapSource) {
    heatmapSource.setData(allCrashLocations);
    console.log("Heatmap source updated with new data");
  } else {
    console.warn(`Heatmap source not found, looking for {sourceId: 'crashes-heatmap'}`);
  }
  
  // Update cluster source
  const clusterSource = map.getSource('crashes-cluster');
  if (clusterSource) {
    clusterSource.setData(allCrashLocations);
    console.log("Cluster source updated with new data");
  } else {
    console.warn("Cluster source 'crashes-cluster' not found");
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
    map.getCanvasContainer();
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

  // Add data sources for both visualisations:

  // 1. Heatmap layer
  map.addSource('crashes-heatmap', {
    type: 'geojson',
    data: allCrashLocations,
  });
  
  // 2. Clustered points layer
  map.addSource('crashes-cluster', {
    type: 'geojson',
    data: allCrashLocations,
    cluster: true,
    clusterRadius: 10, // default is 50 — decrease to reduce cluster amount
    clusterMaxZoom: 14 // Max zoom to cluster points on
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
        0.00, 'rgba(0,0,0,0)',              // Transparent
        0.10, 'rgb(103,169,207)',           // Light blue
        0.25, 'rgb(158,202,225)',           // Sky blue
        0.40, 'rgb(197,160,169)',           // Rose
        0.55, 'rgb(239,138,98)',            // Salmon
        0.70, 'rgb(214,96,77)',             // Warm red-orange
        0.85, 'rgb(178,24,43)',             // Deep red
        1.00, 'rgb(128,0,38)'               // Dark red
      ],
      // Smaller radius = more pinpointed data = less glowing blobs
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 5, 4, 10, 8, 15, 20],
      // Keep opacity subtle
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 5, 1, 7, 0.8, 10, 0.6, 12, 0.2, 15, 0],
    }
  });

  // add the unclustered points layer
  map.addLayer({
    id: 'crash-unclustered-point',
    type: 'circle',
    source: 'crashes-cluster',
    filter: ['!', ['has', 'point_count']],
    minzoom: 10,
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 6,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // Initialize a single popup instance
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // Handle hover for unclustered crash points
  map.on('mouseenter', 'crash-unclustered-point', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    const coordinates = e.features[0].geometry.coordinates.slice();
    const props = e.features[0].properties;

    const tooltipHTML = `
      <div style="font-size: 13px;">
        <strong>Crash Details</strong><br/>
        <strong>Crash_id:</strong> ${props.crash_id || 'N/A'}<br/>
        <strong>Severity:</strong> ${props.severity || 'N/A'}<br/>
      </div>
    `;

    popup.setLngLat(coordinates)
        .setHTML(tooltipHTML)
        .addTo(map);
  });

  map.on('mouseleave', 'crash-unclustered-point', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
  
  // Add the clustered points layer
  map.addLayer({
    id: 'crash-cluster-layer',
    type: 'circle',
    source: 'crashes-cluster',
    filter: ['has', 'point_count'],
    minzoom: 10,
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        'rgb(103,169,207)', 5,
        'rgb(239,138,98)', 10,
        'rgb(178, 24, 43)', 20,
        'rgb(128,0,38)',
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        8, 5,
        12, 10,
        16, 20,
        20, 
      ]
    }
  });
  
  map.addLayer({
    id: 'crash-cluster-count',
    type: 'symbol',
    source: 'crashes-cluster',
    filter: ['has', 'point_count'],
    minzoom: 10,
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  return map;
};