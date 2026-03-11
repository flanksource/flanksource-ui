import React from "react";
import { PanelResult } from "../../../types";
import PanelHeader from "./PanelHeader";

interface TablePanelProps {
  summary: PanelResult;
}

const TablePanel: React.FC<TablePanelProps> = React.memo(({ summary }) => {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <PanelHeader
        title={summary.name}
        description={summary.description}
        titleClassName="capitalize"
      />
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
});

export default TablePanel;
