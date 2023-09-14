import React from "react";
import { HTMLInputTypeAttribute } from "react";

interface IProps {
  label?: string;
  id: string;
  className?: string;
  labelClassName?: string;
  onEnter?: (e: React.KeyboardEvent) => void;
  value?: string;
  defaultValue?: string;
  type?: HTMLInputTypeAttribute;
}

export function TextInput({
  label,
  id,
  className,
  labelClassName,
  onEnter,
  value,
  defaultValue,
  type = "text",
  ...rest
}: IProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-semibold text-gray-700 mb-2 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        defaultValue={defaultValue}
        type={type}
        value={value}
        name={id}
        id={id}
        onKeyUp={(e) => {
          if (onEnter != null && e.keyCode === 13) {
            e.preventDefault();
            onEnter(e);
          }
        }}
        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 sm:text-sm border-gray-300 rounded-md ${className}`}
        {...rest}
      />
    </>
  );
}
