import React from "react";
import { PanelResult } from "../../../types";
import PanelHeader from "./PanelHeader";
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
            <PanelHeader
              title={label || summary.name}
              description={summary.description}
              titleClassName="capitalize"
            />
            <div className="flex flex-1 items-center justify-center">
              <p className="text-6xl font-bold sm:text-6xl md:text-6xl lg:text-6xl">
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
