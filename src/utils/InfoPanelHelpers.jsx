// src/utils/InfoPanelHelpers.jsx

export function renderInfoPanelBySchema(selectedLocation, currentSchema) {
  return currentSchema.sections.map((schemaSection, sectionIndex) => {
    const markerSection = selectedLocation.sections?.[sectionIndex];
    if (!markerSection) return null;

    const schemaInputs = schemaSection.inputs;
    const markerInputs = markerSection.inputs;

    const displayedSchemaInputs = schemaInputs.filter((schemaInput) => schemaInput.isDisplayed);
    if (displayedSchemaInputs.length === 0) return null;

    const allCheckboxes = displayedSchemaInputs.every((schemaInput) => schemaInput.type === "checkbox");
    const allDisplayAsList = displayedSchemaInputs.every((schemaInput) => schemaInput.displayStyle === "List");

    if (allCheckboxes && allDisplayAsList) {
      const checkedItems = displayedSchemaInputs
        .map((schemaInput, inputIndex) => ({
          schemaInput,
          markerInput: markerInputs[inputIndex],
        }))
        .filter(({ schemaInput, markerInput }) => markerInput.value === true || schemaInput.displayWhenFalse);

      if (checkedItems.length === 0) return null;

      return (
        <div key={schemaSection.id} className="section">
          <h3>{schemaSection.name}</h3>
          <ul>
            {checkedItems.map(({ schemaInput, markerInput }) => (
              <li key={schemaInput.id}>
                {markerInput.value === true
                  ? schemaInput.label
                  : schemaInput.falseDisplayText || `${schemaInput.label}: Not Available`}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div key={schemaSection.id} className="section">
        <h3>{schemaSection.name}</h3>
        {displayedSchemaInputs.map((schemaInput, inputIndex) =>
          renderIndividualInput(schemaInput, markerInputs[inputIndex])
        )}
      </div>
    );
  });
}

function renderIndividualInput(schemaInput, markerInput) {
  if (!markerInput) return null;

  if (schemaInput.type === "checkbox") {
    if (markerInput.value === true) {
      return <p key={schemaInput.id}>✅ {schemaInput.label}</p>;
    } else if (schemaInput.displayWhenFalse) {
      return <p key={schemaInput.id}>{schemaInput.falseDisplayText || `${schemaInput.label}: Not Available`}</p>;
    } else {
      return null;
    }
  }

  if (schemaInput.type === "text" || schemaInput.type === "number" || schemaInput.type === "dropdown") {
    if (markerInput.value === "" && !schemaInput.displayIfEmpty) return null;

    return (
      <div key={schemaInput.id} className="form-group">
        <label>{schemaInput.label}:</label>
        <p>{markerInput.value || schemaInput.emptyDisplayText || "Not Provided"}</p>
      </div>
    );
  }

  if (schemaInput.type === "hours") {
    return renderHoursInput(schemaInput, markerInput);
  }

  return null;
}

function renderHoursInput(schemaInput, markerInput) {
  if (!markerInput || !markerInput.isLocationOpen || !markerInput.openHours) return null;

  const isLocationOpen = markerInput.isLocationOpen;
  const openHours = markerInput.openHours;

  return (
    <div key={schemaInput.id} className="section">
      <h3>{schemaInput.label}</h3>
      <ul>
        {Object.entries(isLocationOpen).map(([day, isOpen]) => (
          <li key={day}>
            <strong>{day}</strong>:{" "}
            {isOpen
              ? `${openHours[day]?.open || "??"} – ${openHours[day]?.close || "??"}`
              : "Closed"}
          </li>
        ))}
      </ul>
    </div>
  );
}
