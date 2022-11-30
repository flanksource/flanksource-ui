import React from "react";

type DetailFieldProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

export function DetailField({
  label,
  value,
  className,
  ...rest
}: DetailFieldProps) {
  return (
    <div className={`flex flex-col flex-shrink-0 pr-6 ${className}`} {...rest}>
      <div className="text-sm font-medium text-gray-500 break-all overflow-hidden overflow-ellipsis">
        {label}
      </div>
      <div className="mt-1 text-sm text-gray-900 break-all overflow-hidden overflow-ellipsis">
        {value}
      </div>
    </div>
  );
}
