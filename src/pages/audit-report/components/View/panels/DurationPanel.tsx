import React from "react";
import { formatDuration } from "@flanksource-ui/utils/date";
import { PanelResult } from "../../../types";
import PanelWrapper from "./PanelWrapper";

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
          <PanelWrapper
            key={`${summary.name}-${rowIndex}`}
            title={label || summary.name}
            description={summary.description}
            titleClassName="capitalize"
          >
            <div className="flex flex-1 items-center justify-center">
              <p className="text-teal-600 text-2xl font-semibold md:text-3xl lg:text-4xl">
                {formattedDuration}
              </p>
            </div>
          </PanelWrapper>
        );
      })}
    </>
  );
};

export default DurationPanel;
