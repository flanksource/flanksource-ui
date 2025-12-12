import React from "react";
import { PanelResult } from "../../../types";
import PanelWrapper from "./PanelWrapper";

interface TextPanelProps {
  summary: PanelResult;
}

const TextPanel: React.FC<TextPanelProps> = ({ summary }) => {
  return (
    <div>
      {summary.rows?.map((row, rowIndex) => {
        const { value } = row;

        return (
          <PanelWrapper
            key={`${summary.name}-${rowIndex}`}
            title={summary.name}
            description={summary.description}
            titleClassName="capitalize"
          >
            <div className="overflow-hidden text-sm font-medium text-gray-800">
              {value}
            </div>
          </PanelWrapper>
        );
      })}
    </div>
  );
};

export default TextPanel;
