import React from "react";
import "./InfoPanel.css";

function InfoPanel({ selectedLocation }) {
  if (!selectedLocation) {
    return (
      <div className="info-panel">
        <h2>Info Panel</h2>
        <p>Select a marker to view details</p>
      </div>
    );
  }

  const {
    name,
    address,
    phone,
    website,
    wheelchairAccessible,
    isLocationOpen,
    openHours,
    resources = {},
    services = {},
    comforts = {}
  } = selectedLocation;

  return (
    <div className="info-panel">
      <h2>Info Panel</h2>
      <h3>{name}</h3>
      <p>{address}</p>
      {phone && <p>📞 {phone}</p>}
      {website && (
        <p>
          🌐 <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
        </p>
      )}

      <hr />

      <p>
        ♿ Accessibility:{" "}
        <strong>{wheelchairAccessible ? "Wheelchair Accessible" : "Not Accessible"}</strong>
      </p>

      <hr />

      <h3>Open Hours</h3>
   {openHours && Object.keys(openHours).length > 0 ? (
  <ul>
    {Object.entries(openHours).map(([day, times]) => (
      <li key={day}>
        <strong>{day}</strong>:{" "}
        {times.open
          ? `${times.open || "??"} – ${times.close || "??"}` 
          : "Closed"}
      </li>
    ))}
  </ul>
) : (
  <p>No hours listed</p>
)}

      <hr />

   <h3>Resources</h3>
{resources && Object.values(resources).some(Boolean) ? (
  <ul>
    {Object.entries(resources)
      .filter(([, value]) => value === true)
      .map(([key]) => (
        <li key={key}>{key}</li>
      ))}
  </ul>
) : (
  <p>No resources listed</p>
)}

<h3>Services</h3>
{services && Object.values(services).some(Boolean) ? (
  <ul>
    {Object.entries(services)
      .filter(([, value]) => value === true)
      .map(([key]) => (
        <li key={key}>{key}</li>
      ))}
  </ul>
) : (
  <p>No services listed</p>
)}

<h3>Comforts</h3>
{comforts && Object.values(comforts).some(Boolean) ? (
  <ul>
    {Object.entries(comforts)
      .filter(([, value]) => value === true)
      .map(([key]) => (
        <li key={key}>{key}</li>
      ))}
  </ul>
) : (
  <p>No comforts listed</p>
)}
    </div>
  );
}

export default InfoPanel;
