import React, { useState } from "react";
import AnalysisOptions from "../components/AnalysisOptions.jsx";
import EditScoreModal from "../components/EditScoreModal.jsx";
import '../styles/pages.css';

function Analysis({
  markers,
  setMarkers,
  selectedLocation,
  setSelectedLocation,
  setHeatMap,
  currentCollection,
  currentSchema,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);

  return (
    <>
      {/* Analysis Options Panel Toggle + Panel */}
      <button
        className={`side-toggle toggle ${
          showOptions? "" : "collapsed-toggle"
        }`}
        onClick={() => setShowOptions(!showOptions)}
      >
        ☰
      </button>
      <div
        className={`overlay-panel panel-wrapper ${
          showOptions ? "" : "collapsed"
        }`}
      >
        <AnalysisOptions markers={markers} setHeatMap={setHeatMap} currentCollection={currentCollection} currentSchema={currentSchema}/>
      </div>

      {/* Centered EditScore Button */}
      <button
        className="modal-button"
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
        currentCollection={currentCollection}
      />
    </>
  );
}

export default Analysis;
