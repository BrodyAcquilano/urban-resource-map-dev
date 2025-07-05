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
  markersReady,
  setMarkersReady,
  setFilteredMarkers,
  setSelectedFilters,
  selectedLocation,
  setSelectedLocation,
}) {
  const [filterState, setFilterState] = useState({});
  const [filterStateReady, setFilterStateReady] = useState(false);

  //Get the new project schema from the database and set the collection.
  const handleSchemaChange = async (selectedProjectName) => {
  setFilterStateReady(false);
  setMarkersReady(false);
  const fetchedSchema = await fetchSchemaByProjectName(mongoURI, selectedProjectName);
  setCurrentSchema(fetchedSchema);
  setCurrentCollection(fetchedSchema.collectionName);
  setSelectedLocation(null);
};

  // Reset filter state when schema changes
 useEffect(() => {
  if (!currentSchema) return;

  const initialState = {};
  currentSchema.sections.forEach((schemaSection) => {
    schemaSection.inputs.forEach((schemaInput) => {
      if (schemaInput.isFilter) {
        if (schemaInput.type === "number") {
          initialState[schemaInput.id] = { min: "", max: "" };
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
  setFilterStateReady(true); 
}, [currentSchema]);

//Filter Markers, and generate a list of active filters.
  useEffect(() => {
    if (!currentSchema ||  !markersReady || !filterStateReady || Object.keys(filterState).length === 0) return;

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
            const min =
              filterValue.min !== "" && filterValue.min != null
                ? parseFloat(filterValue.min)
                : -Infinity;
            const max =
              filterValue.max !== "" && filterValue.max != null
                ? parseFloat(filterValue.max)
                : Infinity;
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
    markersReady,
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
  onChange={(e) => handleSchemaChange(e.target.value)}
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
