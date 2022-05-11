import React from "react";

export function CheckStat({
  title,
  value,
  append,
  bottomAppend,
  containerClass = "",
  valueContainerClass = "",
  valueClass,
  className,
  ...rest
}) {
  return (
    <div className={`flex flex-col ${containerClass} ${className}`} {...rest}>
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className={`flex ${valueContainerClass}`}>
        <span className={`text-4xl font-bold ${valueClass}`}>{value}</span>
        {append}
      </div>
      {bottomAppend}
    </div>
  );
}
