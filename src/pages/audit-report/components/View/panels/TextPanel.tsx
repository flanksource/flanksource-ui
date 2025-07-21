import React from "react";
import { PanelResult } from "../../../types";

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
            <div className="text-sm text-gray-800">{value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TextPanel;
