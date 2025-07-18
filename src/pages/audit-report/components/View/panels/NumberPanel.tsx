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
    <div>
      {summary.rows?.map((row, rowIndex) => {
        const { value } = row;

        return (
          <div
            key={`${summary.name}-${rowIndex}`}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <h4 className="mb-2 text-sm font-medium capitalize text-gray-600">
              {summary.name}
            </h4>
            {summary.description && (
              <p className="mb-3 text-xs text-gray-500">
                {summary.description}
              </p>
            )}
            <p className="text-2xl font-semibold text-teal-600">
              {summary.number
                ? Number(value).toFixed(summary.number.precision)
                : value}
              {summary.number?.unit && (
                <span className="ml-1 text-lg font-normal text-gray-500">
                  {summary.number.unit}
                </span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default NumberPanel;
