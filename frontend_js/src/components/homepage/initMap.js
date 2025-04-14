import maplibregl from 'maplibre-gl';
import * as d3 from 'd3';

export const initMap = async (container) => {
  const map = new maplibregl.Map({
    container: container,
    style: `https://api.maptiler.com/maps/backdrop/style.json?key=MmRTvJbsmvS37AW7dAoc`,
    center: [172.5, -41],
    zoom: 5,
  });

  // Create D3 overlay after the map loads
  map.on('load', () => {
    const canvasContainer = map.getCanvasContainer();

    const svg = d3.select(canvasContainer)
      .append('svg')
      .attr('class', 'd3-overlay')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('width', '100%')
      .style('height', '100%')
      .style('pointer-events', 'none');

    d3.json('/nz.json').then((geoData) => {
      const project = (lngLat) => {
        const point = map.project(new maplibregl.LngLat(...lngLat));
        return [point.x, point.y];
      };

      const path = d3.geoPath().projection({
        stream: (s) => ({
          point(x, y) {
            const [px, py] = project([x, y]);
            s.point(px, py);
          },
          sphere() { s.sphere(); },
          lineStart() { s.lineStart(); },
          lineEnd() { s.lineEnd(); },
          polygonStart() { s.polygonStart(); },
          polygonEnd() { s.polygonEnd(); },
        }),
      });

      svg.selectAll("path")
        .data(geoData.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "rgba(0, 150, 255, 0.3)")
        .attr("stroke", "#005")
        .attr("stroke-width", 1);

      map.on('move', () => {
        svg.selectAll("path").attr("d", path);
      });
    });
  });

  return map;
};