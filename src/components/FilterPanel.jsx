// src/components/FilterPanel.jsx

import React from "react";
import "./FilterPanel.css";

function FilterPanel({ tileStyle, setTileStyle }) {
  return (
    <div className="filter-panel">
      <h2>Filters</h2>

      {/* Global Filters */}
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
            <option value="Toner">Toner</option>
            <option value="TonerLite">Toner Lite</option>
            <option value="Watercolor">Watercolor</option>
            <option value="TerrainClassic">Terrain (Stamen)</option>
          </select>
        </label>
        <label>
          Season:
          <select>
            <option>Winter</option>
            <option>Spring</option>
            <option>Summer</option>
            <option>Fall</option>
          </select>
        </label>
        <label>
          Time of Day:
          <input type="time" defaultValue="07:00" />
        </label>
        <label>
          Accessibility:
          <input type="checkbox" /> Show accessible locations only
        </label>
      </section>

      {/* Essential Resources */}
      <section className="filter-group">
        <h3>Essential Resources</h3>
        <label>
          <input type="checkbox" /> Clean Air
        </label>
        <label>
          <input type="checkbox" /> Drinking Water
        </label>
        <label>
          <input type="checkbox" /> Food
        </label>
        <label>
          <input type="checkbox" /> Rest (Shelter)
        </label>
        <label>
          <input type="checkbox" /> Warmth / AC
        </label>
        <label>
          <input type="checkbox" /> Hygiene (Washrooms)
        </label>
      </section>

      {/* Essential Services */}
      <section className="filter-group">
        <h3>Essential Services</h3>
        <label>
          <input type="checkbox" /> Health Services
        </label>
        <label>
          <input type="checkbox" /> Housing Support
        </label>
        <label>
          <input type="checkbox" /> Job Support
        </label>
        <label>
          <input type="checkbox" /> Transportation
        </label>
      </section>

      {/* Comforts */}
      <section className="filter-group">
        <h3>Comforts</h3>
        <label>
          <input type="checkbox" /> Internet Access
        </label>
        <label>
          <input type="checkbox" /> Power Outlets
        </label>
        <label>
          <input type="checkbox" /> Seating
        </label>
        <label>
          <input type="checkbox" /> Exercise / Walking
        </label>
        <label>
          <input type="checkbox" /> Social Space
        </label>
      </section>
    </div>
  );
}

export default FilterPanel;
