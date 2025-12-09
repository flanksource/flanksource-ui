import React from "react";
import { PanelResult } from "../../../types";

interface PropertiesPanelProps {
  summary: PanelResult;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ summary }) => {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-2 text-sm font-medium capitalize text-gray-600">
        {summary.name}
      </h4>
      {summary.description && (
        <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
      )}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {summary.rows?.map((row, rowIndex) => {
          const { value, ...rest } = row;
          const labelKey = Object.keys(rest)[0];
          const labelValue = rest[labelKey];

          return (
            <div key={rowIndex} className="flex flex-col">
              <span className="text-sm font-bold text-gray-700">
                {labelValue}
              </span>
              <span className="text-sm text-gray-600">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertiesPanel;
