import React from "react";

export function DetailField({ label, value, className, ...rest }) {
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
