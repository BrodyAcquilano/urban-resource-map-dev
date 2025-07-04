// src/components/EditLocation.jsx

import React, { useState, useEffect } from "react";
import "../styles/panels.css";
import axios from "axios";
import {
  renderDynamicFormPage,
  validateFormData,
} from "../utils/EditLocationHelpers.jsx";

function EditLocation({
  mongoURI,
  setMarkers,
  selectedLocation,
  setSelectedLocation,
  currentSchema,
  currentCollection,
}) {

  const [formData, setFormData] = useState({});

useEffect(() => {
  if (selectedLocation) {
    setFormData(selectedLocation);
  }
}, [selectedLocation]);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleEditSubmit = async () => {
    if (!validateFormData(currentSchema, formData.sections)) {
      window.alert("Missing required entries or invalid fields.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/locations/${selectedLocation._id}`,
        { location: formData },
        { params: { collectionName: currentCollection, mongoURI } }
      );

      const response = await axios.get(`${BASE_URL}/api/locations`, {
        params: { collectionName: currentCollection, mongoURI },
      });
      setMarkers(response.data);

      const updated = response.data.find(
        (loc) => loc._id === selectedLocation._id
      );
      if (updated) {
        setSelectedLocation(updated);
      }
      alert("Location updated!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update location");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this location?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/locations/${selectedLocation._id}`, {
        params: { collectionName: currentCollection, mongoURI },
      });

      const response = await axios.get(`${BASE_URL}/api/locations`, {
        params: { collectionName: currentCollection, mongoURI },
      });
      setMarkers(response.data);
      setSelectedLocation(null);
      alert("Location deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete location");
    }
  };

  if (!selectedLocation) {
    return (
      <div className="panel">
        <div className="section">
          <h2>Edit Location</h2>
        </div>
        <p>Select a marker to view details.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="section">
        <h2>Edit Location</h2>
      </div>

      {currentSchema.sections.map((schemaSection, sectionIndex) => (
        <div key={schemaSection.id} className="section">
          <h3>{schemaSection.name}</h3>
          {renderDynamicFormPage({
            section: schemaSection,
            sectionIndex,
            formData,
            setFormData,
          })}
        </div>
      ))}

      <div className="buttons-container">
        <button onClick={handleEditSubmit}>Save Changes</button>
        <button onClick={handleDelete} className="delete-btn">
          Delete Location
        </button>
      </div>
    </div>
  );
}

export default EditLocation;
