// src/components/AnalysisOptions.jsx

import React, { useState } from "react";
import * as turf from "@turf/turf";
import "../styles/panels.css";

function AnalysisOptions({
  markers,
  setHeatMap,
  currentSchema,
}) {
  const categories = currentSchema?.categories || [];
  const categoryNames = categories.map((cat) => cat.categoryName);

  const allOptions = [
    "all",
    ...categoryNames,
    ...categoryNames.flatMap((cat1, i) =>
      categoryNames.slice(i + 1).map((cat2) => `${cat1}_${cat2}`)
    ),
  ];

  const [proximityBufferRadius, setProximityBufferRadius] = useState(1000);
  const [proximityResolution, setProximityResolution] = useState(100);
  const [proximityDecay, setProximityDecay] = useState("slow");

  const [distributionBufferRadius, setDistributionBufferRadius] = useState(1000);
  const [distributionResolution, setDistributionResolution] = useState(100);
  const [distributionCategoryType, setDistributionCategoryType] = useState("all");
  const [distributionMinPercentile, setDistributionMinPercentile] = useState(0);
  const [distributionMaxPercentile, setDistributionMaxPercentile] = useState(100);

  const [cumulativeBufferRadius, setCumulativeBufferRadius] = useState(1000);
  const [cumulativeResolution, setCumulativeResolution] = useState(100);
  const [cumulativeCategoryType, setCumulativeCategoryType] = useState("all");
  const [cumulativeMinPercentile, setCumulativeMinPercentile] = useState(0);
  const [cumulativeMaxPercentile, setCumulativeMaxPercentile] = useState(100);
  const [cumulativeDecayPower, setCumulativeDecayPower] = useState(1);

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
    const hue = value * 120;
    return `hsl(${hue}, 100%, 50%)`;
  }

  const getPercentile = (arr, percentile) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower]);
  };

  const distributionGetScore = (marker) => {
    let types = [];

    if (distributionCategoryType === "all") {
      types = categoryNames;
    } else if (distributionCategoryType.includes("_")) {
      types = distributionCategoryType.split("_");
    } else {
      types = [distributionCategoryType];
    }

    const allScores = types.map((type) =>
      calculateScore(marker.scores?.[type], marker.categories?.[type])
    );

    return allScores.reduce((a, b) => a + b, 0) / allScores.length;
  };

  const cumulativeGetScore = (marker) => {
    let types = [];

    if (cumulativeCategoryType === "all") {
      types = categoryNames;
    } else if (cumulativeCategoryType.includes("_")) {
      types = cumulativeCategoryType.split("_");
    } else {
      types = [cumulativeCategoryType];
    }

    const allScores = types.map((type) =>
      calculateScore(marker.scores?.[type], marker.categories?.[type])
    );

    return allScores.reduce((a, b) => a + b, 0) / allScores.length;
  };

  const handleGenerateProximity = () => {
    const allPoints = markers.map((m) =>
  turf.point([parseFloat(m.longitude), parseFloat(m.latitude)], { marker: m })
);

    const bbox = turf.bbox(turf.featureCollection(allPoints));
    let [minLng, minLat, maxLng, maxLat] = bbox;

    const expandLng = (maxLng - minLng) * 0.1;
    const expandLat = (maxLat - minLat) * 0.1;
    minLng -= expandLng;
    maxLng += expandLng;
    minLat -= expandLat;
    maxLat += expandLat;

    const cols = proximityResolution;
    const rows = proximityResolution;
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
  turf.point([parseFloat(m.longitude), parseFloat(m.latitude)]),
  { units: "kilometers" }
);

          const distance = dist * 1000;
          if (distance > proximityBufferRadius) continue;

          let proximityInfluence = 0;
          const decayFactor = 1 - distance / proximityBufferRadius;

          if (proximityDecay === "slow") {
            proximityInfluence = Math.sqrt(decayFactor);
          } else if (proximityDecay === "fast") {
            proximityInfluence = decayFactor;
          }

          if (proximityInfluence > 0) {
            totalInfluence += proximityInfluence;
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

  const handleGenerateDistribution = () => {
    const scoredMarkers = markers.map((m) => ({
      ...m,
      score: distributionGetScore(m),
    }));
    const scores = scoredMarkers.map((m) => m.score);

    const min = getPercentile(scores, distributionMinPercentile);
    const max = getPercentile(scores, distributionMaxPercentile);

    const normalizedMarkers = scoredMarkers.map((m) => ({
      ...m,
      normalized: normalize(m.score, min, max),
    }));

    const allPoints = normalizedMarkers.map((m) =>
  turf.point([parseFloat(m.longitude), parseFloat(m.latitude)])
);
    const bbox = turf.bbox(turf.featureCollection(allPoints));
    let [minLng, minLat, maxLng, maxLat] = bbox;

    const expandLng = (maxLng - minLng) * 0.1;
    const expandLat = (maxLat - minLat) * 0.1;
    minLng -= expandLng;
    maxLng += expandLng;
    minLat -= expandLat;
    maxLat += expandLat;

    const cols = distributionResolution;
    const rows = distributionResolution;
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

          const distance = dist * 1000;
          if (distance > distributionBufferRadius) continue;

          const decayFactor = 1 - distance / distributionBufferRadius;
          const decayPower =
            distributionBufferRadius > 5000
              ? 6
              : distributionBufferRadius > 2000
              ? 3
              : 1.5;
          const proximityInfluence = Math.pow(decayFactor, decayPower);

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

    setHeatMap({
      pixels,
      bounds: [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
    });
  };

  const handleGenerateCumulative = () => {
    const scoredMarkers = markers.map((m) => ({
      ...m,
      score: cumulativeGetScore(m),
    }));
    const scores = scoredMarkers.map((m) => m.score);

    const min = getPercentile(scores, cumulativeMinPercentile);
    const max = getPercentile(scores, cumulativeMaxPercentile);

    const normalizedMarkers = scoredMarkers.map((m) => ({
      ...m,
      normalized: normalize(m.score, min, max),
    }));

   const allPoints = normalizedMarkers.map((m) =>
  turf.point([parseFloat(m.longitude), parseFloat(m.latitude)])
);
    const bbox = turf.bbox(turf.featureCollection(allPoints));
    let [minLng, minLat, maxLng, maxLat] = bbox;

    const expandLng = (maxLng - minLng) * 0.1;
    const expandLat = (maxLat - minLat) * 0.1;
    minLng -= expandLng;
    maxLng += expandLng;
    minLat -= expandLat;
    maxLat += expandLat;

    const cols = cumulativeResolution;
    const rows = cumulativeResolution;
    const latStep = (maxLat - minLat) / rows;
    const lngStep = (maxLng - minLng) / cols;
    const pixels = [];

    let maxPixelValue = 0;
    const decayPower = cumulativeDecayPower;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lat = maxLat - y * latStep;
        const lng = minLng + x * lngStep;
        const pixelPoint = turf.point([lng, lat]);

        let cumulativeValue = 0;

        for (const m of normalizedMarkers) {
          const dist = turf.distance(
            pixelPoint,
            turf.point([m.longitude, m.latitude]),
            { units: "kilometers" }
          );
          const meters = dist * 1000;

          if (meters <= cumulativeBufferRadius) {
            const decay = 1 - meters / cumulativeBufferRadius;
            const adjusted = decay ** cumulativeDecayPower;
            cumulativeValue += m.normalized * adjusted;
          }
        }

        maxPixelValue = Math.max(maxPixelValue, cumulativeValue);
        pixels.push({
          x,
          y,
          value: cumulativeValue,
          color: interpolateColor(cumulativeValue / maxPixelValue),
        });
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

  return (
    <div className="panel">
      <div className="section">
          <h2>Analysis Options</h2>
        </div>

      <div className="section">
        <h3>Proximity Influence Zones</h3>
        <p className="tooltip">
          A measure of closeness. Having many locations close together is a good
          indicator of high resource value. A buffer radius is set around the
          location. Every location is given the same value, regardless of what
          resources it has. Its value decays with radius. If locations overlap
          they exert influence on eachother. Influence is based on proximity.
          Locations close together overlap and form clusters with mutual
          influence, increasing the value of that area. Incresing buffer size
          causes more locations to merge into clusters, and more clusters to
          merge into super clusters. Decay can be increased as buffer radius
          increases to help scale to large areas without overinflating the value
          of each individual location when locations are far apart.
        </p>

        
          <div className="form-group">
          <label>
            Buffer Radius (m) - Adjust based on Mobility or Desired Scale:
          </label>
          <select
            value={proximityBufferRadius}
            onChange={(e) => setProximityBufferRadius(Number(e.target.value))}
          >
            {[250, 500, 1000, 2000, 3000, 5000, 8000, 10000].map((val) => (
              <option key={val} value={val}>
                {val} m
              </option>
            ))}
          </select>
          </div>

<div className="form-group">
          <label>
            Decay Rate - increase when increasing buffer radius for scale and
            not based on mobility.
          </label>
          <select
            value={proximityDecay}
            onChange={(e) => setProximityDecay(e.target.value)}
          >
            <option value="slow">slow</option>
            <option value="fast">fast</option>
          </select>
          </div>

<div className="form-group">
          <label>
            Resolution- used for heat map pixel grid rows and columns:
          </label>
          <select
            value={proximityResolution}
            onChange={(e) => setProximityResolution(Number(e.target.value))}
          >
            {[50, 100, 150, 200].map((val) => (
              <option key={val} value={val}>
                {val} x {val}
              </option>
            ))}
          </select>
          </div>
      

        <div className="buttons-container">
          <button  onClick={handleGenerateProximity}>
            Generate
          </button>
          <button
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="section">
        <h3>Resource Distribution Mapping</h3>

        <p className="tooltip">
          This type of calculation creates a local gradient when locations merge
          into clusters, and highlights the resource distribution within local
          clusters. Each location is scored based on which resources it has and
          the quality of those resources. The min and max scores are used to
          normalize scores and map them to a specific range in order to create a
          fair comparison. Clamping outliers to different percentile values also
          helps increase fairness. If one score is really high above the others
          you can pick a lower percentile value to use as the max. If one score
          is really low you can pick a higher percentile value to use as the
          min. A buffer radius is set around each location. Its value decays
          with radius. Decay is naturally increased as buffer radius increases
          to help scale to large areas without overinflating the influence of
          each individual location when locations are far apart. If locations
          overlap they form clusters and exert influence on eachother. Higher
          scoring locations generate a positive influence adding to the value of
          those around it. Lower scoring locations have a negative influence and
          reduce the score of those around it. If an area is red it means
          locations in that area are not contributing as much value as the
          others around it.
        </p>

        <div className="form-group">
          <label>
            Buffer Radius (m) - Adjust for mobility or desired scale:
          </label>

          <select
            value={distributionBufferRadius}
            onChange={(e) =>
              setDistributionBufferRadius(Number(e.target.value))
            }
          >
            {[250, 500, 1000, 2000, 3000, 5000, 8000, 10000].map((val) => (
              <option key={val} value={val}>
                {val} m
              </option>
            ))}
          </select>
          </div>

<div className="form-group">
          <label>Resolution- Adjust for precision</label>
          <select
            value={distributionResolution}
            onChange={(e) => setDistributionResolution(Number(e.target.value))}
          >
            {[50, 100, 150, 200].map((val) => (
              <option key={val} value={val}>
                {val} x {val}
              </option>
            ))}
          </select>
          </div>

<div className="form-group">
  <label>Category Type:</label>
  <select
    value={distributionCategoryType}
    onChange={(e) => setDistributionCategoryType(e.target.value)}
  >
    {allOptions.map((option) => (
      <option key={option} value={option}>
        {option === "all"
          ? "All"
          : option.includes("_")
          ? option.split("_").join(" + ")
          : option}
      </option>
    ))}
  </select>
</div>

<div className="form-group">
          <label>Percentile Range - Adjust for outliers.</label>
            <select
              value={distributionMinPercentile}
              onChange={(e) =>
                setDistributionMinPercentile(Number(e.target.value))
              }
            >
              {[0, 5, 10, 15, 20].map((val) => (
                <option key={val} value={val}>
                  Min: {val}%
                </option>
              ))}
            </select>
            <select
              value={distributionMaxPercentile}
              onChange={(e) =>
                setDistributionMaxPercentile(Number(e.target.value))
              }
            >
              {[80, 85, 90, 95, 100].map((val) => (
                <option key={val} value={val}>
                  Max: {val}%
                </option>
              ))}
            </select>
          </div>
          
       

        <div className="buttons-container">
          <button onClick={handleGenerateDistribution}>
            Generate
          </button>
          <button
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="section">
        <h3>Cumulative Resource Influence</h3>

        <p className="tooltip">
          This type of calculation highlights the added value of resource
          sharing within communities and shows the interconnectedness of
          different services. Each location is scored based on which resources
          it has and the quality of those resources. The algorithm then compute
          values for each pixel based on the score of the location, and the
          decay rate. Overlapping areas get summed or "integrated over" to
          generate a cumulative score. As buffer radius increases the cumulative
          effect can be viewed over larger areas. Patches expand and absorb
          their neighbours adding their value to their own. As you increase
          buffer radius it is helpful to also increase the decay rate, to slow
          the rate of expansion. Clamping outliers to different percentile
          values also helps increase fairness. If one score is really high above
          the others you can pick a lower percentile value to use as the max. If
          one score is really low you can pick a higher percentile value to use
          as the min. Decay can be increased as buffer radius increases to help
          scale to large areas without overinflating the value of each
          individual location when locations are far apart, or decay can remain
          the same if buffer radius is varying based on mobility. If locations
          overlap they form clusters and exert influence on eachother. Influence
          in this case is always positive. We integrate over each area, and
          create a cumulative score. Low scoring places do not remove value from
          those around it, they just add less.
        </p>

        <div className="form-group">
          <label>
            Buffer Radius (m) - Adjust for mobility or desired scale:
          </label>

          <select
            value={cumulativeBufferRadius}
            onChange={(e) => setCumulativeBufferRadius(Number(e.target.value))}
          >
            {[250, 500, 1000, 2000, 3000, 5000, 8000, 10000].map((val) => (
              <option key={val} value={val}>
                {val} m
              </option>
            ))}
          </select>
          </div>

<div className="form-group">
          <label>
            Decay Power:
            </label>
            <select
              value={cumulativeDecayPower}
              onChange={(e) => setCumulativeDecayPower(Number(e.target.value))}
            >
              {[0.5, 1, 2, 5, 10].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

<div className="form-group">
          <label>Resolution- Adjust for precision</label>
          <select
            value={cumulativeResolution}
            onChange={(e) => setCumulativeResolution(Number(e.target.value))}
          >
            {[50, 100, 150, 200].map((val) => (
              <option key={val} value={val}>
                {val} x {val}
              </option>
            ))}
          </select>
          </div>

<div className="form-group">
  <label>Category Type:</label>
  <select
    value={cumulativeCategoryType}
    onChange={(e) => setCumulativeCategoryType(e.target.value)}
  >
    {allOptions.map((option) => (
      <option key={option} value={option}>
        {option === "all"
          ? "All"
          : option.includes("_")
          ? option.split("_").join(" + ")
          : option}
      </option>
    ))}
  </select>
</div>

<div className="form-group">
          <label>Percentile Range - Adjust for outliers.</label>
            <select
              value={cumulativeMinPercentile}
              onChange={(e) =>
                setCumulativeMinPercentile(Number(e.target.value))
              }
            >
              {[0, 5, 10, 15, 20].map((val) => (
                <option key={val} value={val}>
                  Min: {val}%
                </option>
              ))}
            </select>
            <select
              value={cumulativeMaxPercentile}
              onChange={(e) =>
                setCumulativeMaxPercentile(Number(e.target.value))
              }
            >
              {[80, 85, 90, 95, 100].map((val) => (
                <option key={val} value={val}>
                  Max: {val}%
                </option>
              ))}
            </select>
          </div>
        

        <div className="buttons-container">
          <button
            onClick={handleGenerateCumulative}
          >
            Generate
          </button>
          <button
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="section">
        <h3>Color Legend:</h3>
        <ul>
          <li>
            <span></span> 🟢 = Well-Served / High Resource Zone
          </li>
          <li>
            <span></span> 🟡 = Moderately Served / Stable but Limited
          </li>
          <li>
            <span></span> 🟠 = Under-Served / Needs Attention
          </li>
          <li>
            <span></span> 🔴 = Critical Shortage / Resource Desert
          </li>
        </ul>
      </div>

      <div className="section">
        <h3>Notes on buffer radius and decay:</h3>
        <p>
          There are two reasons to increase buffer radius. The first is based on
          mobility. If a person is more mobile they can walk long distances fast
          and so buffer radius can be increased. Also if you are driving or
          taking a bus you can cover more ground faster. Even seasonal factors
          can affect mobility. In extreme weather, mobility may be reduced. The
          buffer radius is user-centric in that case. The second reason for
          buffer radius is data centric. Sometimes if you want to look at
          patterns over large scales with locations that are far apart, you have
          to increae buffer raidus to form clusters. In that case the decay rate
          must increase naturally as buffer radius increases to prevent
          overinflating the influence of individual locations when locations or
          clusters are far apart. When calculating proximity influence zones and
          cumulative resource influence, mobility is a factor. However when
          calculating resource distirbutions, we don't care how far the user
          travels. we care how much one location's score "bleeds" into nearby
          locations. In that case it is about geographical distribution of
          quality, not user interaction. Therfore in that case decay rate
          increases naturally as buffer radius increases, and there is no
          setting for decay rate. Other things that may affect this are the
          "shelf-life" of resources or frequency of use required. For example
          one person be able to go a long time without going to the washroom,
          but another person may need to stop frequently for medical reasons.
          Resources like water may be more important because they are required
          frequently whereas a person can go many hours without eating. Seasonal
          conditions like heat, may make water more important. Also seasonal
          conditions like low temeperatures make warmth more important. In
          really cold temperatures it is not recommended to stay outside for
          longer than 15 minutes to an hour.
        </p>
      </div>
    </div>
  );
}

export default AnalysisOptions;
