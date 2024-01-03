import React from "react";

type CheckDetailsProps = Omit<React.HTMLProps<HTMLDivElement>, "value"> & {
  title: React.ReactNode;
  value: React.ReactNode;
  append?: React.ReactNode;
  bottomAppend?: React.ReactNode;
  containerClassName?: string;
  valueContainerClassName?: string;
  valueClass?: string;
};

export function CheckStat({
  title,
  value,
  append,
  bottomAppend,
  containerClassName = "",
  valueContainerClassName = "",
  valueClass,
  className,
  ...rest
}: CheckDetailsProps) {
  return (
    <div
      className={`flex flex-col ${containerClassName} ${className}`}
      {...rest}
    >
      {title && (
        <div className="text-sm font-medium text-gray-500">{title}</div>
      )}
      <div className={`flex ${valueContainerClassName}`}>
        <span className={`text-4xl font-bold ${valueClass}`}>{value}</span>
        {append}
      </div>
      {bottomAppend}
    </div>
  );
}
