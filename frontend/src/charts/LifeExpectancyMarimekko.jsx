import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { useGetAllLifeExpectancyQuery } from "../store/api";

const LifeExpectancyMarimekko = () => {
  const {
    data: lifeData = [],
    isLoading,
    isError,
  } = useGetAllLifeExpectancyQuery();

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [averageLifeExpectancy, setAverageLifeExpectancy] = useState(0);
  const chartRef = useRef(null);

  // Initialize year and some selected countries
  useEffect(() => {
    if (lifeData.length) {
      const years = Array.from(new Set(lifeData.map((d) => d.Year))).sort(
        (a, b) => b - a
      );
      setSelectedYear(years[0]);

      const countriesThisYear = lifeData
        .filter((d) => d.Year === years[0])
        .map((d) => d.Country);
      // Pick a few countries that exist
      const preSelected = countriesThisYear.filter((c) =>
        ["United States", "India", "China", "Germany", "Brazil"].includes(c)
      );
      setSelectedCountries(
        preSelected.length ? preSelected : countriesThisYear.slice(0, 5)
      );
    }
  }, [lifeData]);

  // Filter data and calculate average
  useEffect(() => {
    if (!lifeData.length || selectedYear == null) return;

    let data = lifeData.filter((d) => d.Year === selectedYear);
    if (selectedCountries.length) {
      data = data.filter((d) => selectedCountries.includes(d.Country));
    }

    setFilteredData(
      data.map((d) => ({ name: d.Country, value: +d["Life Expectancy"] }))
    );

    const total = data.reduce((sum, d) => sum + d["Life Expectancy"], 0);
    setAverageLifeExpectancy(data.length ? total / data.length : 0);
  }, [lifeData, selectedYear, selectedCountries]);

  // Draw the Marimekko chart
  useEffect(() => {
    if (!filteredData.length || !chartRef.current) return;

    const containerWidth = chartRef.current.offsetWidth;
    const width = containerWidth || 800;
    const height = 500;
    const margin = { top: 60, right: 20, bottom: 60, left: 100 };

    const total = d3.sum(filteredData, (d) => d.value);
    const x = d3
      .scaleLinear()
      .domain([0, total])
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleBand()
      .domain(filteredData.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const color = d3
      .scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(filteredData, (d) => d.value));

    const svg = d3
      .select(chartRef.current)
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    let cum = 0;
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#222")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("font-size", "14px")
      .style("visibility", "hidden")
      .style("pointer-events", "none");

    svg
      .append("g")
      .selectAll("rect")
      .data(filteredData)
      .join("rect")
      .attr("x", (d) => {
        const x0 = x(cum);
        cum += d.value;
        return x0;
      })
      .attr("y", (d) => y(d.name))
      .attr("height", y.bandwidth())
      .attr("width", (d) => x(d.value) - x(0))
      .attr("fill", (d) => color(d.value))
      .attr("stroke", "#222")
      .on("mouseover", (event, d) => {
        tooltip
          .html(`<strong>${d.name}</strong><br/>${d.value.toFixed(1)} years`)
          .style("visibility", "visible");
        d3.select(event.currentTarget).attr("opacity", 0.8);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", (event) => {
        tooltip.style("visibility", "hidden");
        d3.select(event.currentTarget).attr("opacity", 1);
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
      .attr("fill", "#ccc");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("fill", "#ccc");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#eee")
      .style("font-size", "18px")
      .text(
        `Average Life Expectancy: ${averageLifeExpectancy.toFixed(1)} years`
      );
  }, [filteredData, averageLifeExpectancy]);

  if (isLoading)
    return <div className="text-white text-center">Loading...</div>;
  if (isError)
    return <div className="text-red-500 text-center">Failed to load data.</div>;

  const years = Array.from(new Set(lifeData.map((d) => d.Year))).sort(
    (a, b) => b - a
  );
  const countries = Array.from(
    new Set(
      lifeData.filter((d) => d.Year === selectedYear).map((d) => d.Country)
    )
  ).sort();

  const handleCountryChange = (country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  return (
    <div className="p-6 max-w-5xl bg-neutral-800 text-white rounded-lg border border-neutral-700 shadow-md">
      {/* Header */}
      <h2 className="text-4xl font-bold mb-8">
        Life Expectancy Marimekko Chart
      </h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block mb-2 text-sm font-semibold">
            Select Year
          </label>
          <select
            className="bg-neutral-700 border border-neutral-600 text-white rounded-lg px-4 py-2 w-full"
            value={selectedYear ?? ""}
            onChange={(e) => {
              setSelectedYear(Number(e.target.value));
              setSelectedCountries([]);
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold">
            Select Countries
          </label>
          <div className="bg-neutral-700 border border-neutral-600 rounded-lg p-3 h-22 overflow-y-scroll">
            {countries.map((c) => (
              <div key={c} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={c}
                  value={c}
                  checked={selectedCountries.includes(c)}
                  onChange={() => handleCountryChange(c)}
                  className="mr-2 accent-indigo-500"
                />
                <label htmlFor={c} className="text-sm">
                  {c}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        ref={chartRef}
        className="relative w-full"
        style={{ minHeight: "500px" }}
      />
    </div>
  );
};

export default LifeExpectancyMarimekko;
