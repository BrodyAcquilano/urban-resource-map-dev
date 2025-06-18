import React, { useState } from "react";
import AnalysisOptions from "../components/AnalysisOptions.jsx";
import EditScoreModal from "../components/EditScoreModal.jsx";
import "./Analysis.css";

function Analysis({
  markers,
  setMarkers,
  selectedLocation,
  setSelectedLocation,
  setHeatMap,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);

  return (
    <>
      {/* Analysis Options Panel Toggle + Panel */}
      <button
        className={`options-side-toggle options-toggle ${
          showOptions? "" : "collapsed-toggle"
        }`}
        onClick={() => setShowOptions(!showOptions)}
      >
        ☰
      </button>
      <div
        className={`options-overlay-panel options-panel-wrapper ${
          showOptions ? "" : "collapsed"
        }`}
      >
        <AnalysisOptions markers={markers} setHeatMap={setHeatMap} />
      </div>

      {/* Centered EditScore Button */}
      <button
        className="edit-score-button"
        onClick={() => setIsEditScoreModalOpen(true)}
      >
        ⭐
      </button>

      {/* Modal */}
      <EditScoreModal
        isOpen={isEditScoreModalOpen}
        onClose={() => setIsEditScoreModalOpen(false)}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        setMarkers={setMarkers}
      />
    </>
  );
}

export default Analysis;
