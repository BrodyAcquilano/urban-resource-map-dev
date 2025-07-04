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
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
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

  // 🔢 SELECTED SECTION HANDLERS
  function handleRenameInput(e, index) {
    const input = schema.sections[selectedSectionIndex].inputs[index];

    // Prevent renaming core inputs
    if (
      schema.sections[selectedSectionIndex].name === "Core Info" &&
      (input.label === "Latitude" || input.label === "Longitude")
    ) {
      return;
    }

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

  // 🔢 INPUT CONFIGURATOR HANDLERS

  //General
  function handleEmptyDisplayTextChange(e) {
    const updatedSchema = { ...schema };
    updatedSchema.sections[selectedSectionIndex].inputs[
      selectedInputIndex
    ].emptyDisplayText = e.target.value;
    setSchema(updatedSchema);
  }

 

  //Text and Number Input Options handler
  function toggleTextNumberOption(option) {
    const updatedSchema = { ...schema };
    const input =
      updatedSchema.sections[selectedSectionIndex].inputs[selectedInputIndex];
    input[option] = !input[option];
    setSchema(updatedSchema);
  }

  function handleMaxLengthChange(e) {
    const updatedSchema = { ...schema };
    updatedSchema.sections[selectedSectionIndex].inputs[
      selectedInputIndex
    ].maxLength = parseInt(e.target.value, 10);
    setSchema(updatedSchema);
  }

  function handleMinValueChange(e) {
    const updatedSchema = { ...schema };
    updatedSchema.sections[selectedSectionIndex].inputs[
      selectedInputIndex
    ].minValue = parseFloat(e.target.value);
    setSchema(updatedSchema);
  }

  function handleMaxValueChange(e) {
    const updatedSchema = { ...schema };
    updatedSchema.sections[selectedSectionIndex].inputs[
      selectedInputIndex
    ].maxValue = parseFloat(e.target.value);
    setSchema(updatedSchema);
  }

  //Checkbox
  function toggleCheckboxOption(option) {
    const updatedSchema = { ...schema };
    const input =
      updatedSchema.sections[selectedSectionIndex].inputs[selectedInputIndex];
    input[option] = !input[option];
    setSchema(updatedSchema);
  }

  function handleNotesChange(e) {
    const updatedSchema = { ...schema };
    updatedSchema.sections[selectedSectionIndex].inputs[
      selectedInputIndex
    ].notes = e.target.value;
    setSchema(updatedSchema);
  }

   function handleFalseDisplayTextChange(e) {
    const updatedSchema = { ...schema };
    updatedSchema.sections[selectedSectionIndex].inputs[
      selectedInputIndex
    ].falseDisplayText = e.target.value;
    setSchema(updatedSchema);
  }

  function handleTrueDisplayTextChange(e) {
  const updatedSchema = { ...schema };
  updatedSchema.sections[selectedSectionIndex].inputs[
    selectedInputIndex
  ].trueDisplayText = e.target.value;
  setSchema(updatedSchema);
}

  //Dropdown
  function handleAddDropdownOption() {
    const updatedSchema = { ...schema };
    const dropdown =
      updatedSchema.sections[selectedSectionIndex].inputs[selectedInputIndex];

    const newOption = {
      id: Date.now(),
      label: `Option ${dropdown.options.length + 1}`,
    };

    dropdown.options.push(newOption);
    setSchema(updatedSchema);
  }

  function handleDropdownOptionRename(e, optionIndex) {
    const updatedSchema = { ...schema };
    updatedSchema.sections[selectedSectionIndex].inputs[
      selectedInputIndex
    ].options[optionIndex].label = e.target.value;
    setSchema(updatedSchema);
  }

  function handleDeleteDropdownOption(optionIndex) {
    const updatedSchema = { ...schema };
    const dropdown =
      updatedSchema.sections[selectedSectionIndex].inputs[selectedInputIndex];

    dropdown.options.splice(optionIndex, 1);
    setSchema(updatedSchema);
  }

  // 🔢 FOOTER HANDLERS

  function handleFooterInputChange(field, value) {
    const updatedSchema = { ...schema };
    updatedSchema[field] = value;
    setSchema(updatedSchema);
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

                  {/* Conditionally render delete button */}
                  {!section.isCore && (
                    <span
                      className="sections-manager-delete"
                      onClick={(e) => handleDeleteSection(e, index)}
                      title="Delete Section"
                    >
                      −
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="add-input-container">
          <div className="section-header">
            <h2>Add Input</h2>
          </div>

          {["text", "number", "checkbox", "dropdown", "hours"].map((type) => (
            <div className="add-input-toolbar" key={type}>
              <span className="add-input-toolbar-title">
                {type === "dropdownTable"
                  ? "Dropdown Table"
                  : capitalizeFirstLetter(type)}
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
                {schema.sections[selectedSectionIndex].inputs.map(
                  (input, index) => {
                    return (
                      <li
                        key={input.id}
                        className={`selected-section-item ${
                          selectedInputIndex === index
                            ? "selected-section-item-selected"
                            : ""
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
                            readOnly={
                              schema.sections[selectedSectionIndex].isCore &&
                              (input.label === "Latitude" ||
                                input.label === "Longitude")
                            }
                          />
                        </div>

                        {!(
                          schema.sections[selectedSectionIndex].isCore &&
                          (input.label === "Latitude" ||
                            input.label === "Longitude")
                        ) && (
                          <span
                            className="selected-section-delete"
                            onClick={(e) => handleDeleteInput(e, index)}
                            title="Delete Input"
                          >
                            −
                          </span>
                        )}
                      </li>
                    );
                  }
                )}
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

        {/* Configurator Toolbar */}
        {selectedInputIndex === null || selectedSectionIndex === null ? (
          <div className="input-configurator-toolbar">
            <span className="input-configurator-toolbar-title">
              No Input Selected
            </span>
          </div>
        ) : (
          <div className="input-configurator-toolbar">
            <span className="input-configurator-toolbar-title">
              {
                schema.sections[selectedSectionIndex].inputs[selectedInputIndex]
                  .label
              }
            </span>
          </div>
        )}

        <div className="input-configurator-content">
          {selectedInputIndex !== null && selectedSectionIndex !== null && (
            <>
              {/* TEXT INPUT CONFIGURATION */}
              {schema.sections[selectedSectionIndex].inputs[selectedInputIndex]
                .type === "text" && (
                <div className="input-configurator-group">
                  {/* Required */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isRequired
                      }
                      onChange={() => toggleTextNumberOption("isRequired")}
                    />
                    Required Input (Validate in Add/Edit Location)
                  </label>

                  {/* Max Length */}
                  <label className="input-configurator-option">
                    Max Length:
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].maxLength
                      }
                      onChange={handleMaxLengthChange}
                    />
                  </label>

                  {/* Filter */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isFilter
                      }
                      onChange={() => toggleTextNumberOption("isFilter")}
                    />
                    Show as Filter Option
                  </label>

                  {/* Display */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isDisplayed
                      }
                      onChange={() => toggleTextNumberOption("isDisplayed")}
                    />
                    Display in Info Panel
                  </label>

                  {/* Display if Empty */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].displayIfEmpty
                      }
                      onChange={() => toggleCheckboxOption("displayIfEmpty")}
                    />
                    Display in Info Panel if Empty
                  </label>

                  {/* Default Text if Empty */}
                  <label className="input-configurator-notes">
                    Text to Display if Empty:
                    <input
                      type="text"
                      value={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].emptyDisplayText
                      }
                      onChange={handleEmptyDisplayTextChange}
                      maxLength={40}
                    />
                  </label>
                </div>
              )}

              {/* NUMBER INPUT CONFIGURATION */}
              {schema.sections[selectedSectionIndex].inputs[selectedInputIndex]
                .type === "number" && (
                <div className="input-configurator-group">
                  {/* Filter (Allowed for Latitude and Longitude) */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isFilter
                      }
                      onChange={() => toggleTextNumberOption("isFilter")}
                    />
                    Show as Filter Option
                  </label>

                  {/* Display (Allowed for Latitude and Longitude) */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isDisplayed
                      }
                      onChange={() => toggleTextNumberOption("isDisplayed")}
                    />
                    Display in Info Panel
                  </label>

                  {/* Show these options ONLY if NOT Latitude or Longitude */}
                  {schema.sections[selectedSectionIndex].inputs[
                    selectedInputIndex
                  ].label !== "Latitude" &&
                    schema.sections[selectedSectionIndex].inputs[
                      selectedInputIndex
                    ].label !== "Longitude" && (
                      <>
                        {/* Required */}
                        <label className="input-configurator-option">
                          <input
                            type="checkbox"
                            checked={
                              schema.sections[selectedSectionIndex].inputs[
                                selectedInputIndex
                              ].isRequired
                            }
                            onChange={() =>
                              toggleTextNumberOption("isRequired")
                            }
                          />
                          Required Input (Validate in Add/Edit Location)
                        </label>

                        {/* Min and Max Values */}
                        <label className="input-configurator-option">
                          Min Value:
                          <input
                            type="number"
                            value={
                              schema.sections[selectedSectionIndex].inputs[
                                selectedInputIndex
                              ].minValue ?? ""
                            }
                            onChange={handleMinValueChange}
                          />
                        </label>

                        <label className="input-configurator-option">
                          Max Value:
                          <input
                            type="number"
                            value={
                              schema.sections[selectedSectionIndex].inputs[
                                selectedInputIndex
                              ].maxValue ?? ""
                            }
                            onChange={handleMaxValueChange}
                          />
                        </label>

                        {/* Max Length */}
                        <label className="input-configurator-option">
                          Max Length:
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={
                              schema.sections[selectedSectionIndex].inputs[
                                selectedInputIndex
                              ].maxLength
                            }
                            onChange={handleMaxLengthChange}
                          />
                        </label>

                        {/* Display if Empty */}
                        <label className="input-configurator-option">
                          <input
                            type="checkbox"
                            checked={
                              schema.sections[selectedSectionIndex].inputs[
                                selectedInputIndex
                              ].displayIfEmpty
                            }
                            onChange={() =>
                              toggleCheckboxOption("displayIfEmpty")
                            }
                          />
                          Display in Info Panel if Empty
                        </label>

                        {/* Default Text if Empty */}
                        <label className="input-configurator-notes">
                          Text to Display if Empty:
                          <input
                            type="text"
                            value={
                              schema.sections[selectedSectionIndex].inputs[
                                selectedInputIndex
                              ].emptyDisplayText
                            }
                            onChange={handleEmptyDisplayTextChange}
                            maxLength={40}
                          />
                        </label>
                      </>
                    )}
                </div>
              )}

              {/* CHECKBOX INPUT CONFIGURATION */}
              {schema.sections[selectedSectionIndex].inputs[selectedInputIndex]
                .type === "checkbox" && (
                <div className="input-configurator-group">
                  {/* Filter Option */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isFilter
                      }
                      onChange={() => toggleCheckboxOption("isFilter")}
                    />
                    Show as Filter Option
                  </label>

                  {/* Display in Info Panel */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isDisplayed
                      }
                      onChange={() => toggleCheckboxOption("isDisplayed")}
                    />
                    Display in Info Panel
                  </label>

                  {/* Display When False */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].displayWhenFalse
                      }
                      onChange={() => toggleCheckboxOption("displayWhenFalse")}
                    />
                    Display When False (Show in Info Panel even if Unchecked)
                  </label>


                  {/* Default Text if False */}
                  <label className="input-configurator-notes">
                    Text to Display if Unchecked:
                    <input
                      type="text"
                      value={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].falseDisplayText
                      }
                      onChange={handleFalseDisplayTextChange}
                      maxLength={40}
                    />
                  </label>

                  {/* Default Text if Checked */}
                  <label className="input-configurator-notes">
                    Text to Display if Checked:
                    <input
                      type="text"
                      value={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].trueDisplayText || "" // Optional field
                      }
                      onChange={handleTrueDisplayTextChange}
                      maxLength={40}
                    />
                  </label>

                  {/* Notes Field */}
                  <label className="input-configurator-notes">
                    Notes for Add Location Modal:
                    <textarea
                      value={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].notes
                      }
                      onChange={handleNotesChange}
                      maxLength={50}
                      rows={1}
                    />
                  </label>
                </div>
              )}
              {/* DROPDOWN INPUT CONFIGURATION */}
              {schema.sections[selectedSectionIndex].inputs[selectedInputIndex]
                .type === "dropdown" && (
                <div className="input-configurator-group">
                  {/* Filter */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isFilter
                      }
                      onChange={() => toggleCheckboxOption("isFilter")}
                    />
                    Show as Filter Option in Filter Panel
                  </label>

                  {/* Display in Info Panel */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isDisplayed
                      }
                      onChange={() => toggleCheckboxOption("isDisplayed")}
                    />
                    Display in Info Panel
                  </label>

                  {/* Dropdown Options Header */}
                  <h3 className="input-configurator-subtitle">
                    Dropdown Options
                  </h3>

                  <ul className="input-configurator-dropdown-options">
                    {schema.sections[selectedSectionIndex].inputs[
                      selectedInputIndex
                    ].options.map((option, idx) => (
                      <li
                        key={option.id}
                        className="input-configurator-dropdown-option-item"
                      >
                        <input
                          type="text"
                          value={option.label}
                          maxLength={21}
                          onChange={(e) => handleDropdownOptionRename(e, idx)}
                        />
                        <span
                          className="input-configurator-delete-option"
                          onClick={() => handleDeleteDropdownOption(idx)}
                          title="Delete Option"
                        >
                          &minus;
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Add New Option Button */}
                  <button
                    className="input-configurator-add-option-button"
                    onClick={handleAddDropdownOption}
                  >
                    Add Option ➕
                  </button>
                </div>
              )}

              {/* HOURS INPUT CONFIGURATION */}
              {schema.sections[selectedSectionIndex].inputs[selectedInputIndex]
                .type === "hours" && (
                <div className="input-configurator-group">
                  {/* Filter */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isFilter
                      }
                      onChange={() => toggleTextNumberOption("isFilter")}
                    />
                    Show as Filter Option
                  </label>

                  {/* Display */}
                  <label className="input-configurator-option">
                    <input
                      type="checkbox"
                      checked={
                        schema.sections[selectedSectionIndex].inputs[
                          selectedInputIndex
                        ].isDisplayed
                      }
                      onChange={() => toggleTextNumberOption("isDisplayed")}
                    />
                    Display in Info Panel
                  </label>

                  <p className="input-configurator-message">
                    This is a special input type that uses a table of dropdown
                    inputs with weekdays as the rows, and open and close times
                    for the headers. 
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Schema Preview Modal */}
      {isSchemaPreviewOpen && (
        <div className="schema-preview-modal">
          <div className="modal-content">
            <h2>Schema Preview</h2>
            <p>
              Copy and paste the following schema into your MongoDB
              projectSchema collection.
            </p>

            <pre className="schema-preview-block">
              {JSON.stringify(schema, null, 2)}
            </pre>

            <button
              className="copy-schema-button"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
                alert("Schema copied to clipboard!");
              }}
            >
              Copy Schema
            </button>

            <button
              className="close-modal-button"
              onClick={() => setIsSchemaPreviewOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer Toolbar */}
      <div className="schema-builder-footer-toolbar">
        <div className="footer-content-wrapper">
          <div className="footer-input-group">
            <label>
              Project Name:
              <input
                type="text"
                value={schema.projectName}
                onChange={(e) =>
                  handleFooterInputChange("projectName", e.target.value)
                }
                maxLength={50}
              />
            </label>

            <label>
              Collection Name:
              <input
                type="text"
                value={schema.collectionName}
                onChange={(e) =>
                  handleFooterInputChange("collectionName", e.target.value)
                }
                maxLength={50}
              />
            </label>
          </div>

          <button
            className="preview-schema-button"
            onClick={() => setIsSchemaPreviewOpen(true)}
            title="Preview Full Schema"
          >
            Preview Schema
          </button>
        </div>
      </div>
    </div>
  );
}

export default SchemaBuilder;
