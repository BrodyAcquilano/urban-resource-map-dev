import React, { useState } from "react";
import "./ExportOptions.css";



function ExportOptions() {

  const [title, setTitle] = useState("");
const [includeFilters, setIncludeFilters] = useState(true);
const [includeAllDetails, setIncludeAllDetails] = useState(false);
const [includeSelectedDetails, setIncludeSelectedDetails] = useState(false);
const [orientation, setOrientation] = useState("portrait");
const [notes, setNotes] = useState("");

const handleTitleChange = (e) => setTitle(e.target.value);

const toggleFilters = () => setIncludeFilters((prev) => !prev);
const toggleAllDetails = () => setIncludeAllDetails((prev) => !prev);
const toggleSelectedDetails = () => setIncludeSelectedDetails((prev) => !prev);

const handleOrientationChange = (e) => setOrientation(e.target.value);

const handlePreview = () => {
  // You can implement preview logic later
  console.log("Previewing with:", {
    title,
    includeFilters,
    includeAllDetails,
    includeSelectedDetails,
    orientation,
    Notes
  });
};

const handleExport = () => {
  // You can implement actual export logic later
  console.log("Exporting PDF with same data");
};

  return (
    <div className="export-panel">
      <h1>Export Options</h1>


    <label>
  <strong>Header Title</strong>
  <input type="text" value={title} onChange={handleTitleChange} />
</label>


<label>
  <input type="checkbox" checked={includeFilters} onChange={toggleFilters} />
  Include Applied Filters
</label>

<label>
  <input type="checkbox" checked={includeAllDetails} onChange={toggleAllDetails} />
  List All Locations
</label>

<label>
  <input type="checkbox" checked={includeSelectedDetails} onChange={toggleSelectedDetails} />
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
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    rows={6}
    style={{ width: "100%", resize: "vertical" }}
    placeholder="Enter any additional information or instructions here..."
  />
</label>

  <button onClick={handlePreview}>Preview</button>
  <button onClick={handleExport}>Export as PDF</button>
</div>
    </div>
  );
}

export default ExportOptions;
