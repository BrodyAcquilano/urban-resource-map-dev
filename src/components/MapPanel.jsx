import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { ZoomControl } from "react-leaflet";
import "./MapPanel.css";



function MapPanel({ tileUrl }) {
  return (
    <div className="map-panel">
      <MapContainer
        center={[43.4516, -80.4925]} // Centered on Kitchener-Waterloo
        zoom={13}
        scrollWheelZoom={true}
        className="map-background"
        zoomControl={false}
        
      >
        <ZoomControl position="bottomleft" />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url={tileUrl}
        />
      </MapContainer>
    </div>
  );
}

export default MapPanel;