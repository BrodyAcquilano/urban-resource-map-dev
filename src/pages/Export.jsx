// src/pages/Export.jsx

import React, { useState } from "react";
import ExportOptions from "../components/ExportOptions.jsx";
import ExportPreviewModal from "../components/ExportPreviewModal.jsx";
import "./Export.css";

function Export() {
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(true);

  return (

 <>
     {/* Editor Panel Toggle + Panel */}
      <button
        className={`export-side-toggle editor-toggle ${
          showExportOptions ? "" : "collapsed-toggle"
        }`}
        onClick={() => setShowExportOptions(!showExportOptions)}
      >
        ☰
      </button>
      <div
        className={`export-overlay-panel export-panel-wrapper ${
          showExportOptions ? "" : "collapsed"
        }`}
      >
        <ExportOptions/>
      </div>

       {/* Centered Export Button */}
      <button
        className="export-preview-button"
        onClick={() => setExportModalOpen(true)}
      >
        ⬇️
      </button>

      {/* Modal */}
      <ExportPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </>
  );
}

export default Export;
