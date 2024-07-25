import React, { HTMLInputTypeAttribute } from "react";

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
        <label htmlFor={id} className={`form-label ${labelClassName}`}>
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
        className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
        {...rest}
      />
    </>
  );
}
