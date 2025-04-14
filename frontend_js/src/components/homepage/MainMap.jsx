import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

import {} from 'd3-geo';



const MainMap = () => {
    const svgRef = useRef();

    useEffect(() => {
        const width = 800;
        const height = 1000;

        const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

        const projection = d3.geoMercator()
        .center([172.5, -41])
        .scale(3000)
        .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        d3.json("/nz.json").then((geoData) => {
        svg.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("d", path)
            .attr("fill", "#a3c9a8")
            .attr("stroke", "#333");
        });
    }, []);

    return (
    <>
        <svg ref={svgRef}></svg>
    </>  
    );
}



export default MainMap;