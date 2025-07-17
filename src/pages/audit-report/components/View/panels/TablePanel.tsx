import React from "react";
import { PanelResult } from "../../../types";

interface TablePanelProps {
  summary: PanelResult;
}

const TablePanel: React.FC<TablePanelProps> = ({ summary }) => {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h4 className="mb-2 text-sm font-medium text-gray-600">{summary.name}</h4>
      <div className="space-y-2">
        {summary.rows?.map((row, rowIndex) => {
          const { value, ...rest } = row;
          const labelKey = Object.keys(rest)[0];
          const labelValue = rest[labelKey];

          return (
            <div key={rowIndex} className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
                {labelValue}
              </span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablePanel;
