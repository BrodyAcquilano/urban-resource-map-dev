// src/utils/AddLocationModalHelpers.jsx

export function renderDynamicFormPage({
  section,
  formData,
  setFormData,
  sectionIndex,
}) {
  if (!section) return null;

  return (
    <div>
      <h3>{section.name}</h3>
      {section.inputs.map((input, inputIndex) => {
        const inputValue =
          formData.sections[sectionIndex].inputs[inputIndex].value;

        if (input.type === "text") {
          return (
            <div key={input.id} className="form-group">
              <label>{input.label}:</label>
              <input
                type={input.type}
                value={inputValue || ""}
                maxLength={input.maxLength || 150}
                onChange={(e) =>
                  setFormData((prev) => {
                    const newFormData = { ...prev };
                    newFormData.sections[sectionIndex].inputs[
                      inputIndex
                    ].value = e.target.value;
                    return newFormData;
                  })
                }
              />
            </div>
          );
        }

        if (input.type === "number") {
          return (
            <div key={input.id} className="form-group">
              <label>{input.label}:</label>
              <input
                type={input.type}
                value={inputValue || ""}
                onChange={(e) => {
                  let newValue = e.target.value;

                  if (newValue.length > (input.maxLength || 20)) {
                    return;
                  }

                  setFormData((prev) => {
                    const newFormData = { ...prev };
                    newFormData.sections[sectionIndex].inputs[
                      inputIndex
                    ].value = newValue;
                    return newFormData;
                  });
                }}
                onBlur={() => {
                  setFormData((prev) => {
                    const newFormData = { ...prev };
                    let value =
                      newFormData.sections[sectionIndex].inputs[inputIndex]
                        .value;

                    if (isNaN(Number(value))) {
                      value = "";
                    } else {
                      let numericValue = Number(value);

                      if (
                        typeof input.minValue === "number" &&
                        numericValue < input.minValue
                      ) {
                        numericValue = input.minValue;
                      }
                      if (
                        typeof input.maxValue === "number" &&
                        numericValue > input.maxValue
                      ) {
                        numericValue = input.maxValue;
                      }

                      value = numericValue;
                    }

                    newFormData.sections[sectionIndex].inputs[
                      inputIndex
                    ].value = value;
                    return newFormData;
                  });
                }}
              />
            </div>
          );
        }

        if (input.type === "dropdown") {
          return (
            <div key={input.id} className="form-group">
              <label>{input.label}:</label>
              <select
                value={inputValue || input.options[0]?.label || ""}
                onChange={(e) =>
                  setFormData((prev) => {
                    const newFormData = { ...prev };
                    newFormData.sections[sectionIndex].inputs[
                      inputIndex
                    ].value = e.target.value;
                    return newFormData;
                  })
                }
              >
                {input.options.map((opt) => (
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (input.type === "checkbox") {
          return (
            <div key={input.id} className="inline-checkbox-row">
              <label className="label-container">{input.label}</label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={inputValue || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      const newFormData = { ...prev };
                      newFormData.sections[sectionIndex].inputs[inputIndex] = {
                        ...newFormData.sections[sectionIndex].inputs[
                          inputIndex
                        ],
                        value: checked,
                      };
                      return newFormData;
                    });
                  }}
                />
              </div>

              {/* Only display notes if they exist */}
              {input.note && input.note.trim() !== "" && (
                <div className="notes-cell">{input.note}</div>
              )}
            </div>
          );
        }

        if (input.type === "hours") {
          return renderHoursInput({
            input,
            formData,
            setFormData,
            sectionIndex,
            inputIndex,
          });
        }

        return null;
      })}
    </div>
  );
}

function renderHoursInput({
  input,
  formData,
  setFormData,
  sectionIndex,
  inputIndex,
}) {
  const hoursData = formData.sections[sectionIndex].inputs[inputIndex];

  return (
    <div key={input.id} >
      <h3>{input.label}:</h3>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Open?</th>
            <th>Open</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              <td>
                <input
                  type="checkbox"
                  checked={hoursData.isLocationOpen?.[day] || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      const newFormData = { ...prev };
                      newFormData.sections[sectionIndex].inputs[
                        inputIndex
                      ].isLocationOpen[day] = checked;

                      if (checked) {
                        newFormData.sections[sectionIndex].inputs[
                          inputIndex
                        ].openHours[day] = {
                          open: "9:00 a.m.",
                          close: "5:00 p.m.",
                        };
                      } else {
                        newFormData.sections[sectionIndex].inputs[
                          inputIndex
                        ].openHours[day] = {
                          open: "",
                          close: "",
                        };
                      }

                      return newFormData;
                    });
                  }}
                />
              </td>
              {hoursData.isLocationOpen?.[day] ? (
                <>
                  <td>
                    <select
                      value={hoursData.openHours?.[day]?.open || ""}
                      onChange={(e) => {
                        setFormData((prev) => {
                          const newFormData = { ...prev };
                          newFormData.sections[sectionIndex].inputs[
                            inputIndex
                          ].openHours[day].open = e.target.value;
                          return newFormData;
                        });
                      }}
                    >
                      {timeOptionsAMPM.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={hoursData.openHours?.[day]?.close || ""}
                      onChange={(e) => {
                        setFormData((prev) => {
                          const newFormData = { ...prev };
                          newFormData.sections[sectionIndex].inputs[
                            inputIndex
                          ].openHours[day].close = e.target.value;
                          return newFormData;
                        });
                      }}
                    >
                      {timeOptionsAMPM.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                </>
              ) : (
                <td colSpan={2}>
                  <div className="closed-cell">Closed</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const timeOptionsAMPM = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const suffix = hour < 12 ? "a.m." : "p.m.";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${suffix}`;
});

// ────────────────
// Dynamic Initialization Helpers
// ────────────────

export function initializeFormData(schema) {
  const formData = { sections: [] };

  for (const schemaSection of schema.sections) {
    const formDataSection = {
      id: schemaSection.id,
      name: schemaSection.name,
      inputs: [],
    };

    for (const schemaInput of schemaSection.inputs) {
      let inputObject = {
        id: schemaInput.id,
        label: schemaInput.label,
      };

      if (schemaInput.type === "text" || schemaInput.type === "number") {
        inputObject.value = "";
      }

      if (schemaInput.type === "checkbox") {
        inputObject.value = false;
      }

      if (schemaInput.type === "dropdown") {
        inputObject.value = schemaInput.options?.[0]?.label || "";
      }

      if (schemaInput.type === "hours") {
        inputObject.isLocationOpen = Object.fromEntries(
          daysOfWeek.map((day) => [day, false])
        );
        inputObject.openHours = Object.fromEntries(
          daysOfWeek.map((day) => [day, { open: "", close: "" }])
        );
      }

      formDataSection.inputs.push(inputObject);
    }

    formData.sections.push(formDataSection);
  }

  return formData;
}

// ────────────────
// Validation Functions
// ────────────────

export function validateFormData(schema, formSections) {
  for (
    let sectionIndex = 0;
    sectionIndex < schema.sections.length;
    sectionIndex++
  ) {
    const section = schema.sections[sectionIndex];
    const sectionData = formSections[sectionIndex];

    if (!sectionData || !sectionData.inputs) {
      console.error(`Section ${section.name} is missing in form data.`);
      return false;
    }

    for (let inputIndex = 0; inputIndex < section.inputs.length; inputIndex++) {
      const input = section.inputs[inputIndex];
      const value = sectionData.inputs[inputIndex].value;

      if (input.type === "text" || input.type === "number") {
        if (
          input.isRequired &&
          (value === "" || value === null || value === undefined)
        ) {
          return false;
        }

        if (input.type === "number") {
          if (value !== "" && !isValidNumber(value, input)) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

// ────────────────
// Individual Field Validators
// ────────────────

function isValidNumber(value, input) {
  const num = parseFloat(value);
  if (isNaN(num)) return false;

  const min = typeof input.minValue === "number" ? input.minValue : -Infinity;
  const max = typeof input.maxValue === "number" ? input.maxValue : Infinity;

  return num >= min && num <= max;
}

export function validateHasOpenDay(isLocationOpen = {}) {
  return Object.values(isLocationOpen).some((v) => v === true);
}

export function validateOpenCloseTimes(openHours, isLocationOpen) {
  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return null;

    const match = timeStr.match(/^(\d{1,2}):(\d{2}) (a\.m\.|p\.m\.)$/);
    if (!match) return null;

    const [, hourStr, minuteStr, period] = match;
    let hour = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (period === "p.m." && hour !== 12) hour += 12;
    if (period === "a.m." && hour === 12) hour = 0;

    return hour * 60 + minutes;
  };

  for (const day of daysOfWeek) {
    if (!isLocationOpen[day]) continue;

    const open = openHours[day]?.open || "";
    const close = openHours[day]?.close || "";

    const openMins = parseTime(open);
    const closeMins = parseTime(close);

    if (openMins == null || closeMins == null) return false;
    if (closeMins <= openMins) return false;
  }

  return true;
}
