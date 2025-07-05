import React from "react";

const baseClasses =
  "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  // Variante per bottoni solo testo/icona, come "Elimina"
  dangerLink:
    "text-red-500 hover:text-red-700 focus:ring-red-500 focus:ring-offset-0 p-1",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  // I bottoni di tipo "link" non usano gli stili di base (padding, ombra, etc.)
  const isLinkVariant = variant.toLowerCase().includes("link");

  const classes = `${isLinkVariant ? "" : baseClasses} ${
    variantClasses[variant] || variantClasses.primary
  } ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
