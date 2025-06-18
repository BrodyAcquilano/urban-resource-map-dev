import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

function HeatmapLayer({ pixels, bounds }) {
  const map = useMap();
  const paneRef = useRef(null);

  useEffect(() => {
    if (!map || !pixels || !bounds) return;

    const paneName = "heatmapPane";
    if (!map.getPane(paneName)) {
      map.createPane(paneName);
      map.getPane(paneName).style.zIndex = 500;
    }

    const pane = map.getPane(paneName);
    pane.innerHTML = "";
    paneRef.current = pane;

    const [sw, ne] = bounds;
    const [minLat, minLng] = sw;
    const [maxLat, maxLng] = ne;

    const cols = Math.max(...pixels.map((p) => p.x)) + 1;
    const rows = Math.max(...pixels.map((p) => p.y)) + 1;

    const lngStep = (maxLng - minLng) / cols;
    const latStep = (maxLat - minLat) / rows;

    pixels.forEach((p) => {
      const lat = maxLat - (p.y + 1) * latStep;
      const lng = minLng + p.x * lngStep;
      const lat2 = lat + latStep;
      const lng2 = lng + lngStep;

      const topLeft = map.latLngToLayerPoint([lat2, lng]);
      const bottomRight = map.latLngToLayerPoint([lat, lng2]);

      const width = bottomRight.x - topLeft.x;
      const height = bottomRight.y - topLeft.y;

      const box = L.DomUtil.create("div", "heatmap-box", pane);
      box.style.position = "absolute";
      box.style.left = `${topLeft.x}px`;
      box.style.top = `${topLeft.y}px`;
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;
      box.style.backgroundColor = interpolateColor(p.value);
      box.style.opacity = "0.4";
      box.style.pointerEvents = "none";
    });

    const handleViewChange = () => {
      if (paneRef.current) {
        paneRef.current.innerHTML = "";
      }
    };

    map.on("zoomend moveend", handleViewChange);
    return () => {
      map.off("zoomend moveend", handleViewChange);
      if (paneRef.current) paneRef.current.innerHTML = "";
    };
  }, [map, pixels, bounds]);

  return null;
}

// Interpolates smoothly from red (0) to green (1) via orange/yellow
function interpolateColor(value) {
  value = Math.max(0, Math.min(1, value));
  const hue = value * 120; // 0 = red, 60 = yellow, 120 = green
  return `hsl(${hue}, 100%, 50%)`;
}

export default HeatmapLayer;
