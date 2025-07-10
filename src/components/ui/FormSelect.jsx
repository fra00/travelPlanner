import React from "react";

function FormSelect({
  label,
  id,
  options = [],
  description,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <select
          id={id}
          {...props}
          className="block w-full rounded-md border-0 py-2 px-3 bg-white text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 disabled:ring-slate-200"
        >
          {options.map((opt) =>
            typeof opt === "object" ? (
              <option key={opt.value ?? opt.label} value={opt.value}>
                {opt.label}
              </option>
            ) : (
              <option key={opt} value={opt}>
                {opt}
              </option>
            )
          )}
        </select>
      </div>
      {description && (
        <p className="mt-1.5 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

export default FormSelect;
