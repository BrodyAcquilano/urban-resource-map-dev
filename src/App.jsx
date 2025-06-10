import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import FilterPanel from "./components/FilterPanel.jsx";
import MapPanel from "./components/MapPanel.jsx";

import Home from "./pages/Home.jsx";
import Editor from "./pages/Editor.jsx";
import Export from "./pages/Export.jsx";

const TILE_STYLES = {
  Standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",                     // OSM default
  Light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",           // Carto Light
  Dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",             // Carto Dark
  Terrain: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",                       // OpenTopoMap (terrain-style)
  Toner: "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",              // Stamen Toner (high contrast)
  TonerLite: "https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png",     // Stamen Toner Lite
  Watercolor: "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",   // Stamen Watercolor
  TerrainClassic: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"   // Stamen Terrain (older terrain source)
};


function App() {
  const [showFilter, setShowFilter] = useState(true);

  const [tileStyle, setTileStyle] = useState("Standard");

  return (
    <div className="app-container">
      <Header />
      <div className="main-layer">
        <MapPanel tileUrl={TILE_STYLES[tileStyle]}/>

        {/* Filter Panel Toggle + Panel */}
        <button
          className={`filter-side-toggle filter-toggle ${
            showFilter ? "" : "collapsed-toggle"
          }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          ☰
        </button>
        <div
          className={`filter-overlay-panel filter-panel-wrapper ${
            showFilter ? "" : "collapsed"
          }`}
        >
          <FilterPanel tileStyle={tileStyle} setTileStyle={setTileStyle} />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/export" element={<Export />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
