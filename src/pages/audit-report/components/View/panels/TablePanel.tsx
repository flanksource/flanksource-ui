import React from "react";
import { PanelResult } from "../../../types";
import PanelWrapper from "./PanelWrapper";

interface TablePanelProps {
  summary: PanelResult;
}

const TablePanel: React.FC<TablePanelProps> = ({ summary }) => {
  return (
    <PanelWrapper
      title={summary.name}
      description={summary.description}
      titleClassName="capitalize"
    >
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
    </PanelWrapper>
  );
};

export default TablePanel;
