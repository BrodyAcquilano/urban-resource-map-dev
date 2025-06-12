// src/components/EditLocation.jsx

import React, { useState, useEffect } from "react";
import "./EditLocation.css";
import axios from "axios";

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const suffix = hour < 12 ? "a.m." : "p.m.";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${suffix}`;
});

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function EditLocation({ setMarkers, selectedLocation, setSelectedLocation }) {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longtitude, setLongtitude] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [openHours, setOpenHours] = useState({});
  const [isLocationOpen, setIsLocationOpen] = useState({});
  const [resources, setResources] = useState({});
  const [services, setServices] = useState({});
  const [comforts, setComforts] = useState({});

  // Load selectedLocation into local state once on open
  useEffect(() => {
    if (selectedLocation) {
      setName(selectedLocation.name || "");
      setLatitude(selectedLocation.latitude || "");
      setLongtitude(selectedLocation.longtitude || "");
      setAddress(selectedLocation.address || "");
      setWebsite(selectedLocation.website || "");
      setPhone(selectedLocation.phone || "");
      setWheelchairAccessible(!!selectedLocation.wheelchairAccessible);
      setOpenHours(selectedLocation.openHours || {});
      setIsLocationOpen(selectedLocation.isLocationOpen || {});
      setResources(selectedLocation.resources || {});
      setServices(selectedLocation.services || {});
      setComforts(selectedLocation.comforts || {});
    }
  }, [selectedLocation]);

  const handleEditSubmit = async () => {
    if (!name || !latitude || !longtitude) {
      window.alert("Missing required entries");
      return;
    }

    try {
      await axios.put(`/api/locations/${selectedLocation._id}`, {
        name,
        latitude,
        longtitude,
        address,
        phone,
        website,
        wheelchairAccessible,
        isLocationOpen,
        openHours,
        resources,
        services,
        comforts,
      });
      const response = await axios.get("/api/locations");
      setMarkers(response.data);

      alert("Location updated!");
    } catch (error) {
      console.error("Update failed:", error);
      onsole.error("Submit failed:", err);
      if (!name || !latitude || !longitude) {
        window.alert("Missing Required Entries");
        return;
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this location?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/locations/${selectedLocation._id}`);
      const response = await axios.get("/api/locations");
      setMarkers(response.data);
      alert("Location deleted.");
      setSelectedLocation(null); // Clear selection
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete location");
    }
  };

  if (!selectedLocation) {
    return (
      <div className="edit-location-panel">
        <h2>Edit Location</h2>
        <p>Select a marker to view details</p>
      </div>
    );
  }

  return (
    <div className="edit-location-panel">
      <h1>Edit Location</h1>

      <label>Name:</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Required..."
        required
      />

      <label>Latitude:</label>
      <input
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        placeholder="Required..."
        required
      />

      <label>Longitude:</label>
      <input
        value={longtitude}
        onChange={(e) => setLongtitude(e.target.value)}
        placeholder="Required..."
        required
      />

      <label>Address:</label>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Optional..."
      />

      <label>Website:</label>
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        placeholder="Optional..."
      />

      <label>Phone:</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Optional..."
      />

      <div className="inline-checkbox-row">
        <label className="label-container">♿ Wheelchair Accessible</label>
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={wheelchairAccessible}
            onChange={(e) => setWheelchairAccessible(e.target.checked)}
          />
        </div>
      </div>

      <h3>Open Hours</h3>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Open?</th>
            <th>Open</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              <td>
                <input
                  type="checkbox"
                  checked={isLocationOpen[day]}
                  onChange={(e) =>
                    setIsLocationOpen({
                      ...isLocationOpen,
                      [day]: e.target.checked,
                    })
                  }
                />
              </td>
              {isLocationOpen[day] ? (
                <>
                  <td>
                    <select
                      value={openHours[day]?.open || ""}
                      onChange={(e) =>
                        setOpenHours({
                          ...openHours,
                          [day]: {
                            ...openHours[day],
                            open: e.target.value,
                          },
                        })
                      }
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={openHours[day]?.close || ""}
                      onChange={(e) =>
                        setOpenHours({
                          ...openHours,
                          [day]: {
                            ...openHours[day],
                            close: e.target.value,
                          },
                        })
                      }
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                </>
              ) : (
                <td colSpan={2}>
                  <div className="closed-cell">Closed</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Resources</h3>
      <div className="resources-list">
        {Object.keys(resources).map((key) => (
          <div key={key} className="inline-checkbox-row">
            <label className="label-container">{key}</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={resources[key]}
                onChange={(e) =>
                  setResources({ ...resources, [key]: e.target.checked })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <h3>Services</h3>
      <div className="services-section">
        {Object.keys(services).map((key) => (
          <div key={key} className="inline-checkbox-row">
            <label className="label-container">{key}</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={services[key]}
                onChange={(e) =>
                  setServices({ ...services, [key]: e.target.checked })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <h3>Comforts</h3>
      <div className="comforts-section">
        {Object.keys(comforts).map((key) => (
          <div key={key} className="inline-checkbox-row">
            <label className="label-container">{key}</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={comforts[key]}
                onChange={(e) =>
                  setComforts({ ...comforts, [key]: e.target.checked })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="edit-buttons">
        <button onClick={handleEditSubmit}>Save Changes</button>
        <button onClick={handleDelete} className="delete-btn">
          Delete Location
        </button>
      </div>
    </div>
  );
}

export default EditLocation;
