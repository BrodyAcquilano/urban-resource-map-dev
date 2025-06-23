import React from "react";

// ─────────────────────────────────────────────
// Rendering Helpers (Updated for Dynamic Schema)
// ─────────────────────────────────────────────

// Used in: InfoPanel.jsx to display only checked items by dynamic category.
export const renderCheckedItemsBySchema = (marker, categories) => {
  return categories.map((category) => {
    const checkedItems = category.items.filter((item) => marker.categories?.[item]);
    return (
      <div className="section" key={category.categoryName}>
        <h3>{category.categoryName}</h3>
        {checkedItems.length ? (
          <ul>
            {checkedItems.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        ) : (
          <p>No {category.categoryName.toLowerCase()} listed</p>
        )}
      </div>
    );
  });
};

// Used in: FilterPanel.jsx and EditLocation.jsx for rendering dynamic categories.
export function renderCheckboxGroupBySchema(title, items, values, onChange) {
  return (
    <div className="section" key={title}>
      <h3>{title}</h3>
      {items.map((label) => (
        <div key={label} className="inline-checkbox-row">
          <label className="label-container">{label}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={!!values[label]}
              onChange={(e) => onChange(label, e.target.checked)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Used in: AddLocationModal.jsx for rendering dynamic categories with notes.
export function renderCheckboxGroupWithNotesBySchema(category, values, onChange) {
  return (
    <div key={category.categoryName}>
      <h3>{category.categoryName}</h3>
      {category.items.map((item) => (
        <div key={item} className="inline-checkbox-row">
          <label className="label-container">{item}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={!!values[item]}
              onChange={(e) => onChange(item, e.target.checked)}
            />
          </div>
          <div className="notes-cell">{category.notes[item] || ""}</div>
        </div>
      ))}
    </div>
  );
}
