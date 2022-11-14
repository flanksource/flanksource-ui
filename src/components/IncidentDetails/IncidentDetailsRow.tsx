import React from "react";
import clsx from "clsx";

interface IProps {
  title: string;
  value: React.ReactNode;
  className: string;
}

export const IncidentDetailsRow = ({ title, value, className }: IProps) => (
  <div className={clsx("grid grid-cols-1-to-2 gap-6 items-center", className)}>
    <div>
      <h6 className="text-gray-500">{title}</h6>
    </div>
    <div className="font-medium text-gray-500">{value}</div>
  </div>
);
