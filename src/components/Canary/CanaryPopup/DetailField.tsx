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
    <div className={`flex flex-shrink-0 flex-col pr-6 ${className}`} {...rest}>
      <div className="overflow-hidden overflow-ellipsis break-all text-sm font-medium text-gray-500">
        {label}
      </div>
      <div className="mt-1 overflow-hidden overflow-ellipsis break-all text-sm text-gray-900">
        {value}
      </div>
    </div>
  );
}
