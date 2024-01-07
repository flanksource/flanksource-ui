import React from "react";

type StatProps = Omit<React.HTMLProps<HTMLDivElement>, "value"> & {
  title: React.ReactNode;
  value: React.ReactNode;
  append?: React.ReactNode;
  bottomAppend?: React.ReactNode;
  containerClassName?: string;
  valueContainerClassName?: string;
  valueClass?: string;
  sizeStyle?: "sm" | "lg";
};

export function Stat({
  title,
  value,
  append,
  bottomAppend,
  containerClassName = "",
  valueContainerClassName = "",
  valueClass = "",
  sizeStyle = "lg",
  className,
  ...rest
}: StatProps) {
  if ((value === undefined || value === "") && append === undefined) {
    return null;
  }
  return (
    <div
      className={`flex flex-col ${containerClassName} ${className}`}
      {...rest}
    >
      {title && (
        <div className="text-sm font-medium text-gray-500">{title}</div>
      )}
      <div className={`flex ${valueContainerClassName}`}>
        <span
          className={`${valueClass} ${
            sizeStyle === "lg" ? "text-4xl font-bold" : "text-sm font-semibold"
          }`}
        >
          {value}
        </span>
        {append}
      </div>
      {bottomAppend}
    </div>
  );
}
