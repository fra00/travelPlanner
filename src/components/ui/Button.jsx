import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center border border-transparent font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm enabled:hover:shadow-md",
    secondary:
      "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 shadow-sm enabled:hover:shadow-md",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm enabled:hover:shadow-md",
    info:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm enabled:hover:shadow-md",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm enabled:hover:shadow-md",
    // Link variants have no background or shadow by default
    primaryLink: "text-indigo-600 hover:text-indigo-800 focus:ring-indigo-500",
    secondaryLink: "text-gray-600 hover:text-gray-800 focus:ring-gray-500",
    dangerLink: "text-red-600 hover:text-red-800 focus:ring-red-500",
    infoLink: "text-blue-600 hover:text-blue-800 focus:ring-blue-500",
  };

  // Determine if the variant is a "link" type
  const isLink = variant.toLowerCase().includes("link");

  // Apply appropriate classes based on the variant type
  const classes = `${baseClasses} ${sizeClasses[size]} ${
    variantClasses[variant] || variantClasses.primary
  } ${className} ${isLink ? "p-0 shadow-none" : ""}`; // Remove padding and shadow for links

  // Render either a button or a link based on the variant
  const Component = isLink ? "a" : "button";

  return <Component className={classes} {...props}>{children}</Component>;
};

export default Button;
