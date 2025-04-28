import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useGetAllEducationExpenditureQuery } from "../store/api";

const StackedNormalizedAreaChart = () => {
  const { data: eduData, isLoading: eduLoading, isError: eduError } = useGetAllEducationExpenditureQuery();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedCountries, setSelectedCountries] = useState([]);

  const width = 960;
  const height = 500;
  const margin = { top: 20, right: 220, bottom: 50, left: 60 };

  useEffect(() => {
    if (!eduData) return;

    const allCountries = Array.from(new Set(eduData.map(d => d.Country))).sort();

    if (selectedCountries.length === 0) {
      setSelectedCountries(allCountries.slice(0, 5));
    }
  }, [eduData]);

  useEffect(() => {
    if (!eduData || selectedCountries.length === 0) return;

    const mergedData = eduData.map(d => ({
      country: d.Country,
      year: +d.Year,
      educationExp: +d["Education Exp (%GDP)"]
    }));

    const filteredData = mergedData.filter(d => selectedCountries.includes(d.country));
    const years = Array.from(new Set(filteredData.map(d => d.year))).sort((a, b) => a - b);

    const seriesData = years.map(year => {
      const entry= { year };
      selectedCountries.forEach(country => {
        const record = filteredData.find(d => d.year === year && d.country === country);
        entry[country] = record ? record.educationExp : 0;
      });
      return entry;
    });

    const stack = d3.stack()
      .keys(selectedCountries)
      .offset(d3.stackOffsetExpand);

    const series = stack(seriesData);

    const x = d3.scaleLinear()
      .domain(d3.extent(years))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(selectedCountries)
      .range(d3.schemeTableau10);

    const area = d3.area()
      .x(d => x(d.data.year))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveCatmullRom);

    const svg = d3.select(svgRef.current)
      .html("")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "auto");

    const tooltip = d3.select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#1f1f1f")
      .style("color", "#fff")
      .style("padding", "8px 14px")
      .style("border-radius", "8px")
      .style("font-size", "13px")
      .style("box-shadow", "0 2px 8px rgba(0,0,0,0.3)")
      .style("pointer-events", "none");

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickFormat(d3.format("d")))
      .call(g => g.selectAll("text").attr("fill", "white"))
      .call(g => g.select(".domain").remove());

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "14px")
      .text("Year");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5, "%"))
      .call(g => g.selectAll("text").attr("fill", "white"))
      .call(g => g.select(".domain").remove());

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "14px")
      .text("Education Exp (% of GDP)");

    svg.append("g")
      .selectAll("path")
      .data(series)
      .join("path")
      .attr("fill", d => color(d.key))
      .attr("d", area)
      .on("mousemove", (event, d) => {
        const [xm] = d3.pointer(event);
        const year = Math.round(x.invert(xm));

        const entry = d.find(seg => seg.data.year === year);
        if (entry) {
          const contribution = ((entry[1] - entry[0]) * 100).toFixed(2);
          tooltip
            .html(`<b>${d.key}</b><br>Year: ${year}<br>Contribution: ${contribution}%`)
            .style("top", (event.pageY - 50) + "px")
            .style("left", (event.pageX + 20) + "px")
            .style("visibility", "visible");
        }
      })
      .on("mouseleave", () => tooltip.style("visibility", "hidden"))
      .transition()
      .duration(1200)
      .attrTween("d", function(d) {
        const i = d3.interpolate(d.map(pt => [pt[0], pt[0]]), d);
        return function(t) {
          return area(i(t));
        };
      });

    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right + 30}, ${margin.top})`);

    selectedCountries.forEach((country, idx) => {
      const group = legend.append("g")
        .attr("transform", `translate(0, ${idx * 26})`);

      group.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color(country))
        .attr("rx", 4)
        .attr("ry", 4);

      group.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .attr("fill", "white")
        .style("font-size", "13px")
        .text(country);
    });
  }, [eduData, selectedCountries]);

  if (eduLoading) return <div className="text-white">Loading...</div>;
  if (eduError) return <div className="text-white">Error loading data.</div>;

  const allCountries = Array.from(new Set(eduData.map(d => d.Country))).sort();

  const handleCountryChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedCountries(options.map(opt => opt.value));
  };

  const selectAllCountries = () => setSelectedCountries(allCountries);

  return (
    <div className="p-6 relative bg-neutral-800 rounded-xl shadow-lg max-w-5xl">
      <h2 className="text-white text-4xl font-semibold mb-6">
        Stacked Normalized Area Chart: Education Expenditure
      </h2>

      <div className="flex flex-wrap gap-6 items-start mb-6 max-w-5xl">
        <div className="flex flex-col max-w-5xl">
          <label className="text-white text-sm mb-2">Select Countries:</label>
          <select
            multiple
            onChange={handleCountryChange}
            className="min-w-4xl h-22 p-2 rounded-md bg-zinc-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            {allCountries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <p className="text-gray-400 mt-2 text-xs">(Hold Ctrl/Command to select multiple)</p>
        </div>

        <button
          onClick={selectAllCountries}
          className="mt-3 px-5 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition"
        >
          Select All
        </button>
      </div>

      <div ref={svgRef}></div>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default StackedNormalizedAreaChart;
