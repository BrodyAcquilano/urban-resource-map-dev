// src/schema/defaultSchema.js

export const defaultSchema = {
  id: Date.now(), 
  projectName: "", 
  collectionName: "", 
  sections: [
    {
      id: Date.now(), 
      name: "Core Info",
      isCore: true, 
      inputs: [
        {
          id: Date.now() + 1,
          label: "Latitude",
          type: "number",
          isRequired: true,
          isFilter: false,
          isDisplayed: false, 
          minValue: -90,
          maxValue: 90,
          maxLength: 20,
          displayIfEmpty: false,
          emptyDisplayText: ""
        },
        {
          id: Date.now() + 2,
          label: "Longitude",
          type: "number",
          isRequired: true,
          isFilter: false,
          isDisplayed: false,
          minValue: -180,
          maxValue: 180,
          maxLength: 20,
          displayIfEmpty: false,
          emptyDisplayText: ""
        }
      ]
    }
  ]
};

export const generateNewSection = () => ({
  id: Date.now(),
  name: "Unnamed Section",
  isCore: false,
  inputs: []
});

export const generateNewInput = (type) => {
  const baseInput = {
    id: Date.now(),
    label: `${capitalizeFirstLetter(type)}`,
    type,
    isRequired: false,
    isFilter: false,
    isDisplayed: true,
  };

  if (type === 'text') {
    baseInput.maxLength = 150;
    baseInput.displayIfEmpty = false;
    baseInput.emptyDisplayText = '';
  }

  if (type === 'number') {
    baseInput.minValue = null;
    baseInput.maxValue = null;
    baseInput.maxLength = 20;
    baseInput.displayIfEmpty = false;
    baseInput.emptyDisplayText = '';
  }

  if (type === 'checkbox') {
    baseInput.displayWhenFalse = false;
    baseInput.falseDisplayText = '';
    baseInput.isScorable = false;
    baseInput.score = 3;
    baseInput.notes = '';
    baseInput.displayStyle="Single";
  }

  if (type === 'dropdown') {
    baseInput.options = [];
  }

  if (type === 'hours') {
    baseInput.isHours = true;
  }

  return baseInput;
};

export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);





