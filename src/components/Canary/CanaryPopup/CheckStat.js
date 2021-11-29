import React from "react";

export function CheckStat({
  title,
  value,
  append,
  containerClass,
  className,
  ...rest
}) {
  return (
    <div className={`flex flex-col ${containerClass} ${className}`} {...rest}>
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="flex">
        <span className="text-4xl font-bold">{value}</span>
        {append}
      </div>
    </div>
  );
}
