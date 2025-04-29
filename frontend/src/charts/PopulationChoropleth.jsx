import React, { useEffect, useRef, useState } from 'react';
import { useGetAllPopulationQuery } from "../store/api";
import * as d3 from 'd3';

const PopulationChoropleth = () => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [year, setYear] = useState(2000);
  const [populationData, setPopulationData] = useState({});
  const [availableYears, setAvailableYears] = useState([]);
  const [topCountries, setTopCountries] = useState([]);

  const { data: populationRawData, isLoading, isError } = useGetAllPopulationQuery();

  useEffect(() => {
    if (!populationRawData) return;

    const nested= {};
    const yearSet = new Set();

    populationRawData.forEach(({ Country, Year, Population }) => {
      if (!nested[Country]) nested[Country] = {};
      nested[Country][Year] = Math.round(Population / 1_000_000);
      yearSet.add(Year);
    });

    setPopulationData(nested);
    setAvailableYears(Array.from(yearSet).sort());

    const top = Object.entries(nested)
      .map(([country, years]) => ({
        country,
        population: years[year] || 0
      }))
      .sort((a, b) => b.population - a.population)
      .slice(0, 300)
      .map(item => item.country);

    setTopCountries(top);
  }, [populationRawData, year]);

  useEffect(() => {
    if (!svgRef.current || !populationData) return;

    const svg = d3.select(svgRef.current);
    const container = svgRef.current.parentNode;
    const width = container ? container.clientWidth : 800;
    const height = window.innerHeight * 0.8;

    svg.attr('width', width).attr('height', height).style('background-color', '#f5f5f5');
    svg.selectAll('*').remove();

    const projection = d3.geoMercator()
      .scale((width / 2.5) / Math.PI)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const allPopValues = Object.values(populationData)
      .map(d => d[year])
      .filter(Boolean);

    const min = d3.min(allPopValues) ?? 0;
    const max = d3.max(allPopValues) ?? 1;

    const colorScale = d3.scaleSequential([min, max], d3.interpolateBlues);

    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(geo => {
        geo.features = geo.features.filter(f => f.properties?.name !== "Antarctica");

        svg.selectAll('path')
          .data(geo.features)
          .join('path')
          .attr('d', path)
          .attr('fill', d => {
            const name = d.properties?.name;
            const val = populationData[name]?.[year];
            return val != null ? colorScale(val) : '#ccc';
          })
          .attr('stroke', d => topCountries.includes(d.properties.name) ? '#333' : '#aaa')
          .attr('stroke-width', d => topCountries.includes(d.properties.name) ? 1.5 : 0.5)
          .on('mouseover', function (event, d) {
            const name = d.properties?.name;
            const val = populationData[name]?.[year];

            d3.select(this)
              .raise()
              .transition().duration(200)
              .attr('stroke', '#111').attr('stroke-width', 2);

            d3.select(tooltipRef.current)
              .style('opacity', 1)
              .html(`
                <div class="text-blue-800 font-bold">${name}</div>
                <div>Population: ${val ? `${val.toLocaleString()}M` : "N/A"}</div>
              `)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', function () {
            d3.select(this)
              .transition().duration(200)
              .attr('stroke', d => topCountries.includes(d.properties.name) ? '#333' : '#aaa')
              .attr('stroke-width', d => topCountries.includes(d.properties.name) ? 1.5 : 0.5);

            d3.select(tooltipRef.current)
              .transition().duration(300)
              .style('opacity', 0);
          });

        // Legend
        const legendWidth = 300;
        const legendHeight = 10;
        const legendX = 80;
        const legendY = height - 100;

        const defs = svg.append("defs");
        const linearGradient = defs.append("linearGradient")
          .attr("id", "legend-gradient")
          .attr("x1", "0%").attr("x2", "100%");

        linearGradient.selectAll("stop")
          .data(d3.range(0, 1.01, 0.1))
          .enter()
          .append("stop")
          .attr("offset", d => `${d * 100}%`)
          .attr("stop-color", d => colorScale(min + d * (max - min)));

        svg.append("rect")
          .attr("x", legendX - 10)
          .attr("y", legendY - 15)
          .attr("width", legendWidth + 20)
          .attr("height", 40)
          .attr("rx", 6)
          .attr("fill", "white")
          .attr("stroke", "#ccc")
          .attr("stroke-width", 0.5)
          .style("filter", "drop-shadow(0px 0px 5px rgba(0,0,0,0.15))");

        svg.append("g")
          .attr("transform", `translate(${legendX}, ${legendY})`)
          .append("rect")
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .style("fill", "url(#legend-gradient)");

        const legendScale = d3.scaleLinear()
          .domain([min, max])
          .range([0, legendWidth]);

        svg.append("g")
          .attr("transform", `translate(${legendX}, ${legendY + 15})`)
          .call(d3.axisBottom(legendScale).ticks(5).tickFormat(d => `${d}M`))
          .selectAll("text")
          .attr("class", "text-xs text-gray-700");
      })
      .catch(err => console.error("GeoJSON error:", err));
  }, [populationData, year, topCountries]);

  if (isLoading) return <div>Loading population data...</div>;
  if (isError) return <div>Error loading data.</div>;

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 bg-neutral-900 border rounded-lg shadow px-2 py-2">
        <label htmlFor="year-select" className="mr-2 text-sm font-medium">Select Year:</label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="text-sm border px-1 py-0.5 rounded"
        >
          {availableYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <svg ref={svgRef} />
      <div ref={tooltipRef} className="absolute bg-white border border-gray-300 rounded px-2 py-1 text-sm shadow-lg pointer-events-none" style={{ opacity: 0 }} />
    </div>
  );
};

export default PopulationChoropleth;
