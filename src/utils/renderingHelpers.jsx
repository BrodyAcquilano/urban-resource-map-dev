import React from "react";




// ─────────────────────────────────────────────
// Rendering Helpers (Updated for Dynamic Schema)
// ─────────────────────────────────────────────









// Used in: FilterPanel.jsx and EditLocation.jsx for rendering dynamic categories.
export function renderCheckboxGroupBySchema(title, items, values, onChange) {
  return (
    <div className="section" key={title}>
      <h3>{title}</h3>
      {items.map((item) => (
        <div key={item.label} className="inline-checkbox-row">
          <label className="label-container">{item.label}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={!!values[item.label]}
              onChange={(e) => onChange(item.label, e.target.checked)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Used in: AddLocationModal.jsx for rendering dynamic categories with notes.
export function renderCheckboxGroupWithNotesBySchema(
  category,
  values,
  onChange
) {
  return (
    <div key={category.categoryName}>
      <h3>{category.categoryName}</h3>
      {category.items.map((item) => (
        <div key={item.label} className="inline-checkbox-row">
          <label className="label-container">{item.label}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={!!values[item.label]}
              onChange={(e) => onChange(item.label, e.target.checked)}
            />
          </div>
          <div className="notes-cell">{item.note || ""}</div>
        </div>
      ))}
    </div>
  );
}


