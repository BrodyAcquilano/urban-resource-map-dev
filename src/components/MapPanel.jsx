import React from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPanel.css";

// Optional: custom icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function MapPanel({ tileUrl, markers = [] }) {
  return (
    <div className="map-panel">
      <MapContainer
        center={[43.4516, -80.4925]} // Center on Kitchener-Waterloo
        zoom={13}
        scrollWheelZoom={true}
        className="map-background"
        zoomControl={false}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer attribution='&copy; OpenStreetMap contributors' url={tileUrl} />

        {/* Map Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker._id}
            position={[parseFloat(marker.latitude), parseFloat(marker.longtitude)]}
            icon={customIcon}
          >
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              {marker.address || "No address"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapPanel;

