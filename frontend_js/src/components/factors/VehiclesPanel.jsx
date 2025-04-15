import * as d3 from "d3";
import React, {useEffect, useRef} from "react";

const VehiclesPanel = ({data}) => {
    const width = 640
    const radius = width / 2

    const partition = data =>
        d3.partition().size([2 * Math.PI, radius * radius])(
            d3
                .hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value)
        )

    const color = d3
        .scaleOrdinal()
        .domain([
            "Bicycle",
            "Bus",
            "Car",
            "Multiple Cars",
            "Moped",
            "Motorcycle",
            "Other Vehicle",
            "Parked Vehicle",
            "Pedestrian",
            "School Bus",
            "SUV",
            "Taxi",
            "Train",
            "Truck",
            "Van or Utility"
        ])
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
            .text("of crashes involve this vehicle");

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

                label.select(".vehicle-name").text(
                    sequence.map(s => s.data.name).join(" + ")
                );

                element.value = { sequence, percentage };
                element.dispatchEvent(new CustomEvent("input"));
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

    return (
        <>
            <div ref={chartRef}/>
        </>
    )
}

export default VehiclesPanel;