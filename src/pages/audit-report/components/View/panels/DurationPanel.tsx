import React from "react";
import { formatDuration } from "@flanksource-ui/utils/date";
import { PanelResult } from "../../../types";

interface DurationPanelProps {
  summary: PanelResult;
}

const DurationPanel: React.FC<DurationPanelProps> = ({ summary }) => {
  if (!summary.rows || summary.rows.length === 0) {
    return null;
  }

  return (
    <>
      {summary.rows.map((row, rowIndex) => {
        const { value, label } = row;

        // NOTE: The value is expected to be in nanoseconds
        const nanoseconds = Number(value);
        const milliseconds = nanoseconds / 1000000;
        const formattedDuration = formatDuration(milliseconds);

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
              <p className="text-teal-600 text-2xl font-semibold md:text-3xl lg:text-4xl">
                {formattedDuration}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DurationPanel;
