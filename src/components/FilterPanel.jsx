import React, { useState, useEffect } from "react";
import "./FilterPanel.css";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const generateTimeOptions = () => {
  const options = [{ label: "Any Time", value: "Any" }];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h = hour.toString().padStart(2, "0");
      const m = min.toString().padStart(2, "0");
      const value = `${h}:${m}`;
      const label = new Date(`1970-01-01T${value}:00`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      options.push({ label, value });
    }
  }
  return options;
};

function FilterPanel({ tileStyle, setTileStyle, markers, setFilteredMarkers }) {
  const [wheelchairOnly, setWheelchairOnly] = useState(false);

  // New time filtering state
  const [dayFilter, setDayFilter] = useState("Any");
  const [timeFilter, setTimeFilter] = useState("Any");

  // Resource States
  const [resources, setResources] = useState({
    "Warming Centre": false,
    "Cooling Centre": false,
    "Clean Air Space": false,
    "Drinking Water": false,
    Meals: false,
    "Shelter Space": false,
    Washrooms: false,
    "Hygiene Products": false,
    "Tampons or Pads": false,
    Showers: false,
    "Community Centre": false,
    "Food Bank": false,
    Clothing: false,
    Storage: false,
  });

  // Service States
  const [services, setServices] = useState({
    "Health Services": false,
    "Mental Health Services": false,
    "Addiction Services": false,
    "Harm Reduction Services": false,
    "Housing Services": false,
    "Legal Aid Services": false,
    "Employment Services": false,
    "Financial Assistance Services": false,
    "Identification Services": false,
    "Interpretation Services": false,
    "Community Outreach": false,
    "Accessibility Services": false,
    "Transportation Services": false,
  });

  // Comfort States
  const [comforts, setComforts] = useState({
    "Wi-Fi": false,
    "Charging Stations": false,
    "Indoor Seating": false,
    "Outdoor Seating": false,
    "Pet Friendly": false,
    "Quiet Space": false,
    "Public Computer Access": false,
    "Library Access": false,
    "Art or Music Programs": false,
    "Exercise Space": false,
    "Social Space": false,
    "Private Space": false,
    "Low-Intervention Environment": false,
    "Nap or Sleep": false,
    "No Purchases Required": false,
  });

  const timeToMinutesA = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour * 60 + minute;
};

  const timeToMinutesB = (timeStr) => {
    const cleaned = timeStr.trim().toLowerCase(); // e.g. "9:00 a.m." → "9:00 a.m."
    const [timePart, period] = cleaned.split(/\s+/); // splits into ["9:00", "a.m."]

    if (!timePart || !period) return 0;

    let [hour, minute] = timePart.split(":").map(Number);

    if (period === "p.m." && hour !== 12) {
      hour += 12;
    } else if (period === "a.m." && hour === 12) {
      hour = 0;
    }

    return hour * 60 + minute;
  };



  useEffect(() => {
    const activeResources = Object.entries(resources)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const activeServices = Object.entries(services)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const activeComforts = Object.entries(comforts)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const filtered = markers.filter((marker) => {
  if (wheelchairOnly && !marker.wheelchairAccessible) return false;

  const applyTimeFilter = timeFilter !== "Any";
  const applyDayFilter = dayFilter !== "Any";
  const filterMinutes = applyTimeFilter ? timeToMinutesA(timeFilter) : null;

  // CASE 1: Specific day filter, no time filter → check isOpen that day
  if (!applyTimeFilter && applyDayFilter) {
    if (!marker.isLocationOpen?.[dayFilter]) return false;
  }

  // CASE 2: Specific day + specific time → check isOpen and open/close for that day
  if (applyTimeFilter && applyDayFilter) {
    if (!marker.isLocationOpen?.[dayFilter]) return false;
    const hours = marker.openHours?.[dayFilter];
    if (!hours) return false;

    const open = timeToMinutesB(hours.open || "00:00");
    const close = timeToMinutesB(hours.close || "00:00");
    if (filterMinutes < open || filterMinutes > close) return false;
  }

  // CASE 3 & 4: dayFilter is "Any"
  if (!applyDayFilter) {
    let anyDayMatches = false;
    let anyTimeMatches = false;

    for (const day of daysOfWeek) {
      const isOpen = marker.isLocationOpen?.[day];
      if (isOpen) anyDayMatches = true;

      if (applyTimeFilter && isOpen) {
        const hours = marker.openHours?.[day];
        if (!hours) continue;

        const open = timeToMinutesB(hours.open || "00:00");
        const close = timeToMinutesB(hours.close || "00:00");

        if (filterMinutes >= open && filterMinutes <= close) {
          anyTimeMatches = true;
          break;
        }
      }
    }

    // If no days are open at all
    if (!anyDayMatches) return false;

    // If time filter is applied, and no open time matched
    if (applyTimeFilter && !anyTimeMatches) return false;
  }

  // Resource filters
  for (let res of activeResources) {
    if (!marker.resources?.[res]) return false;
  }

  // Service filters
  for (let srv of activeServices) {
    if (!marker.services?.[srv]) return false;
  }

  // Comfort filters
  for (let com of activeComforts) {
    if (!marker.comforts?.[com]) return false;
  }

  return true;
});

    setFilteredMarkers(filtered);
  }, [
    resources,
    services,
    comforts,
    wheelchairOnly,
    dayFilter,
    timeFilter,
    markers,
    setFilteredMarkers,
  ]);

  const handleCheckboxChange = (key, state, setState) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="filter-panel">
      <h2>Filters</h2>

      {/* GLOBAL SETTINGS */}
      <section className="filter-group">
        <h3>Global Settings</h3>
        <label>
          Map Style:
          <select
            value={tileStyle}
            onChange={(e) => setTileStyle(e.target.value)}
          >
            <option value="Standard">Standard</option>
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="Terrain">Terrain</option>
          </select>
        </label>

        <label>
          Day of Week:
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
          >
            <option value="Any">Any Day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <label>
          Time of Day:
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            {generateTimeOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={wheelchairOnly}
            onChange={() => setWheelchairOnly(!wheelchairOnly)}
          />{" "}
          Show accessible locations only
        </label>
      </section>
      <section className="filter-group">
        <h3>Resources</h3>
        {Object.keys(resources).map((label) => (
          <label key={label}>
            <input
              type="checkbox"
              checked={resources[label]}
              onChange={() =>
                handleCheckboxChange(label, resources, setResources)
              }
            />
            {label}
          </label>
        ))}
      </section>

      <section className="filter-group">
        <h3>Services</h3>
        {Object.keys(services).map((label) => (
          <label key={label}>
            <input
              type="checkbox"
              checked={services[label]}
              onChange={() =>
                handleCheckboxChange(label, services, setServices)
              }
            />
            {label}
          </label>
        ))}
      </section>

      <section className="filter-group">
        <h3>Comforts</h3>
        {Object.keys(comforts).map((label) => (
          <label key={label}>
            <input
              type="checkbox"
              checked={comforts[label]}
              onChange={() =>
                handleCheckboxChange(label, comforts, setComforts)
              }
            />
            {label}
          </label>
        ))}
      </section>
    </div>
  );
}

export default FilterPanel;
