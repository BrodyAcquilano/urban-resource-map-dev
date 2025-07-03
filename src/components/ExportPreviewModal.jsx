// src/components/ExportPreviewModal.jsx

import React, { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/modals.css";

function groupChildrenIntoPages(container, pageHeightPx) {
  const children = Array.from(container.children);
  const pages = [];
  let currentPage = [];
  let accumulatedHeight = 0;

  for (const child of children) {
    const childHeight =
      child.offsetHeight +
      parseFloat(getComputedStyle(child).marginBottom || 0);
    if (
      accumulatedHeight + childHeight > pageHeightPx &&
      currentPage.length > 0
    ) {
      pages.push([...currentPage]);
      currentPage = [];
      accumulatedHeight = 0;
    }
    currentPage.push(child);
    accumulatedHeight += childHeight;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

function ExportPreviewModal({
  isOpen,
  onClose,
  title,
  includeFilters,
  includeAllLocations,
  includeSelected,
  orientation,
  notes,
  filteredMarkers,
  selectedLocation,
  selectedFilters,
  mapImage,
}) {
  const previewRef = useRef();

  const handleExport = async () => {
    const input = previewRef.current;
    if (!input) return;

    const pdf = new jsPDF({
      orientation: orientation === "landscape" ? "landscape" : "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageHeightPt = pdf.internal.pageSize.getHeight();
    const pages = groupChildrenIntoPages(input, pageHeightPt / 2); // Adjust scale if needed

    for (let i = 0; i < pages.length; i++) {
      const pageContainer = document.createElement("div");
      pageContainer.style.width = input.clientWidth + "px";
      pageContainer.style.padding = "40px";
      pageContainer.style.background = "white";
      pageContainer.style.color = "black";

      pages[i].forEach((child) => {
        pageContainer.appendChild(child.cloneNode(true));
      });

      document.body.appendChild(pageContainer);
      const canvas = await html2canvas(pageContainer, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      if (i > 0) pdf.addPage();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      document.body.removeChild(pageContainer);
    }

    pdf.save((title || "urban-resource-map") + ".pdf");
  };

  const visibleMarkers = filteredMarkers.filter((marker) => {
    if (!window.mapForExport?.getBounds) return true;
    const lat = parseFloat(marker.sections[0].inputs[0].value);
    const lng = parseFloat(marker.sections[0].inputs[1].value);
    return window.mapForExport.getBounds().contains([lat, lng]);
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay offcenter-modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Export Preview</h2>

        <div className="export-preview-box" ref={previewRef}>
          {title && <h3>{title}</h3>}

          {notes.trim() !== "" && (
            <div className="export-section">
              <h4>Notes:</h4>
              <div className="notes-container">
                <p>{notes}</p>
              </div>
            </div>
          )}

          {includeFilters && selectedFilters.length > 0 && (
            <div className="export-section-filters">
              <h4>Applied Filters:</h4>
              <ul className="filter-list">
                {selectedFilters.map((item, idx) => (
                  <li key={idx}>
                    {item.label}
                    {item.value ? `: ${item.value}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {includeAllLocations && visibleMarkers.length > 0 && (
            <div className="export-section">
              <h4>Visible Filtered Locations:</h4>
              <ul>
                {visibleMarkers.map((marker) => (
                  <li key={marker._id || marker.id}>
                    Latitude:{" "}
                    {Number(marker.sections[0].inputs[0].value).toFixed(4)},
                    Longitude:{" "}
                    {Number(marker.sections[0].inputs[1].value).toFixed(4)}
                  </li>
                ))}
              </ul>
              {visibleMarkers.length < filteredMarkers.length && (
                <p style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
                  Showing {visibleMarkers.length} of {filteredMarkers.length}{" "}
                  filtered locations visible on map.
                </p>
              )}
            </div>
          )}

          {includeSelected && selectedLocation && (
            <div className="export-section">
              <h4>Selected Location Details:</h4>
              <p>
                Latitude:{" "}
                {Number(selectedLocation.sections[0].inputs[0].value).toFixed(
                  4
                )}
                , Longitude:{" "}
                {Number(selectedLocation.sections[0].inputs[1].value).toFixed(
                  4
                )}
              </p>
            </div>
          )}

          {mapImage && (
            <div className="export-section">
              <h4>Map Preview:</h4>
              <img
                src={mapImage}
                alt="Map Snapshot"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          <p
            style={{
              fontSize: "0.7rem",
              textAlign: "right",
              marginTop: "1rem",
            }}
          >
            Exported: {new Date().toLocaleString()}
          </p>
        </div>

        <div className="buttons-container">
          <button onClick={handleExport}>Export</button>
        </div>
      </div>
    </div>
  );
}

export default ExportPreviewModal;
