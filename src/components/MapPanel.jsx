// src/components/MapPanel.jsx
import React from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPanel.css";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function MapPanel({ tileUrl, filteredMarkers, setSelectedLocation }) {
  return (
    <div className="map-panel">
      <MapContainer
        center={[43.4516, -80.4925]}
        zoom={13}
        scrollWheelZoom={true}
        className="map-background"
        zoomControl={false}
        worldCopyJump={false}
        maxBoundsViscosity={1.0}
        minZoom={3}
        maxZoom={18}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={tileUrl}
          noWrap={true}
        />
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker._id}
            position={[
              parseFloat(marker.latitude),
              parseFloat(marker.longitude),
            ]}
            icon={customIcon}
            eventHandlers={{
              click: () => setSelectedLocation(marker),
            }}
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
