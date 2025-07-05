import React from "react";

function CheckboxGroup({
  label,
  options,
  selectedOptions,
  onChange,
  maxSelections,
}) {
  const handleCheckboxChange = (option) => {
    const newSelectedOptions = [...selectedOptions];
    const optionIndex = newSelectedOptions.indexOf(option);

    if (optionIndex > -1) {
      // Se è già selezionato, lo rimuovo.
      newSelectedOptions.splice(optionIndex, 1);
    } else {
      // Altrimenti lo aggiungo, rispettando il limite.
      if (!maxSelections || newSelectedOptions.length < maxSelections) {
        newSelectedOptions.push(option);
      }
    }
    onChange(newSelectedOptions);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);
          const isDisabled =
            !isSelected &&
            maxSelections &&
            selectedOptions.length >= maxSelections;
          return (
            <div key={option} className="flex items-center">
              <input
                id={`checkbox-${option}`}
                name={option}
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => handleCheckboxChange(option)}
                className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              <label
                htmlFor={`checkbox-${option}`}
                className={`ml-2 block text-sm ${
                  isDisabled ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CheckboxGroup;
