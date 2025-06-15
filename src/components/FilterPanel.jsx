// src/components/FilterPanel.jsx
import React, { useState, useEffect } from "react";
import {
  daysOfWeek,
  resources,
  services,
  amenities,
  timeOptionsAMPM,
  timeAMPMToMinutes,
} from "../data/dataModel.jsx";
import "./FilterPanel.css";

function FilterPanel({
  tileStyle,
  setTileStyle,
  markers,
  setFilteredMarkers,
  setSelectedFilters,
}) {
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [dayFilter, setDayFilter] = useState("Any");
  const [timeFilter, setTimeFilter] = useState("Any");

  const initCheckedState = (labels) =>
    Object.fromEntries(labels.map((label) => [label, false]));

  const [resourceChecks, setResourceChecks] = useState(
    initCheckedState(resources)
  );
  const [serviceChecks, setServiceChecks] = useState(
    initCheckedState(services)
  );
  const [amenityChecks, setAmenityChecks] = useState(
    initCheckedState(amenities)
  );

  const handleCheckboxChange = (key, checks, setChecks) => {
    // Toggle local checkbox state
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const filterMinutes =
      timeFilter !== "Any" ? timeAMPMToMinutes(timeFilter) : null;

    const matchesFilter = (marker) => {
      if (wheelchairOnly && !marker.wheelchairAccessible) return false;

      if (dayFilter !== "Any") {
        if (!marker.isLocationOpen?.[dayFilter]) return false;
        if (filterMinutes !== null) {
          const hours = marker.openHours?.[dayFilter];
          const open = timeAMPMToMinutes(hours?.open || "12:00 a.m.");
          const close = timeAMPMToMinutes(hours?.close || "12:00 a.m.");
          if (filterMinutes < open || filterMinutes > close) return false;
        }
      } else if (filterMinutes !== null) {
        const matchesAny = daysOfWeek.some((day) => {
          if (!marker.isLocationOpen?.[day]) return false;
          const hours = marker.openHours?.[day];
          const open = timeAMPMToMinutes(hours?.open || "12:00 a.m.");
          const close = timeAMPMToMinutes(hours?.close || "12:00 a.m.");
          return filterMinutes >= open && filterMinutes <= close;
        });
        if (!matchesAny) return false;
      }

      const allChecks = [
        [resourceChecks, marker.resources],
        [serviceChecks, marker.services],
        [amenityChecks, marker.amenities],
      ];

      return allChecks.every(([checks, values]) =>
        Object.entries(checks).every(([key, active]) =>
          active ? values?.[key] : true
        )
      );
    };

    setFilteredMarkers(markers.filter(matchesFilter));
  }, [
    markers,
    wheelchairOnly,
    dayFilter,
    timeFilter,
    resourceChecks,
    serviceChecks,
    amenityChecks,
    setFilteredMarkers,
  ]);

  const renderCheckboxGroup = (title, checks, setChecks) => (
    <section className="filter-group">
      <h3>{title}</h3>
      {Object.entries(checks).map(([label, checked]) => (
        <label key={label}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => handleCheckboxChange(label, checks, setChecks)}
          />
          {label}
        </label>
      ))}
    </section>
  );

  useEffect(() => {
    const filterMinutes =
      timeFilter !== "Any" ? timeAMPMToMinutes(timeFilter) : null;

    const matchesFilter = (marker) => {
      if (wheelchairOnly && !marker.wheelchairAccessible) return false;

      if (dayFilter !== "Any") {
        if (!marker.isLocationOpen?.[dayFilter]) return false;
        if (filterMinutes !== null) {
          const hours = marker.openHours?.[dayFilter];
          const open = timeAMPMToMinutes(hours?.open || "12:00 a.m.");
          const close = timeAMPMToMinutes(hours?.close || "12:00 a.m.");
          if (filterMinutes < open || filterMinutes > close) return false;
        }
      } else if (filterMinutes !== null) {
        const matchesAny = daysOfWeek.some((day) => {
          if (!marker.isLocationOpen?.[day]) return false;
          const hours = marker.openHours?.[day];
          const open = timeAMPMToMinutes(hours?.open || "12:00 a.m.");
          const close = timeAMPMToMinutes(hours?.close || "12:00 a.m.");
          return filterMinutes >= open && filterMinutes <= close;
        });
        if (!matchesAny) return false;
      }

      const allChecks = [
        [resourceChecks, marker.resources],
        [serviceChecks, marker.services],
        [amenityChecks, marker.amenities],
      ];

      return allChecks.every(([checks, values]) =>
        Object.entries(checks).every(([key, active]) =>
          active ? values?.[key] : true
        )
      );
    };

    setFilteredMarkers(markers.filter(matchesFilter));

    // Build selectedFilters array for export
    const updatedFilters = [];

    if (dayFilter !== "Any") {
      updatedFilters.push({ type: "day", label: dayFilter });
    }

    if (timeFilter !== "Any") {
      updatedFilters.push({ type: "time", label: timeFilter });
    }

    if (wheelchairOnly) {
      updatedFilters.push({ type: "accessibility", label: true });
    }

    const collectChecked = (checks, categoryLabel) => {
      const items = Object.entries(checks)
        .filter(([_, checked]) => checked)
        .map(([label]) => ({ type: "category-item", label }));

      return items.length
        ? [{ type: "category-header", label: categoryLabel }, ...items]
        : [];
    };

    updatedFilters.push(
      ...collectChecked(resourceChecks, "Resources"),
      ...collectChecked(serviceChecks, "Services"),
      ...collectChecked(amenityChecks, "Amenities")
    );

    setSelectedFilters(updatedFilters);
  }, [
    markers,
    wheelchairOnly,
    dayFilter,
    timeFilter,
    resourceChecks,
    serviceChecks,
    amenityChecks,
    setFilteredMarkers,
  ]);

  return (
    <div className="filter-panel">
      <h2>Filters</h2>

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
            <option value="Any">Any Time</option>
            {timeOptionsAMPM.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
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
          ♿ Wheelchair Accessible
        </label>
      </section>

      {renderCheckboxGroup("Resources", resourceChecks, setResourceChecks)}
      {renderCheckboxGroup("Services", serviceChecks, setServiceChecks)}
      {renderCheckboxGroup("Amenities", amenityChecks, setAmenityChecks)}
    </div>
  );
}

export default FilterPanel;
