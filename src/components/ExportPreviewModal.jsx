// src/components/ExportPreviewModal.jsx

import React from "react";
import "./ExportPreviewModal.css";

function ExportPreviewModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="export-preview-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Export Preview</h2>
        <p>(Placeholder content goes here)</p>
      </div>
    </div>
  );
}

export default ExportPreviewModal;
