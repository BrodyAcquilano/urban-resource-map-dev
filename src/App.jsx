// ─────────────────────────────────────────────
// 📦 External Library Imports
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

// ─────────────────────────────────────────────
// 🧩 Core Component Imports
// ─────────────────────────────────────────────
import Header from "./components/Header.jsx";
import FilterPanel from "./components/FilterPanel.jsx";
import MapPanel from "./components/MapPanel.jsx";

// ─────────────────────────────────────────────
// 📄 Page Routes
// ─────────────────────────────────────────────
import Home from "./pages/Home.jsx";
import Editor from "./pages/Editor.jsx";
import Export from "./pages/Export.jsx";

// ─────────────────────────────────────────────
// 🗺 Tile Style Options (Leaflet + OpenStreetMap)
// ─────────────────────────────────────────────
const TILE_STYLES = {
  Standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  Light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  Dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  Terrain: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
};

function App() {
  // ─────────────────────────────────────────────
  // 📊 Global State for Map + UI
  // ─────────────────────────────────────────────

  const [markers, setMarkers] = useState([]); // All location data from the database
  const [filteredMarkers, setFilteredMarkers] = useState([]); // Filtered view for the map
  const [showFilter, setShowFilter] = useState(true); // Toggle for Filter Panel
  const [selectedLocation, setSelectedLocation] = useState(null); // Selected location for Info or Edit
  const [tileStyle, setTileStyle] = useState("Standard"); // Current tile map style

  // 📡 Fetch all markers once on app load
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const res = await axios.get("/api/locations");
        setMarkers(res.data);
      } catch (err) {
        console.error("Failed to fetch markers:", err);
      }
    };
    fetchMarkers();
  }, []);

  // ─────────────────────────────────────────────
  // ⚙️ App Structure & Routing
  // ─────────────────────────────────────────────
  //
  // App.jsx is the root of the application. It renders shared elements (like the header, map, and filter panel)
  // across all routes. This avoids reloading data or state between pages.
  //
  // For example:
  // - Switching between Home, Editor, or Export keeps the same filtered markers.
  // - Shared components (e.g. MapPanel) remain mounted and responsive to updates.
  // - Only new route-specific panels (like modals or editors) get reloaded on navigation.
  //
  // This design improves performance and enables smooth workflow transitions.

  return (
    <div className="app-container">
      {/* Top Navigation Header */}
      <Header />

      {/* Main UI Layer */}
      <div className="main-layer">
        {/* Filter Panel Toggle Button */}
        <button
          className={`filter-side-toggle filter-toggle ${
            showFilter ? "" : "collapsed-toggle"
          }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          ☰
        </button>

        {/* Filter Panel */}
        <div
          className={`filter-overlay-panel filter-panel-wrapper ${
            showFilter ? "" : "collapsed"
          }`}
        >
          <FilterPanel
            tileStyle={tileStyle}
            setTileStyle={setTileStyle}
            markers={markers}
            setFilteredMarkers={setFilteredMarkers}
          />
        </div>

        {/* Map Display */}
        <MapPanel
          tileUrl={TILE_STYLES[tileStyle]}
          filteredMarkers={filteredMarkers}
          setSelectedLocation={setSelectedLocation}
        />

        {/* Page Routing */}
        <Routes>
          <Route
            path="/"
            element={<Home selectedLocation={selectedLocation} />}
          />
          <Route
            path="/editor"
            element={
              <Editor
                setMarkers={setMarkers}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            }
          />
          <Route path="/export" element={<Export />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;



// ─────────────────────────────────────────────
// 🌐 REACT APP STRUCTURE & GLOBAL WORKFLOWS
// ─────────────────────────────────────────────

// ⬛ ROOT STRUCTURE (App.jsx)
// The root of the app stores global information needed every time the app starts.
// This includes:
// - Data that should persist between page changes (e.g. React Router navigation).
// - Shared state across components (e.g. filters, selected markers, base data).
// - Things that improve performance and user experience by avoiding unnecessary reloads.

// Keeping state here improves efficiency, modularity, and functional consistency across routes.

// ─────────────────────────────
// 📌 CLIENT-SIDE WORKFLOWS
// ─────────────────────────────

// ── 🧭 VIEWING CONTROLS WORKFLOW (Home Page) ──
// Purpose: To help users discover *free resources* and *public services*—not just commercial businesses.
// Useful for people who don’t know what keywords to search on Google (e.g., “free water”, “shower”, “outdoor washroom”).

// Why it’s different from Google Maps:
// 1. No search bar needed — users can filter by needs, not names.
// 2. All displayed data is curated — not based on ads, SEO, or user popularity.
// 3. Could be used as:
//    ✅ a public utility for social good
//    💰 or monetized (e.g., sponsored listings).

// Advanced extensions:
// - Highlight resource density (e.g. green = many resources, red = none).
// - Visualize social or physical risk (hostile zones, accessibility deserts).
// - Add route analysis (safe corridors, transit access, bike/walk paths).

// Filtering precision comes from the data model:
// - You can add new labels and filters to highlight seasonal or time-based differences.
//   For example: “Free meals every Tuesday at 6 PM” could be added as an exception dataset.

// ⚠️ Current logic assumes resources are *always* available when a location is open.
//   But this is not the same as tracking:
//   “Location open” at time T ⧸= “Resource available” at time T.

// Possible upgrade: layered data model for specific-time availability.

// ▶ Input → FilterPanel.jsx (user filters)
// ▶ Output → MapPanel.jsx (filtered markers on map)

// ── 📄 EXPORT WORKFLOW (Export Page) ──
// Purpose: Share map data with others — especially those without digital access or with accessibility needs.

// Use cases:
// - Send a PDF map to someone who doesn’t use computers
// - Print a version for outreach work or emergencies
// - Customize what’s shown before printing

// Integration with viewing controls:
// - Export uses the same filter panel as the map view
// - No need to reconfigure settings — preview updates live
// - Once filtered, user can export a ready-to-use PDF

// ▶ Input → ExportOptionsPanel.jsx (export controls)
// ▶ Output → ExportPreviewModal.jsx (PDF preview & export)
// ▶ Shared Input → FilterPanel.jsx
// ▶ Shared Output → MapPanel.jsx

// ── ✏️ DATA MANAGEMENT WORKFLOW (Editor Page) ──
// Purpose: Add, edit, or delete location data — either as an admin tool or crowdsourced platform.

// Modes of use:
// - Open-source: anyone can contribute
// - Restricted access: require admin login (e.g. for agencies or moderators)

// Current setup is open-source, but can easily be secured by gating the Editor route.

// ▶ Input → AddLocationModal.jsx (new data submission)
// ▶ Input → EditLocationPanel.jsx (edit/update existing data)
// ▶ Input → EditLocationPanel.jsx (delete location)
// ▶ Shared Input → FilterPanel.jsx (test filters after changes)
// ▶ Shared Output → MapPanel.jsx (see changes reflected immediately)

// 🔄 Real-time validation:
// - After edits, user can verify location changes visually
// - Filter to confirm a tag or category was applied correctly
// - Ensures map reflects the true state of the database without page reloads

// ─────────────────────────────
// 🔁 STREAM FLOW SUMMARIES
// ─────────────────────────────

// Add Workflow:
// Input → AddLocationModal.jsx → FilterPanel.jsx → MapPanel.jsx → Output

// Edit Workflow:
// Input → EditLocationModal.jsx → FilterPanel.jsx → MapPanel.jsx → Output

// Export Workflow:
// Input → FilterPanel.jsx → MapPanel.jsx → ExportPreviewModal.jsx → PDF