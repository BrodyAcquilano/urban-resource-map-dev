// src/components/AddLocationModal.jsx

import React from "react";
import "./AddLocationModal.css";

function AddLocationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-location-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Add New Location</h2>
        <p>(Placeholder content goes here)</p>
      </div>
    </div>
  );
}

export default AddLocationModal;