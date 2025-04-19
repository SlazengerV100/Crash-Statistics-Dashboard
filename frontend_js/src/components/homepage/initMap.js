import maplibregl from 'maplibre-gl';
import * as d3 from 'd3';
import { fetchMapDataFromYear } from '../../services/api'; // Adjust the import path as necessary
import { YearSliderControl } from './yearSliderControl'; // Adjust the import path as necessary

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

    const canvasContainer = map.getCanvasContainer();

    /*
    // Create a D3 overlay for the map

    THIS IS A WORK IN PROGRESS, COULD BE USED BY YOU TO GENERATE OVERLAY FOR NZ MAPS REGIONALLY

    */


    // const svg = d3.select(canvasContainer)
    //   .append('svg')
    //   .attr('class', 'd3-overlay')
    //   .style('position', 'absolute')
    //   .style('top', 0)
    //   .style('left', 0)
    //   .style('width', '100%')
    //   .style('height', '100%')
    //   .style('pointer-events', 'none');

    // d3.json('/nz.json').then((geoData) => {
    //   const project = (lngLat) => {
    //     const point = map.project(new maplibregl.LngLat(...lngLat));
    //     return [point.x, point.y];
    //   };

    //   const path = d3.geoPath().projection({
    //     stream: (s) => ({
    //       point(x, y) {
    //         const [px, py] = project([x, y]);
    //         s.point(px, py);
    //       },
    //       sphere() { s.sphere(); },
    //       lineStart() { s.lineStart(); },
    //       lineEnd() { s.lineEnd(); },
    //       polygonStart() { s.polygonStart(); },
    //       polygonEnd() { s.polygonEnd(); },
    //     }),
    //   });

    //   svg.selectAll("path")
    //     .data(geoData.features)
    //     .join("path")
    //     .attr("d", path)
    //     .attr("fill", "rgba(124, 200, 255, 0.56)")
    //     .attr("stroke", "#005")
    //     .attr("stroke-width", 1);

    //   map.on('move', () => {
    //     svg.selectAll("path").attr("d", path);
    //   });
    // });

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
      // Increase the heatmap weight based on crash severity (optional tweak)
      // 'heatmap-weight': [
      //   'match',
      //   ['get', 'severity'],
      //   'Fatal Crash', 3,
      //   'Serious Crash', 2,
      //   'Minor Crash', 1,
      //   0.5 // fallback weight
      // ],
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
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 5, 8, 15, 30],

      // Keep opacity subtle
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 15, 0.4]
    }
  });


  return map;
};