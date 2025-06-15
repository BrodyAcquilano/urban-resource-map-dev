import React, { useState } from "react";
import "./ExportOptions.css";

function ExportOptions({
  setTitle,
  setIncludeFilters,
  setIncludeAllLocations,
  setIncludeSelected,
  orientation,
  setOrientation,
  setNotes,
}) {
  const handleTitleChange = (e) => setTitle(e.target.value);
  const toggleFilters = () => setIncludeFilters((prev) => !prev);
  const toggleAllLocations = () => setIncludeAllLocations((prev) => !prev);
  const toggleSelected = () => setIncludeSelected((prev) => !prev);
  const handleOrientationChange = (e) => setOrientation(e.target.value);

  return (
    <div className="export-panel">
      <h1>Export Options</h1>

      <label>
        <strong>Header Title</strong>
        <input type="text" onChange={handleTitleChange} />
      </label>

      <label>
        <input type="checkbox" onChange={toggleFilters} />
        Include Applied Filters
      </label>

      <label>
        <input type="checkbox" onChange={toggleAllLocations} />
        List All Locations
      </label>

      <label>
        <input type="checkbox" onChange={toggleSelected} />
        List Selected Location Details
      </label>

      <div className="orientation-group">
        <label>
          <input
            type="radio"
            name="orientation"
            value="portrait"
            checked={orientation === "portrait"}
            onChange={handleOrientationChange}
          />
          Portrait
        </label>
        <label>
          <input
            type="radio"
            name="orientation"
            value="landscape"
            checked={orientation === "landscape"}
            onChange={handleOrientationChange}
          />
          Landscape
        </label>
      </div>
      <div>
        <label>
          <strong>Additional Notes</strong>
          <textarea
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            style={{ width: "100%", resize: "vertical" }}
            placeholder="Enter any additional information or instructions here..."
          />
        </label>
      </div>
    </div>
  );
}

export default ExportOptions;
