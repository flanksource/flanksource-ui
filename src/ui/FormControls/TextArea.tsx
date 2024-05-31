import React from "react";

interface TextAreaProps {
  label?: string;
  labelClassName?: string;
  value?: string;
  defaultValue?: string;
}

export function TextArea({
  label,
  id,
  className,
  labelClassName,
  value,
  defaultValue,
  ...rest
}: TextAreaProps & React.InputHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <>
      {label && (
        <label htmlFor={id} className={`form-label ${labelClassName}`}>
          {label}
        </label>
      )}
      <textarea
        defaultValue={defaultValue}
        value={value}
        name={id}
        id={id}
        className={`h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 sm:text-sm border-gray-300 rounded-md ${className}`}
        {...rest}
      ></textarea>
    </>
  );
}
