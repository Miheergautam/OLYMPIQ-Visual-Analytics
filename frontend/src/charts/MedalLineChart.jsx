import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { useGetMedalsQuery } from "../store/api";

const MedalLineChart = () => {
  const { data: medalsData, isLoading, isError } = useGetMedalsQuery();
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [appliedCountries, setAppliedCountries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (medalsData) {
      const years = [...new Set(medalsData.map((d) => d.Year))].sort(
        (a, b) => b - a
      );
      setSelectedYear(years[0]);
    }
  }, [medalsData]);

  useEffect(() => {
    if (medalsData && selectedYear) {
      let yearData = medalsData.filter((d) => d.Year === selectedYear);
      const uniqueKeys = ["Gold", "Silver", "Bronze"];

      if (appliedCountries.length > 0) {
        yearData = yearData.filter((d) => appliedCountries.includes(d.Country));
      }

      const transformed = yearData.map((d) => ({
        name: d.Country,
        Gold: d.Gold,
        Silver: d.Silver,
        Bronze: d.Bronze,
      }));

      setFilteredData(transformed);
      setKeys(uniqueKeys);
    }
  }, [medalsData, selectedYear, appliedCountries]);

  useEffect(() => {
    if (!filteredData.length || !keys.length) return;

    const width = 960;
    const height = keys.length * 120;
    const marginTop = 20;
    const marginRight = 10;
    const marginBottom = 20;
    const marginLeft = 10;
    const legendWidth = 150;

    const x = new Map(
      keys.map((key) => [
        key,
        d3.scaleLinear(
          d3.extent(filteredData, (d) => d[key]),
          [marginLeft, width - marginRight]
        ),
      ])
    );

    const y = d3.scalePoint(keys, [marginTop, height - marginBottom]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3
      .line()
      .defined(([, value]) => value != null)
      .x(([key, value]) => x.get(key)(value))
      .y(([key]) => y(key));

    const svg = d3
      .select("#d3-chart")
      .html("")
      .append("svg")
      .attr("viewBox", [0, 0, width + legendWidth, height])
      .attr("width", width + legendWidth)
      .attr("height", height);

    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4)
      .selectAll("path")
      .data(
        filteredData.slice().sort((a, b) => d3.ascending(a["Gold"], b["Gold"]))
      )
      .join("path")
      .attr("stroke", (d) => color(d["name"]))
      .attr("d", (d) => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
      .append("title")
      .text((d) => d.name);

    svg
      .append("g")
      .selectAll("g")
      .data(keys)
      .join("g")
      .attr("transform", (d) => `translate(0,${y(d)})`)
      .each(function (d) {
        d3.select(this).call(d3.axisBottom(x.get(d)));
      })
      .call((g) =>
        g
          .append("text")
          .attr("x", marginLeft)
          .attr("y", -6)
          .attr("text-anchor", "start")
          .attr("fill", "currentColor")
          .text((d) => d)
      )
      .call((g) =>
        g
          .selectAll("text")
          .clone(true)
          .lower()
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke-linejoin", "round")
          .attr("stroke", "white")
      );

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20}, 20)`);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(
        filteredData
          .map((d) => d.name)
          .filter((value, index, self) => self.indexOf(value) === index)
      )
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 10)
      .attr("r", 6)
      .style("fill", (d) => color(d));

    legendItems
      .append("text")
      .attr("x", 15)
      .attr("y", 10)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("fill", "white")
      .text((d) => d);
  }, [filteredData, keys]);

  if (isLoading)
    return (
      <div className="text-center text-xl text-blue-500 animate-pulse">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="text-center text-red-500">
        Failed to load data. Please try again.
      </div>
    );

  const availableYears = [...new Set(medalsData.map((d) => d.Year))].sort(
    (a, b) => b - a
  );
  const availableCountries = [
    ...new Set(
      medalsData.filter((d) => d.Year === selectedYear).map((d) => d.Country)
    ),
  ].sort();

  return (
    <div className="p-6 bg-neutral-800 text-white rounded-lg border border-neutral-700 shadow-lg max-w-5xl">
      <h1 className="text-4xl font-semibold mb-6">
        MedalLineChart by Country
      </h1>
      {/* Year Selector */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Year</label>
        <select
          className="bg-neutral-700 text-white px-4 py-2 rounded w-full"
          value={selectedYear ?? ""}
          onChange={(e) => {
            setSelectedYear(Number(e.target.value));
            setAppliedCountries([]);
          }}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Country Filter */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Filter by Country</label>
        <div className="flex gap-3">
          <select
            className="bg-neutral-700 text-white px-4 py-1 rounded flex-1"
            multiple
            value={selectedCountries}
            onChange={(e) =>
              setSelectedCountries(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {availableCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <button
            className="bg-(--olympiq-blue) text-neutral-900 hover:text-(--olympiq-blue) hover:bg-neutral-700 px-4 py-2 rounded font-semibold transition"
            onClick={() => setAppliedCountries(selectedCountries)}
          >
            Apply
          </button>
        </div>
      </div>

      {/* D3 Chart */}
      <div id="d3-chart" className="overflow-x-auto" />
    </div>
  );
};

export default MedalLineChart;
