import React from "react";
import { PanelResult } from "../../../types";
import PanelHeader from "./PanelHeader";

interface PropertiesPanelProps {
  summary: PanelResult;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ summary }) => {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <PanelHeader
        title={summary.name}
        description={summary.description}
        titleClassName="capitalize"
      />
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
