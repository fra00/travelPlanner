import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "border border-transparent bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm",
    success:
      "border border-transparent bg-green-600 text-white hover:bg-green-700 shadow-sm",
    danger:
      "border border-transparent bg-red-600 text-white hover:bg-red-700 shadow-sm",
    // Link variants are just styled to look like links but are still buttons.
    primaryLink: "border-transparent text-amber-600 hover:text-amber-800",
    secondaryLink: "border-transparent text-slate-600 hover:text-slate-800",
    dangerLink: "border-transparent text-red-600 hover:text-red-800",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${
    variantClasses[variant] || variantClasses.primary
  } ${className}`;

  return <button className={classes} {...props}>{children}</button>;
};

export default Button;
