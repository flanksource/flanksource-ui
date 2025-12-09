import React from "react";
import { PanelResult } from "../../../types";

interface TablePanelProps {
  summary: PanelResult;
}

const TablePanel: React.FC<TablePanelProps> = ({ summary }) => {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-2 text-sm font-medium capitalize text-gray-600">
        {summary.name}
      </h4>
      {summary.description && (
        <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
      )}
      <div className="flex-1 overflow-y-auto">
        {summary.rows?.map((row, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className="flex items-center justify-between py-1"
            >
              {Object.keys(row).map((key) => {
                return (
                  <span key={key} className="text-sm text-gray-500">
                    {row[key]}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablePanel;
