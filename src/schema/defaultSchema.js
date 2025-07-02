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
    if (type === 'checkbox') {
  baseInput.displayWhenFalse = false;
  baseInput.falseDisplayText = '';
  baseInput.isScorable = false;
  baseInput.score = 3;
  baseInput.notes = '';
}
  }

 if (type === 'dropdown') {
  baseInput.options = [];
  }

  if (type === 'hours') {
    baseInput.isHours = true;
  }

  return baseInput;
};



// Optional utility
export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);


