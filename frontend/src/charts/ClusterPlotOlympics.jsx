import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Select from "react-select";
import {
  useGetAllPopulationQuery,
  useGetAllStabilityQuery,
  useGetMedalsQuery,
} from "../store/api";

const ClusterPlotOlympics = () => {
  const { data: populationData } = useGetAllPopulationQuery();
  const { data: stabilityData } = useGetAllStabilityQuery();
  const { data: medalsData } = useGetMedalsQuery();
  const svgRef = useRef();
  const [mergedData, setMergedData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2000);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const handleYearChange = (e) => setSelectedYear(+e.target.value);
  const handleCountryChange = (opts) =>
    setSelectedCountries(opts ? opts.map((o) => o.value) : []);

  useEffect(() => {
    if (!populationData || !stabilityData || !medalsData) return;

    const parse = (v) => (isNaN(+v) ? NaN : +v);

    const popMap = d3.group(populationData, (d) => d.Country + ":" + d.Year);
    const stabMap = d3.group(stabilityData, (d) => d.Country + ":" + d.Year);
    const medalMap = d3.rollup(
      medalsData,
      (v) => d3.sum(v, (d) => d.Gold + d.Silver + d.Bronze),
      (d) => d.Country + ":" + d.Year
    );

    const avgPSI = d3.rollup(
      stabilityData.filter((d) => !isNaN(parse(d["Political Stability Index"]))),
      (v) => d3.mean(v, (d) => parse(d["Political Stability Index"])),
      (d) => d.Country
    );

    const avgPop = d3.rollup(
      populationData.filter((d) => !isNaN(parse(d.Population))),
      (v) => d3.mean(v, (d) => parse(d.Population)),
      (d) => d.Country
    );

    const final = [];
    new Set(populationData.map((d) => d.Country)).forEach((country) => {
      const key = country + ":" + selectedYear;
      const popEntry = popMap.get(key)?.[0];
      const stabEntry = stabMap.get(key)?.[0];

      const population = popEntry ? parse(popEntry.Population) : avgPop.get(country) || 0;
      const psi = stabEntry ? parse(stabEntry["Political Stability Index"]) : avgPSI.get(country) || 0;
      const medals = medalMap.get(key) || 0;

      if (!isNaN(population) && !isNaN(psi) && !isNaN(medals)) {
        final.push({ country, population, psi, medals });
      }
    });

    fetch("http://localhost:8000/api/clusteranalysis/cluster", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(final),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((clustered) => {
        const filtered = selectedCountries.length
          ? clustered.filter((d) => selectedCountries.includes(d.country))
          : clustered;
        setMergedData(filtered);
      })
      .catch(console.error);
  }, [populationData, stabilityData, medalsData, selectedYear, selectedCountries]);

  useEffect(() => {
    if (!mergedData.length) return;

    const width = 800;
    const height = 600;
    const margin = { top: 60, right: 40, bottom: 80, left: 80 };

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("background", "#"); // Tailwind's neutral-800
    svg.selectAll("*").remove();

    const container = svg.append("g");
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain(d3.extent(mergedData, (d) => d.population)).nice()
      .range([0, innerWidth]);
    const y = d3.scaleLinear()
      .domain(d3.extent(mergedData, (d) => d.psi)).nice()
      .range([innerHeight, 0]);
    const size = d3.scaleSqrt()
      .domain([0, d3.max(mergedData, (d) => d.medals)])
      .range([4, 20]);
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const chart = container.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    chart.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
      .style("fill", "white");

    chart.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("fill", "white");

    chart.selectAll("circle")
      .data(mergedData)
      .join("circle")
      .attr("cx", (d) => x(d.population))
      .attr("cy", (d) => y(d.psi))
      .attr("r", (d) => size(d.medals))
      .attr("fill", (d) => color(d.cluster))
      .attr("opacity", 0.8)
      .append("title")
      .text((d) => `${d.country}\nPopulation: ${d.population}\nPSI: ${d.psi}\nMedals: ${d.medals}`);

    chart.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 50)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Population");

    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -50)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Political Stability Index (PSI)");
  }, [mergedData]);

  const allCountries = populationData
    ? Array.from(new Set(populationData.map((d) => d.Country))).sort()
    : [];

  return (
    <div className="p-6 text-white bg-neutral-800 shadow-md rounded-xl max-w-5xl space-y-6">
      <h2 className="text-4xl font-semibold">Olympic Cluster Plot</h2>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Select Year</label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-neutral-700 text-white border border-neutral-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2000, 2004, 2008, 2012, 2016, 2020, 2024].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full md:w-1/2">
          <label className="mb-1 text-sm font-medium">Filter Countries</label>
          <Select
            isMulti
            options={allCountries.map((c) => ({ value: c, label: c }))}
            onChange={handleCountryChange}
            className="text-black"
            styles={{

              control: (base) => ({
                ...base,
                backgroundColor: "#", // Tailwind neutral-700
                borderColor: "#4", // Tailwind neutral-600
                color: "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1F2937", // Tailwind neutral-800
                color: "white",
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#4B5563",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "white",
              }),
            }}
          />
        </div>
      </div>

      <svg ref={svgRef} className="w-full h-[600px] rounded-lg" />
    </div>
  );
};

export default ClusterPlotOlympics;
