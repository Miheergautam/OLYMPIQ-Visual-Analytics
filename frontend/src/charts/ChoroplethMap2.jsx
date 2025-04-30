import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ChoroplethMap2 = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [year, setYear] = useState(2023);
  const [geoData, setGeoData] = useState(null);
  const [gdpData, setGdpData] = useState(null);

  useEffect(() => {
    const width = window.innerWidth* 0.8;
    const height = window.innerHeight * 0.85;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#f5f5f5');

    svg.selectAll('*').remove(); // Clear old drawings

    const projection = d3.geoMercator()
      .scale((width / 3.1) / Math.PI)  //  Dynamic scale based on width
      .translate([width / 2, height / 1.4]);

    const pathGenerator = d3.geoPath().projection(projection);

    const colorScale = d3.scaleSequential()
      .domain([1000, 60000])
      .interpolator(d3.interpolateReds);

    Promise.all([
      d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
      d3.csv('/gdp_per_capita_with_iso.csv')
    ])
      .then(([geo, csv]) => {
        const gdpParsed = {};
        csv.forEach(row => {
          const code = row.ISO3;
          const y = row.Year;
          const value = +row["GDP per capita"];
          if (!gdpParsed[code]) gdpParsed[code] = {};
          gdpParsed[code][y] = value;
        });

        geo.features = geo.features.filter(f => f.properties.name !== "Antarctica");

        setGeoData(geo);
        setGdpData(gdpParsed);

        // Draw the map
        svg.selectAll('path')
          .data(geo.features)
          .join('path')
          .attr('d', pathGenerator)
          .attr('stroke', '#000')
          .attr('stroke-width', 0.5)
          .attr('fill', '#ccc') // initial grey
          .on('mouseover', function (event, d) {
            const currentYear = d3.select('#yearSlider').property('value'); // Get current year dynamically
            const val = gdpParsed[d.id]?.[currentYear];

            d3.selectAll('path').transition().duration(200).style('opacity', 0.3);

            d3.select(this)
              .raise()
              .transition()
              .duration(200)
              .style('opacity', 1)
              .style('stroke', '#111')
              .style('stroke-width', 2);

            const tooltip = d3.select(tooltipRef.current);
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`<strong class="text-red-800">${d.properties.name}</strong><br>GDP: $${val ? val.toLocaleString() : "N/A"}`)
              .style('left', (event.pageX + 10) + "px")
              .style('top', (event.pageY - 28) + "px");
          })
          .on('mouseout', function () {
            d3.selectAll('path').transition().duration(200).style('opacity', 1);
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke', '#000')
              .style('stroke-width', 0.5);

            d3.select(tooltipRef.current).transition().duration(500).style('opacity', 0);
          });

        // Draw Legend
        const legendWidth = 350;
        const legendHeight = 15;
        const legendX = 80;
        const legendY = height - 130;

        const defs = svg.append("defs");
        const linearGradient = defs.append("linearGradient")
          .attr("id", "legend-gradient")
          .attr("x1", "0%")
          .attr("x2", "100%");

        linearGradient.selectAll("stop")
          .data(d3.range(0, 1.01, 0.1))
          .enter().append("stop")
          .attr("offset", d => `${d * 100}%`)
          .attr("stop-color", d => colorScale(d * 60000));

        svg.append("rect")
          .attr("x", legendX - 10)
          .attr("y", legendY - 15)
          .attr("width", legendWidth + 30)
          .attr("height", 50)
          .attr("rx", 6)
          .attr("fill", "white")
          .attr("stroke", "#999")
          .attr("stroke-width", 0.5)
          .style("filter", "drop-shadow(0px 0px 5px rgba(0,0,0,0.2))");

        svg.append("g")
          .attr("transform", `translate(${legendX}, ${legendY})`)
          .append("rect")
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .style("fill", "url(#legend-gradient)");

        const legendScale = d3.scaleLinear()
          .domain([1000, 100000])
          .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
          .ticks(6)
          .tickFormat(d => `$${d / 1000}k`);

        svg.append("g")
          .attr("transform", `translate(${legendX}, ${legendY + 15})`)
          .call(legendAxis)
          .selectAll("text")
          .style("font-size", "13px")
          .style("fill", "#333");
      })
      .catch(error => {
        console.error('Error loading files:', error);
      });

  }, []); // Load once

  // Smooth recoloring on year change
  useEffect(() => {
    if (!geoData || !gdpData) return;

    const svg = d3.select(svgRef.current);
    const colorScale = d3.scaleSequential()
      .domain([1000, 60000])
      .interpolator(d3.interpolateReds);

    svg.selectAll('path')
      .transition()
      .duration(600)
      .ease(d3.easeCubic) // Smooth easing
      .attr('fill', d => {
        if (!d || !d.id) return "#ccc"; // Defensive safe check
        const val = gdpData[d.id]?.[year];
        return val ? colorScale(val) : "#ccc";
      });

  }, [year, geoData, gdpData]);

  return (
    <div className="p-4 max-w-5xl">
      <h2 className="text-center text-2xl text-red-800 font-semibold">GDP per Capita (USD)</h2>
      <div id="map" className="mt-4">
        <svg ref={svgRef}></svg>
      </div>

      {/* Year slider */}
      <div className="mt-8 text-center w-full max-w-5xl mx-auto">
        <input
          id="yearSlider"
          type="range"
          min="2000"
          max="2023"
          step="1"
          value={year}
          onChange={e => setYear(+e.target.value)}
          className="w-full"
        />
        <div className="mt-4 text-xl font-bold text-red-800">
          Selected Year (GDP): {year}
        </div>

        {/* Year scale under slider */}
        <div className="flex justify-between text-sm text-gray-600 mt-2 px-4">
          {Array.from({ length: 2023 - 2000 + 1 }, (_, i) => (
            (i % 5 === 0 || (2000 + i) === 2023) ?
              <span key={i}>{2000 + i}</span> :
              <span key={i}></span>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute bg-white p-2 border border-gray-300 shadow-md text-sm text-gray-800 opacity-0 pointer-events-none" ref={tooltipRef}></div>
    </div>
  );
};

export default ChoroplethMap2;
