// src/components/FilterPanel.jsx
import React, { useState, useEffect } from "react";
import "../styles/panels.css";
import { fetchSchemaByProjectName } from "../utils/schemaFetcher.js";
import {
  renderFiltersBySchema,
  matchesHoursFilter,
  buildSelectedFilters,
} from "../utils/FilterPanelHelpers.jsx";

function FilterPanel({
  mongoURI,
  schemas,
  currentSchema,
  setCurrentSchema,
  setCurrentCollection,
  tileStyle,
  setTileStyle,
  markers,
  setFilteredMarkers,
  setSelectedFilters,
  selectedLocation,
  setSelectedLocation,
}) {
  const [filterState, setFilterState] = useState({});

  // Reset filter state when schema changes
  useEffect(() => {
    if (!currentSchema) return;

    const initialState = {};
    currentSchema.sections.forEach((schemaSection) => {
      schemaSection.inputs.forEach((schemaInput) => {
        if (schemaInput.isFilter) {
          if (schemaInput.type === "number") {
            initialState[schemaInput.id] = { minValue: "", maxValue: "" };
          } else if (schemaInput.type === "hours") {
            initialState[schemaInput.id] = { day: "Any", time: "Any" };
          } else if (schemaInput.type === "dropdown") {
            initialState[schemaInput.id] = "Any";
          } else if (schemaInput.type === "checkbox") {
            initialState[schemaInput.id] = false;
          } else {
            initialState[schemaInput.id] = "";
          }
        }
      });
    });
    setFilterState(initialState);
  }, [currentSchema]);

  useEffect(() => {
    if (!currentSchema) return;

    const matchesFilter = (marker) => {
      for (
        let sectionIndex = 0;
        sectionIndex < currentSchema.sections.length;
        sectionIndex++
      ) {
        const schemaSection = currentSchema.sections[sectionIndex];
        const markerSection = marker.sections[sectionIndex];

        for (
          let inputIndex = 0;
          inputIndex < schemaSection.inputs.length;
          inputIndex++
        ) {
          const schemaInput = schemaSection.inputs[inputIndex];
          const markerInput = markerSection.inputs[inputIndex];

          if (!schemaInput.isFilter) continue;

          const filterValue = filterState[schemaInput.id];

          if (schemaInput.type === "text") {
            if (
              filterValue &&
              filterValue.trim() !== "" &&
              !markerInput.value
                .toLowerCase()
                .includes(filterValue.toLowerCase())
            ) {
              return false;
            }
          }

          if (schemaInput.type === "number") {
            const min = parseFloat(filterValue.minValue) || -Infinity;
            const max = parseFloat(filterValue.maxValue) || Infinity;
            const markerNumber = parseFloat(markerInput.value);
            if (
              markerInput.value !== "" &&
              (markerNumber < min || markerNumber > max)
            ) {
              return false;
            }
          }

          if (schemaInput.type === "checkbox") {
            if (filterValue && markerInput.value !== true) return false;
          }

          if (schemaInput.type === "dropdown") {
            if (
              filterValue &&
              filterValue !== "Any" &&
              filterValue !== markerInput.value
            ) {
              return false;
            }
          }

          if (schemaInput.type === "hours") {
            if (!matchesHoursFilter(filterValue, marker)) return false;
          }
        }
      }
      return true;
    };

    const filtered = markers.filter(matchesFilter);
    setFilteredMarkers(filtered);

    if (
      selectedLocation &&
      !filtered.some((marker) => marker._id === selectedLocation._id)
    ) {
      setSelectedLocation(null);
    }

   
  const updatedFilters = buildSelectedFilters(currentSchema, filterState);
    setSelectedFilters(updatedFilters);
    
  }, [
    markers,
    filterState,
    currentSchema,
    setFilteredMarkers,
    selectedLocation,
  ]);

  return (
    <div className="panel">
      <div className="section">
        <h2>Filter Panel</h2>
      </div>

      <div className="section">
        <h3>Global Settings</h3>

        {/* Project Selector */}
        <div className="form-group">
          <label>Select Project:</label>
          <select
            value={currentSchema?.projectName || ""}
            onChange={async (e) => {
              const selectedProjectName = e.target.value;
              const fetchedSchema = await fetchSchemaByProjectName(
                mongoURI,
                selectedProjectName
              );
              setCurrentSchema(fetchedSchema);
              setCurrentCollection(fetchedSchema.collectionName);
              setSelectedLocation(null);
            }}
          >
            {schemas.map((schema) => (
              <option key={schema.projectName} value={schema.projectName}>
                {schema.projectName}
              </option>
            ))}
          </select>
        </div>

        {/* Tile Style Selector */}
        <div className="form-group">
          <label>Map Style:</label>
          <select
            value={tileStyle}
            onChange={(e) => setTileStyle(e.target.value)}
          >
            <option value="Standard">Standard</option>
            <option value="Terrain">Terrain</option>
          </select>
        </div>
      </div>

      {/* Render Dynamic Filters */}
      {renderFiltersBySchema({
        schema: currentSchema,
        filterState,
        setFilterState,
      })}
    </div>
  );
}

export default FilterPanel;
