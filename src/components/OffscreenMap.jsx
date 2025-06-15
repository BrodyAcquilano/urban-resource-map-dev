import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

// Optional: Same icon as in MapPanel
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function OffscreenMap({ tileUrl, filteredMarkers ,center, zoom}) {
  const mapRef = useRef(null);

  function SyncView({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current) {
        window.mapForExport = mapRef.current;
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        height: "300px",
        width: "500px",
        overflow: "hidden",
      }}
    >
<MapContainer
  scrollWheelZoom={false}
  zoomControl={false}         // 👈 Hide zoom buttons
  style={{ height: "300px", width: "500px" }}
  ref={mapRef}
  center={center}
  zoom={zoom}
>
  <SyncView center={center} zoom={zoom} />
  <TileLayer
    url={tileUrl}
    attribution="&copy; OpenStreetMap contributors"
    crossOrigin="anonymous"
  />
  {filteredMarkers.map((marker) => (
    <Marker
      key={marker._id}
      position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
      icon={customIcon}
    />
  ))}
</MapContainer>
    </div>
  );
}

export default OffscreenMap;