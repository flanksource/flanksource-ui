import React from "react";
import { PanelResult } from "../../../types";

interface NumberPanelProps {
  summary: PanelResult;
}

const NumberPanel: React.FC<NumberPanelProps> = ({ summary }) => {
  if (!summary.rows || summary.rows.length === 0) {
    return null;
  }

  return (
    <>
      {summary.rows.map((row, rowIndex) => {
        const { value, label } = row;

        return (
          <div
            key={`${summary.name}-${rowIndex}`}
            className="flex w-full flex-col rounded-lg border border-gray-200 bg-white p-4"
          >
            <h4 className="mb-2 text-sm font-medium capitalize text-gray-600">
              {label || summary.name}
            </h4>
            {summary.description && (
              <p className="mb-3 text-xs text-gray-500">
                {summary.description}
              </p>
            )}
            <div className="flex flex-1 items-center justify-center">
              <p className="text-6xl font-semibold text-teal-600">
                {summary.number
                  ? Number(value).toFixed(summary.number.precision || 0)
                  : value}
                {summary.number?.unit && (
                  <span className="ml-2 text-2xl font-normal text-gray-500">
                    {summary.number.unit}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default NumberPanel;
