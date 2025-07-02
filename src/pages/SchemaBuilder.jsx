// 🔨 SchemaBuilder Page (Fully Schema Model Integrated)

import React, { useState } from "react";
import "../styles/SchemaBuilder.css";
import {
  defaultSchema,
  generateNewSection,
  generateNewInput,
  capitalizeFirstLetter,
} from "../schema/defaultSchema";

function SchemaBuilder() {
  const [schema, setSchema] = useState(defaultSchema);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [selectedInputIndex, setSelectedInputIndex] = useState(null);
  const [isSchemaPreviewOpen, setIsSchemaPreviewOpen] = useState(false);

  // 🔢 SECTION MANAGER
  function addNewSection() {
    const newSection = generateNewSection();
    const updatedSections = [...schema.sections, newSection];
    setSchema({ ...schema, sections: updatedSections });
    setSelectedSectionIndex(updatedSections.length - 1);
    setSelectedInputIndex(null);
  }

  function handleDeleteSection(e, index) {
    e.stopPropagation();

    const updatedSections = schema.sections.filter((_, i) => i !== index);
    setSchema({ ...schema, sections: updatedSections });

    if (selectedSectionIndex === index) {
      setSelectedSectionIndex(null);
      setSelectedInputIndex(null);
    } else if (selectedSectionIndex > index) {
      setSelectedSectionIndex(selectedSectionIndex - 1);
    }
  }

  function handleRenameSectionKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  }

  function handleRenameSection(e, index) {
    const newName = e.target.value;
    const updatedSections = [...schema.sections];
    updatedSections[index].name = newName;
    setSchema({ ...schema, sections: updatedSections });
  }

  // 🔢 ADD INPUT TO SECTION
  function addInputToCurrentSection(type) {
    if (selectedSectionIndex === null) return;

    const newInput = generateNewInput(type);
    const updatedSections = [...schema.sections];
    updatedSections[selectedSectionIndex].inputs.push(newInput);

    setSchema({ ...schema, sections: updatedSections });
  }

  // 🔢 CURRENT INPUTS HANDLERS
  function handleRenameInput(e, index) {
    const updatedSections = [...schema.sections];
    updatedSections[selectedSectionIndex].inputs[index].label = e.target.value;
    setSchema({ ...schema, sections: updatedSections });
  }

  function handleRenameInputKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  }

  function handleDeleteInput(e, index) {
    e.stopPropagation();

    const updatedSections = [...schema.sections];
    updatedSections[selectedSectionIndex].inputs = updatedSections[
      selectedSectionIndex
    ].inputs.filter((_, i) => i !== index);

    setSchema({ ...schema, sections: updatedSections });

    if (selectedInputIndex === index) {
      setSelectedInputIndex(null);
    } else if (selectedInputIndex > index) {
      setSelectedInputIndex(selectedInputIndex - 1);
    }
  }

  return (
    <div className="schema-builder-container">
      {/* LEFT COLUMN */}
      <div className="schema-column schema-column-left">
        <div className="sections-manager">
          <div className="section-header">
            <h2>Sections Manager</h2>
          </div>

          <div className="sections-manager-toolbar">
            <span className="sections-manager-toolbar-title">Toolbar</span>
            <span
              className="sections-manager-add-tool"
              onClick={addNewSection}
              title="Add New Section"
            >
              ➕
            </span>
          </div>

          <div className="section-manager-content">
            <ul className="sections-manager-list">
              {schema.sections.map((section, index) => (
                <li
                  key={section.id}
                  className={`sections-manager-item ${
                    selectedSectionIndex === index
                      ? "sections-manager-item-selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedSectionIndex(index);
                    setSelectedInputIndex(null);
                  }}
                >
                  <div className="sections-manager-item-content">
                    <span className="sections-manager-bullet">•</span>
                    <input
                      className="sections-manager-name"
                      type="text"
                      value={section.name}
                      maxLength={21}
                      onChange={(e) => handleRenameSection(e, index)}
                      onKeyDown={(e) => handleRenameSectionKeyDown(e)}
                    />
                  </div>

                  <span
                    className="sections-manager-delete"
                    onClick={(e) => handleDeleteSection(e, index)}
                    title="Delete Section"
                  >
                    −
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="add-input-container">
          <div className="section-header">
            <h2>Add Input</h2>
          </div>

          {['text', 'checkbox', 'dropdown', 'dropdownTable'].map((type) => (
            <div className="add-input-toolbar" key={type}>
              <span className="add-input-toolbar-title">
                {type === 'dropdownTable' ? 'Dropdown Table' : capitalizeFirstLetter(type)}
              </span>
              <span
                className="add-input-add-tool"
                onClick={() => addInputToCurrentSection(type)}
                title={`Add ${capitalizeFirstLetter(type)}`}
              >
                ➕
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE COLUMN */}
      <div className="schema-column schema-column-center">
        <div className="section-header">
          <h2>Selected Section</h2>
        </div>

        {selectedSectionIndex === null ? (
          <div className="selected-section-content">
              <div className="selected-section-toolbar">
              <span className="selected-section-toolbar-title">
                No Section Selected
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="selected-section-toolbar">
              <span className="selected-section-toolbar-title">
                {schema.sections[selectedSectionIndex].name}
              </span>
            </div>

            <div className="selected-section-content">
              <ul className="selected-section-list">
                {schema.sections[selectedSectionIndex].inputs.map((input, index) => (
                  <li
                    key={input.id}
                    className={`selected-section-item ${
                      selectedInputIndex === index ? 'selected-section-item-selected' : ''
                    }`}
                    onClick={() => setSelectedInputIndex(index)}
                  >
                    <div className="selected-section-item-content">
                      <span className="selected-section-bullet">•</span>
                      <input
                        className="selected-section-label"
                        type="text"
                        value={input.label}
                        maxLength={21}
                        onChange={(e) => handleRenameInput(e, index)}
                        onKeyDown={handleRenameInputKeyDown}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <span
                      className="selected-section-delete"
                      onClick={(e) => handleDeleteInput(e, index)}
                      title="Delete Input"
                    >
                      −
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="schema-column schema-column-right">
        <div className="section-header">
          <h2>Input Configurator</h2>
        </div>
        <div className="section-content">
          <p>Edit settings for the selected input.</p>
          <ul className="input-configurator-list">
            <li>Label</li>
            <li>Input Type</li>
            <li>Options (if dropdown)</li>
            <li>Validation (required, min, max)</li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {isSchemaPreviewOpen && (
        <div className="schema-preview-modal">
          <div className="modal-content">
            <h2>Schema Preview</h2>
            <p>This is where the JSON schema preview will appear.</p>
            <button
              className="close-modal-button"
              onClick={() => setIsSchemaPreviewOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="schema-builder-footer-toolbar">
        <button
          className="preview-schema-button"
          onClick={() => setIsSchemaPreviewOpen(true)}
          title="Preview Full Schema"
        >
          Preview Schema
        </button>
      </div>
    </div>
  );
}

export default SchemaBuilder;
