import maplibregl from 'maplibre-gl';
import * as d3 from 'd3';

import axios from 'axios';

const fetchMapDataFromYear = async (year) => {
  try {
    const response = await axios.post(`http://localhost:5001/api/crashes/location?year=${year}`);
    console.log('Map data fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching map data:', error);
    return null;
  }
}


export const initMap = async (container) => {
  const year = 2020;

  const map = new maplibregl.Map({
    container: container,
    style: `https://api.maptiler.com/maps/019632d1-1e12-7540-8db2-66efc02123a7/style.json?key=MmRTvJbsmvS37AW7dAoc`,
    center: [172.5, -41],
    zoom: 5,
  });

  const crashLocationsByRegion = await fetchMapDataFromYear(year);

  // flattens crash locations for all locations and converts to geojson format
  const allCrashLocations = {
    type: 'FeatureCollection',
    features: Object.values(crashLocationsByRegion).flatMap(region => region.features),
  };

  console.log(`All crash locations in ${year}:`, allCrashLocations);

  // Create D3 overlay and heatmap after the map loads
  map.on('load', () => {

    // Create heatmap layer for crash locations
    map.addSource('crashes-heatmap', {
      type: 'geojson',
      data: allCrashLocations,
    });

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



    const canvasContainer = map.getCanvasContainer();

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

  return map;
};