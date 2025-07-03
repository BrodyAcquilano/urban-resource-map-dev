// 📦 Filter Rendering Entry Point
export function renderFiltersBySchema({ schema, filterState, setFilterState }) {
  if (!schema) return null;

  return schema.sections.map((schemaSection) => (
    <div key={schemaSection.id} className="section">
      <h3>{schemaSection.name}</h3>
      {schemaSection.inputs
        .filter((schemaInput) => schemaInput.isFilter)
        .map((schemaInput) =>
          renderInputFilter(
            schemaInput,
            filterState[schemaInput.id],
            (newValue) =>
              setFilterState((prev) => ({
                ...prev,
                [schemaInput.id]: newValue,
              }))
          )
        )}
    </div>
  ));
}

function renderInputFilter(schemaInput, filterValue, setFilterValue) {
  switch (schemaInput.type) {
    case "text":
      return (
        <div key={schemaInput.id} className="form-group">
          <label>{schemaInput.label}:</label>
          <input
            type="text"
            value={filterValue || ""}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Type to filter..."
          />
        </div>
      );

    case "number":
      return (
        <div key={schemaInput.id} className="form-group">
          <label>{schemaInput.label} (Min):</label>
          <input
            type="number"
            value={filterValue?.min || ""}
            onChange={(e) =>
              setFilterValue({ ...filterValue, min: e.target.value })
            }
            placeholder="Min"
          />
          <label>{schemaInput.label} (Max):</label>
          <input
            type="number"
            value={filterValue?.max || ""}
            onChange={(e) =>
              setFilterValue({ ...filterValue, max: e.target.value })
            }
            placeholder="Max"
          />
        </div>
      );

    case "checkbox":
      return (
        <div key={schemaInput.id} className="inline-checkbox-row">
          <label className="label-container">{schemaInput.label}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={filterValue || false}
              onChange={(e) => setFilterValue(e.target.checked)}
            />
          </div>
        </div>
      );

    case "dropdown":
      return (
        <div key={schemaInput.id} className="form-group">
          <label>{schemaInput.label}:</label>
          <select
            value={filterValue || "Any"}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="Any">Any</option>
            {schemaInput.options.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "hours":
      return renderHoursFilter(schemaInput, filterValue, setFilterValue);

    default:
      return null;
  }
}

export function renderHoursFilter(schemaInput, filterValue, setFilterValue) {
  return (
    <div key={schemaInput.id} className="form-group">
      <label>{schemaInput.label} (Day of Week):</label>
      <select
        value={filterValue?.day || "Any"}
        onChange={(e) =>
          setFilterValue({ ...filterValue, day: e.target.value })
        }
      >
        <option value="Any">Any Day</option>
        {daysOfWeek.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>

      <label>{schemaInput.label} (Time of Day):</label>
      <select
        value={filterValue?.time || "Any"}
        onChange={(e) =>
          setFilterValue({ ...filterValue, time: e.target.value })
        }
      >
        <option value="Any">Any Time</option>
        {timeOptionsAMPM.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function matchesHoursFilter(filterValue, marker) {
  if (!marker || !marker.sections) return false;

  for (const markerSection of marker.sections) {
    for (const markerInput of markerSection.inputs) {
      if (markerInput.isLocationOpen && markerInput.openHours) {
        const isOpen = markerInput.isLocationOpen;
        const hours = markerInput.openHours;

        // If no filter is applied
        if (filterValue.day === "Any" && filterValue.time === "Any") {
          if (Object.entries(isOpen).some(([day, open]) => open === true)) {
            return true;
          }
        }

        // Day is specific, Time is Any
        if (filterValue.day !== "Any" && filterValue.time === "Any") {
          if (isOpen?.[filterValue.day] === true) return true;
        }

        // Day is Any, Time is specific
        if (filterValue.day === "Any" && filterValue.time !== "Any") {
          const filterMinutes = timeAMPMToMinutes(filterValue.time);

          if (
            Object.entries(isOpen).some(([day, open]) => {
              if (!open) return false;

              const openTime = hours?.[day]?.open || "12:00 a.m.";
              const closeTime = hours?.[day]?.close || "11:59 p.m.";
              const openMinutes = timeAMPMToMinutes(openTime);
              const closeMinutes = timeAMPMToMinutes(closeTime);

              return filterMinutes >= openMinutes && filterMinutes <= closeMinutes;
            })
          ) {
            return true;
          }
        }

        // Day is specific, Time is specific
        if (filterValue.day !== "Any" && filterValue.time !== "Any") {
          if (isOpen?.[filterValue.day] !== true) continue;

          const openTime = hours?.[filterValue.day]?.open || "12:00 a.m.";
          const closeTime = hours?.[filterValue.day]?.close || "11:59 p.m.";
          const openMinutes = timeAMPMToMinutes(openTime);
          const closeMinutes = timeAMPMToMinutes(closeTime);
          const filterMinutes = timeAMPMToMinutes(filterValue.time);

          if (filterMinutes >= openMinutes && filterMinutes <= closeMinutes) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

export function buildSelectedFilters(currentSchema, filterState) {
  const updatedFilters = [];

  currentSchema.sections.forEach((schemaSection) => {
    schemaSection.inputs.forEach((schemaInput) => {
      if (!schemaInput.isFilter) return;

      const filterValue = filterState[schemaInput.id];

      if (schemaInput.type === "text" && filterValue.trim() !== "") {
        updatedFilters.push({ label: schemaInput.label, value: filterValue });
      }

      if (
        schemaInput.type === "number" &&
        (filterValue.min !== "" || filterValue.max !== "")
      ) {
        updatedFilters.push({
          label: schemaInput.label,
          value: `${filterValue.min || "-∞"} to ${filterValue.max || "∞"}`,
        });
      }

      if (schemaInput.type === "checkbox" && filterValue === true) {
        updatedFilters.push({ label: schemaInput.label, value: "Checked" });
      }

      if (
        schemaInput.type === "dropdown" &&
        filterValue !== "Any" &&
        filterValue !== ""
      ) {
        updatedFilters.push({ label: schemaInput.label, value: filterValue });
      }

      if (
        schemaInput.type === "hours" &&
        (filterValue.day !== "Any" || filterValue.time !== "Any")
      ) {
        let labelText = schemaInput.label;

        if (filterValue.day !== "Any" && filterValue.time !== "Any") {
          labelText += `: Open on ${filterValue.day} at ${filterValue.time}`;
        } else if (filterValue.day !== "Any") {
          labelText += `: Open on ${filterValue.day}`;
        } else if (filterValue.time !== "Any") {
          labelText += `: Open at ${filterValue.time}`;
        }

        updatedFilters.push({ label: labelText });
      }
    });
  });

  return updatedFilters;
}

// ────────────────
// Time Helpers
// ────────────────

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

export const timeAMPMToMinutes = (timeStr) => {
  const cleaned = timeStr.trim().toLowerCase();
  const [timePart, period] = cleaned.split(/\s+/);
  if (!timePart || !period) return 0;
  let [hour, minute] = timePart.split(":").map(Number);
  if (period === "p.m." && hour !== 12) hour += 12;
  if (period === "a.m." && hour === 12) hour = 0;
  return hour * 60 + minute;
};

export const time24ToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};
