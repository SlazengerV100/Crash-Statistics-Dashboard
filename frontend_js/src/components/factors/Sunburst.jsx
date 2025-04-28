import * as d3 from "d3";
import React, {useEffect, useRef, useState} from "react";
import {Grid} from "@mui/material";

const Sunburst = ({ data, width, name }) => {
    const radius = width / 2
    const [breadcrumbData, setBreadcrumbData] = useState([]);
    const breadcrumbWidth = 150
    const breadcrumbHeight = 30

    const partition = data =>
        d3.partition().size([2 * Math.PI, radius * radius])(
            d3
                .hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value)
        )

    const color = d3
        .scaleOrdinal()
        .range([
            "#1f77b4",
            "#ff7f0e",
            "#2ca02c",
            "#98df8a",
            "#d62728",
            "#9467bd",
            "#8c564b",
            "#c49c94",
            "#e377c2",
            "#bcbd22",
            "#17becf",
            "#7f7f7f",
            "#aec7e8",
            "#ff9896",
            "#c5b0d5"
        ]);

    const arc = d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(1 / radius)
        .padRadius(radius)
        .innerRadius(d => Math.sqrt(d.y0))
        .outerRadius(d => Math.sqrt(d.y1) - 1)

    const mousearc = d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => Math.sqrt(d.y0))
        .outerRadius(radius)

    const sunburstChart = (data) => {
        const root = partition(data);
        const svg = d3.create("svg");

        const element = svg.node();
        element.value = {sequence: [], percentage: 0.0};

        const label = svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("fill", "#888")
            .style("visibility", "hidden");

        label
            .append("tspan")
            .attr("class", "percentage")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", "-0.1em")
            .attr("font-size", "3em")
            .text("");

        label
            .append("tspan")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", "1.5em")
            .text("of crashes involve these " + name.toLowerCase() + "s");

        label
            .append("tspan")
            .attr("class", "vehicle-name")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", "2.5em")
            .attr("font-size", "1.2em")
            .text("");

        svg
            .attr("viewBox", `${-radius} ${-radius} ${width} ${width}`)
            .style("max-width", `${width}px`)
            .style("font", "12px sans-serif");

        const path = svg
            .append("g")
            .selectAll("path")
            .data(root.descendants().filter(d => d.depth && d.x1 - d.x0 > 0.001))
            .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc);

        svg
            .append("g")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mouseleave", () => {
                path.attr("fill-opacity", 1);
                label.style("visibility", "hidden");
                setBreadcrumbData([]);
                element.value = {sequence: [], percentage: 0.0};
                element.dispatchEvent(new CustomEvent("input"));
            })
            .selectAll("path")
            .data(root.descendants().filter(d => d.depth && d.x1 - d.x0 > 0.001))
            .join("path")
            .attr("d", mousearc)
            .on("mouseenter", (event, d) => {
                const sequence = d.ancestors().reverse().slice(1);
                path.attr("fill-opacity", node =>
                    sequence.indexOf(node) >= 0 ? 1.0 : 0.3
                );
                const percentage = ((100 * d.value) / root.value).toPrecision(3);
                label
                    .style("visibility", null)
                    .select(".percentage")
                    .text(percentage + "%");

                const colours = sequence.map(s => {
                    const allPaths = svg.selectAll("path").nodes();
                    const matched = allPaths.find(p => p.__data__ === s);
                    return matched ? window.getComputedStyle(matched).fill : "#999";
                });

                console.log(colours);

                setBreadcrumbData(sequence.map((node, i) => ({
                    node,
                    fill: colours[i]
                })));
            });

        return element;
    }

    const chartRef = useRef();

    useEffect(() => {
        if (data && chartRef.current) {
            chartRef.current.innerHTML = ""; // Clear previous chart
            chartRef.current.appendChild(sunburstChart(data));
        }
    }, [data]);

    const renderBreadcrumbs = () => {
        if (breadcrumbData.length === 0) return null
        return (
            <svg width={breadcrumbWidth * breadcrumbData.length} height={breadcrumbHeight + 10}>
                <g transform="translate(0, 5)">
                    {breadcrumbData.map((d, i) => (
                        <g key={i} transform={`translate(${i * (breadcrumbWidth)}, 0)`}>
                            <polygon
                                points={breadcrumbPoints(d.node, i)}
                                fill={d.fill}
                            />
                            <text
                                x={(breadcrumbWidth + 10) / 2}
                                y={breadcrumbHeight / 2}
                                dy="0.35em"
                                textAnchor="middle"
                                fill="white"
                            >
                                {d.node.data.name}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>
        )
    };

    function breadcrumbPoints(d, i) {
        const tipWidth = 10;
        const points = [
            "0,0",
            `${breadcrumbWidth},0`,
            `${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`,
            `${breadcrumbWidth},${breadcrumbHeight}`,
            `0,${breadcrumbHeight}`
        ];
        if (i > 0) {
            points.push(`${tipWidth},${breadcrumbHeight / 2}`);
        }
        return points.join(" ");
    }

    return (
        <Grid align="center" justifyContent="center">
            <h1>{name}s</h1>
            <p>All crashes from 2000-2025 involving {name.toLowerCase().startsWith("o") ? "an" : "a"} {name.toLowerCase()}.</p>
            <Grid height={breadcrumbHeight + 10}>
                {renderBreadcrumbs()}
            </Grid>
            <div ref={chartRef}/>
        </Grid>
    )
}

export default Sunburst;