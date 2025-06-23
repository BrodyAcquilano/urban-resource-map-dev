// src/components/EditScoreModal.jsx

import React, { useState, useEffect } from "react";
import "../styles/modals.css";
import axios from "axios";
import { getSafeLocationData } from "../utils/locationHelpers.jsx";

function EditScoreModal({
  isOpen,
  onClose,
  selectedLocation,
  setSelectedLocation,
  setMarkers,
  currentSchema,
  currentCollection,
}) {
  const [page, setPage] = useState(0); // Start at index 0 (first category)
  const [locationData, setLocationData] = useState(getSafeLocationData());
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Initialize locationData safely when modal opens
  useEffect(() => {
    if (selectedLocation) {
      setLocationData(getSafeLocationData(selectedLocation));
    }
  }, [selectedLocation]);

  // Score editing handler
  const handleScoreChange = (categoryName, key, value) => {
    setLocationData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [categoryName]: {
          ...(prev.scores?.[categoryName] || {}),
          [key]: parseInt(value),
        },
      },
    }));
  };

  // Handle submit and resync local state
  const handleSubmit = async () => {
    if (!selectedLocation || !locationData) {
      alert("No location selected.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/locations/${selectedLocation._id}`,
        locationData,
        { params: { collectionName: currentCollection } }
      );

      const res = await axios.get(`${BASE_URL}/api/locations`, {
        params: { collectionName: currentCollection },
      });
      setMarkers(res.data);

      const updated = res.data.find((loc) => loc._id === selectedLocation._id);
      if (updated) {
        setSelectedLocation(updated);
      }

      alert("Location updated!");
      setPage(0);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to save location.");
    }
  };

  if (!isOpen) return null;
  if (!selectedLocation) {
    return (
      <div className="modal-overlay centered-modal-overlay">
        <div className="modal">
          <h2>Edit Score</h2>
          <p>Select a marker to view and rate its resources.</p>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
    );
  }

  const { categories = [] } = currentSchema || {};
  const currentCategory = categories[page];

  return (
    <div className="modal-overlay centered-modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Edit Score</h2>

        {page === 0 && (
          <>
            <h3>Selected Location:</h3>
            <p>{locationData.name}</p>
          </>
        )}

        {page > 0 && currentCategory && (
          <>
            <h3>{currentCategory.categoryName}</h3>
            {Object.values(locationData[currentCategory.categoryName] || {}).some(
              (val) => val
            ) ? (
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Rating</th>
                    <th>Stars</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategory.items.map((key) =>
                    locationData[currentCategory.categoryName]?.[key] ? (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>
                          <select
                            value={
                              locationData.scores?.[currentCategory.categoryName]?.[key] || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(
                                currentCategory.categoryName,
                                key,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {"⭐".repeat(
                            locationData.scores?.[currentCategory.categoryName]?.[key] || 0
                          )}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">No {currentCategory.categoryName.toLowerCase()} available at this location.</p>
            )}
          </>
        )}

        <div className="buttons-container">
          {page > 0 && <button onClick={() => setPage(page - 1)}>Back</button>}
          {page < categories.length ? (
            <button onClick={() => setPage(page + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditScoreModal;
