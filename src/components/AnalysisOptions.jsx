import React from "react";
import "./AnalysisOptions.css";
import {
  resources,
  services,
  amenities,
  renderCheckedItems,
} from "../data/dataModel.jsx";

function AnalysisOptions({ selectedLocation }) {
  if (!selectedLocation) {
    return (
      <div className="options-panel">
        <h2>Analysis Options</h2>
        <p>Select a marker to view details</p>
      </div>
    );
  }



  return (
    <div className="options-panel">
      <h2>Analysis Options</h2>
        <p>Coming Soon...</p>
    </div>
  );
}

export default AnalysisOptions;
