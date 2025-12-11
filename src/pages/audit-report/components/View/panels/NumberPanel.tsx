import React from "react";
import { PanelResult } from "../../../types";
import { formatDisplayValue } from "./utils";
import PanelWrapper from "./PanelWrapper";

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
          <PanelWrapper
            key={`${summary.name}-${rowIndex}`}
            title={label || summary.name}
            description={summary.description}
            titleClassName="capitalize"
          >
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
          </PanelWrapper>
        );
      })}
    </>
  );
};

export default NumberPanel;
