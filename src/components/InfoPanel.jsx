// src/components/InfoPanel.jsx
import React from "react";
import "../styles/panels.css";
import { renderInfoPanelBySchema } from "../utils/InfoPanelHelpers.jsx";

function InfoPanel({ selectedLocation, currentSchema }) {
  if (!selectedLocation) {
    return (
      <div className="panel">
        <div className="section">
          <h2>Info Panel</h2>
        </div>
        <p>Select a marker to view details</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="section">
        <h2>Info Panel</h2>
      </div>

      {renderInfoPanelBySchema(selectedLocation, currentSchema)}
    </div>
  );
}

export default InfoPanel;
