// src/components/AddLocationModal.jsx
import React, { useState, useEffect } from "react";
import "../styles/modals.css";
import axios from "axios";
import {
  initializeFormData,
  renderDynamicFormPage,
  validateFormData,
} from "../utils/AddLocationModalHelpers.jsx";

function AddLocationModal({
  mongoURI,
  isOpen,
  onClose,
  setMarkers,
  currentSchema,
  currentCollection,
}) {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({});

  // Reset form when modal opens or schema changes
  useEffect(() => {
    if (isOpen && currentSchema) {
      setFormData(initializeFormData(currentSchema));
      setPage(1);
    }
  }, [isOpen, currentSchema]);

  const resetForm = () => {
    setFormData(initializeFormData(currentSchema));
  };

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (!validateFormData(currentSchema, formData)) {
      window.alert("Form is missing required fields or contains invalid entries.");
      return;
    }

    const locationData = {
      sections: formData.sections,
    };

    if (formData.hasHours) {
      locationData.isLocationOpen = formData.isLocationOpen;
      locationData.openHours = formData.openHours;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/locations`, locationData, {
        params: { collectionName: currentCollection, mongoURI: mongoURI },
      });

      const newMarker = { _id: res.data.id, ...locationData };
      setMarkers((prev) => [...prev, newMarker]);

      resetForm();
      setPage(1);
      onClose();
      alert("Location added!");
    } catch (err) {
      console.error("Submit failed:", err);
      window.alert("Failed to save location.");
    }
  };

  if (!isOpen || !currentSchema) return null;

  const totalPages = currentSchema.sections.length;
  const currentSection = currentSchema.sections[page - 1];

  return (
    <div className="modal-overlay centered-modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Add New Location</h2>

        {renderDynamicFormPage({
          section: currentSection,
          sectionIndex: page - 1,
          formData,
          setFormData,
        })}

        <div className="buttons-container">
          {page > 1 && <button onClick={() => setPage(page - 1)}>Back</button>}
          {page < totalPages ? (
            <button onClick={() => setPage(page + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddLocationModal;
