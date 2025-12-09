import React from "react";
import { PanelResult } from "../../../types";
import { formatDisplayValue } from "./utils";

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
        const { value, count, label } = row;
        const displayValue = value ?? count;
        const numericValue = Number(displayValue);

        return (
          <div
            key={`${summary.name}-${rowIndex}`}
            className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4"
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
              <p className="font-bold lg:text-6xl">
                {summary.number
                  ? formatDisplayValue(
                      numericValue,
                      summary.number.unit,
                      summary.number.precision
                    )
                  : displayValue}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default NumberPanel;
