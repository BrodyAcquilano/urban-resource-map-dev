// src/utils/InfoPanelHelpers.jsx

export function renderInfoPanelBySchema(selectedLocation, currentSchema) {
  return currentSchema.sections.map((schemaSection, sectionIndex) => {
    const markerSection = selectedLocation.sections?.[sectionIndex];
    if (!markerSection) return null;

    const schemaInputs = schemaSection.inputs;
    const markerInputs = markerSection.inputs;

    const displayedSchemaInputs = schemaInputs.filter(
      (schemaInput) => schemaInput.isDisplayed
    );
    if (displayedSchemaInputs.length === 0) return null;

    return (
      <div key={schemaSection.id} className="section">
        <h3>{schemaSection.name}</h3>
        {displayedSchemaInputs.map((schemaInput, inputIndex) => {
          const markerInput = markerInputs[inputIndex];
          if (!markerInput) return null;

          if (schemaInput.type === "checkbox") {
            return (
              <div key={schemaInput.id} className="inline-row">
                <label className="label-container">{schemaInput.label}:</label>
                <label className="value-container">
                  {markerInput.value === true
                    ? schemaInput.trueDisplayText || "true"
                    : schemaInput.displayWhenFalse
                    ? schemaInput.falseDisplayText || "false"
                    : null}
                </label>
              </div>
            );
          }

          if (schemaInput.type === "text" || schemaInput.type === "number") {
            if (
              (markerInput.value === "" ||
                markerInput.value === null ||
                markerInput.value === undefined) &&
              !schemaInput.displayIfEmpty
            )
              return null;

            return (
              <div key={schemaInput.id} className="inline-row">
                <label className="label-container">{schemaInput.label}:</label>
                <label className="value-container">
                  {markerInput.value === "" ||
                  markerInput.value === null ||
                  markerInput.value === undefined
                    ? schemaInput.emptyDisplayText || "No Data Entered"
                    : markerInput.value}
                </label>
              </div>
            );
          }

          if (schemaInput.type === "dropdown") {
            if (markerInput.value === "") return null;

            return (
              <div key={schemaInput.id} className="inline-row">
                <label className="label-container">{schemaInput.label}:</label>
                <label className="value-container">{markerInput.value}</label>
              </div>
            );
          }

          if (schemaInput.type === "hours") {
            return renderHoursInput(schemaInput, markerInput);
          }

          return null;
        })}
      </div>
    );
  });
}

function renderHoursInput(schemaInput, markerInput) {
  if (!markerInput || !markerInput.isLocationOpen || !markerInput.openHours)
    return null;

  const isLocationOpen = markerInput.isLocationOpen;
  const openHours = markerInput.openHours;

  return (
    <div key={schemaInput.id}>
      <h3>{schemaInput.label}</h3>
      <ul>
        {Object.entries(isLocationOpen).map(([day, isOpen]) => (
          <li key={day}>
            <strong>{day}</strong>:{" "}
            {isOpen
              ? `${openHours[day]?.open || "??"} – ${
                  openHours[day]?.close || "??"
                }`
              : "Closed"}
          </li>
        ))}
      </ul>
    </div>
  );
}
