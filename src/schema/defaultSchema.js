// src/schema/defaultSchema.js

export const defaultSchema = {
  sections: []
};

export const generateNewSection = () => ({
  id: Date.now(),
  name: "Unnamed Section",
  inputs: []
});

export const generateNewInput = (type) => {
  const baseInput = {
    id: Date.now(),
    label: `${capitalizeFirstLetter(type === 'dropdownTable' ? 'Dropdown Table' : type)}`,
    type,
    isRequired: false,
    isFilter: false
  };

  return baseInput;
};


// Optional utility
export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);


