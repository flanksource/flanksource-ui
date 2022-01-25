import React from "react";

export function TextInput({
  label,
  id,
  className,
  labelClassName,
  type = "text",
  ...rest
}) {
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={id}
        id={id}
        className={`h-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 sm:text-sm border-gray-300 rounded-md ${className}`}
        {...rest}
      />
    </>
  );
}
