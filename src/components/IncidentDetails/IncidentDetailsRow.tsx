import React from "react";
import clsx from "clsx";

interface IProps {
  title: string;
  value: React.ReactNode;
  className?: string;
}

export const IncidentDetailsRow = ({ title, value, className }: IProps) => (
  <div className={clsx("flex flex-col space-y-1", className)}>
    <div>
      <h6 className="text-sm text-gray-500">{title}</h6>
    </div>
    <div className="text-sm text-gray-500">{value}</div>
  </div>
);
