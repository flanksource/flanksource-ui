import React from "react";
import { PanelResult } from "../../../types";
import PanelHeader from "./PanelHeader";

interface TextPanelProps {
  summary: PanelResult;
}

const TextPanel: React.FC<TextPanelProps> = ({ summary }) => {
  return (
    <div>
      {summary.rows?.map((row, rowIndex) => {
        const { value } = row;

        return (
          <div
            key={`${summary.name}-${rowIndex}`}
            className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4"
          >
            <PanelHeader
              title={summary.name}
              description={summary.description}
              titleClassName="capitalize"
            />
            <div className="overflow-hidden text-sm font-medium text-gray-800">
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TextPanel;
