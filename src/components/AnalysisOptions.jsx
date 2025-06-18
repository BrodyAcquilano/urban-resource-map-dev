import React, { useState } from "react";
import * as turf from "@turf/turf";
import "./AnalysisOptions.css";

const patchColors = [
  "#800026", // red
  "#FC4E2A", // orange
  "#FFD700", // yellow
  "#228B22", // green
];

function AnalysisOptions({ markers, setHeatMap }) {
  const [resourceType, setResourceType] = useState("resources");
  const [analysisType, setAnalysisType] = useState("patch_corridor");
  const [bufferRadius, setBufferRadius] = useState(1000);
  const [minPercentile, setMinPercentile] = useState(0);
  const [maxPercentile, setMaxPercentile] = useState(80);
  const [resolution, setResolution] = useState(100);

  const normalize = (value, min, max) =>
    max !== min ? (value - min) / (max - min) : 1;

  const calculateScore = (scores = {}, flags = {}) => {
    const values = Object.entries(flags)
      .filter(([key, enabled]) => enabled)
      .map(([key]) => scores[key] ?? 0);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };


  function interpolateColor(value) {
    value = Math.max(0, Math.min(1, value));
    const hue = value * 120; // 0 = red, 120 = green
    return `hsl(${hue}, 100%, 50%)`;
  }

  const influenceFromDistance = (distance, radius) => {
    if (distance > radius) return 0;
    const decay = 1 - distance / radius;
    return Math.sqrt(decay);
  };

  const getPercentile = (arr, percentile) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return (
      sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower])
    );
  };

  const getScore = (marker) => {
    let types = [];
    if (resourceType === "all") {
      types = ["resources", "services", "amenities"];
    } else if (resourceType === "resources_amenities") {
      types = ["resources", "amenities"];
    } else if (resourceType === "resources_services") {
      types = ["resources", "services"];
    } else if (resourceType === "services_amenities") {
      types = ["services", "amenities"];
    } else {
      types = [resourceType];
    }

    const allScores = types.map((type) =>
      calculateScore(marker.scores?.[type], marker[type])
    );
    return allScores.reduce((a, b) => a + b, 0) / allScores.length;
  };

 

  const generateResourceDensityMap=() => {
  // Step 1: Score and normalize markers
  const scoredMarkers = markers.map((m) => ({ ...m, score: getScore(m) }));
  const scores = scoredMarkers.map((m) => m.score);

  const min = getPercentile(scores, minPercentile);
  const max = getPercentile(scores, maxPercentile);

  const normalizedMarkers = scoredMarkers.map((m) => ({
    ...m,
    normalized: normalize(m.score, min, max),
  }));

  // Step 2: Calculate bounds
  const allPoints = normalizedMarkers.map((m) =>
    turf.point([m.longitude, m.latitude])
  );
  const bbox = turf.bbox(turf.featureCollection(allPoints));
  let [minLng, minLat, maxLng, maxLat] = bbox;

  const expandLng = (maxLng - minLng) * 0.1;
  const expandLat = (maxLat - minLat) * 0.1;
  minLng -= expandLng;
  maxLng += expandLng;
  minLat -= expandLat;
  maxLat += expandLat;

  // Step 3: Iterate grid and calculate weighted influence
  const cols = resolution;
  const rows = resolution;
  const latStep = (maxLat - minLat) / rows;
  const lngStep = (maxLng - minLng) / cols;
  const pixels = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const lat = maxLat - y * latStep;
      const lng = minLng + x * lngStep;
      const pixelPoint = turf.point([lng, lat]);

      let totalInfluence = 0;
      let totalWeight = 0;

      for (const m of normalizedMarkers) {
        const dist = turf.distance(
          pixelPoint,
          turf.point([m.longitude, m.latitude]),
          { units: "kilometers" }
        );

        const proximityInfluence = influenceFromDistance(dist * 1000, bufferRadius);
        if (proximityInfluence > 0) {
          totalInfluence += proximityInfluence * m.normalized;
          totalWeight += proximityInfluence;
        }
      }

      const value = totalWeight > 0 ? totalInfluence / totalWeight : 0;
      const color = interpolateColor(value);

      pixels.push({ x, y, value, color });
    }
  }

  // Step 4: Output result
  setHeatMap({
    pixels,
    bounds: [
      [minLat, minLng],
      [maxLat, maxLng],
    ],
  });
};

 const generatePatchCorridorMap = () => {
  const allPoints = markers.map((m) =>
    turf.point([m.longitude, m.latitude], { marker: m })
  );

  const bbox = turf.bbox(turf.featureCollection(allPoints));
  let [minLng, minLat, maxLng, maxLat] = bbox;

  const expandLng = (maxLng - minLng) * 0.1;
  const expandLat = (maxLat - minLat) * 0.1;
  minLng -= expandLng;
  maxLng += expandLng;
  minLat -= expandLat;
  maxLat += expandLat;

  const cols = resolution;
  const rows = resolution;
  const latStep = (maxLat - minLat) / rows;
  const lngStep = (maxLng - minLng) / cols;
  const pixels = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const lat = maxLat - y * latStep;
      const lng = minLng + x * lngStep;
      const pixelPoint = turf.point([lng, lat]);

      let totalInfluence = 0;
let totalWeight = 0;

for (const m of markers) {
  const dist = turf.distance(
    pixelPoint,
    turf.point([m.longitude, m.latitude]),
    { units: "kilometers" }
  );

  const influence = influenceFromDistance(dist * 1000, bufferRadius); // meters
  if (influence > 0) {
    totalInfluence += influence;
    totalWeight += 1;
  }
}

const normalized = totalWeight > 0 ? totalInfluence / totalWeight : 0;
const color = interpolateColor(normalized);


      pixels.push({ x, y, value: normalized, color });
    }
  }

  setHeatMap({
    pixels,
    bounds: [
      [minLat, minLng],
      [maxLat, maxLng],
    ],
  });
};


  const handleGenerate = () => {
    if (!markers || markers.length === 0) {
      alert("No location data available.");
      return;
    }

    if (analysisType === "patch_corridor") {
       generatePatchCorridorMap();
    } else {
      generateResourceDensityMap()
    }
  };

  return (
    <div className="options-panel">
      <h2>Analysis Options</h2>

      <label>Analysis Type:</label>
      <select value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
        <option value="patch_corridor">Patch Connectivity Zones</option>
        <option value="resource_density">Resource Density Zones</option>
      </select>
<div><small>Patch Connectivity: More general. Shows walkable or transit-accessible zones formed by nearby services.
   Highlights areas where scattered resources still form useful corridors or rest stops.
   Does not adjust based on resource type or percentile settings. Good at blending over large scales.</small>
      <br></br>
      <small>Resource Density: Displays areas with dense, high-quality services. Focuses on where strong hubs are located, favors proximity and high quality services. Better for small scale.</small>
      </div>
      

      <label>Resource Type:</label>
      <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
        <option value="all">All</option>
        <option value="resources_amenities">Resources + Amenities</option>
        <option value="resources_services">Resources + Services</option>
        <option value="services_amenities">Services + Amenities</option>
        <option value="resources">Resources</option>
        <option value="services">Services</option>
        <option value="amenities">Amenities</option>
      </select>

      <label>Buffer Radius (m) - Adjust based on Mobility or Desired Scale:</label>
      <select value={bufferRadius} onChange={(e) => setBufferRadius(Number(e.target.value))}>
        {[250, 500, 1000, 2000, 3000, 5000, 8000,10000].map((val) => (
          <option key={val} value={val}>{val} m</option>
        ))}
      </select>

      <label>Resolution- used for heat map pixel grid rows and columns:</label>
      <select value={resolution} onChange={(e) => setResolution(Number(e.target.value))}>
        {[50, 100, 150, 200].map((val) => (
          <option key={val} value={val}>{val} x {val}</option>
        ))}
      </select>

      <label>Percentile Range  (clamp outliers like shelters that have high scores and a lot of resources):</label>
      <div className="percentile-controls">
        <select value={minPercentile} onChange={(e) => setMinPercentile(Number(e.target.value))}>
          {[0, 5, 10, 15, 20].map((val) => (
            <option key={val} value={val}>Min: {val}%</option>
          ))}
        </select>
        <select value={maxPercentile} onChange={(e) => setMaxPercentile(Number(e.target.value))}>
          {[80, 85, 90, 95, 100].map((val) => (
            <option key={val} value={val}>Max: {val}%</option>
          ))}
        </select>
      </div>

      <div className="analysis-buttons">
        <button className="generate-button" onClick={handleGenerate}>Generate</button>
        <button className="clear-button" onClick={() => {
          setHeatMap(null);
        }}>
          Clear
        </button>
      </div>

      <div className="legend">
        <h4>Color Legend:</h4>
        <ul>
          <li><span ></span> Green (Strong)</li>
          <li><span ></span> Yellow (Moderate)</li>
          <li><span ></span> Orange (Weak)</li>
          <li><span ></span> Red (Critical)</li>
        </ul>
      </div>
    </div>
  );
}

export default AnalysisOptions;
