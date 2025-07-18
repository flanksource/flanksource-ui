import React from "react";
import { Box } from "lucide-react";
import DynamicDataTable from "../DynamicDataTable";
import { ViewResult } from "../../types";
import {
  NumberPanel,
  TablePanel,
  PieChartPanel,
  GaugePanel,
  TextPanel
} from "./panels";

interface ViewProps {
  title: string;
  icon?: string;
  view: ViewResult;
}

const View: React.FC<ViewProps> = ({ title, icon, view }) => {
  const pieChartSummaries =
    view.panels?.filter((summary) => summary.type === "piechart") || [];
  const numberSummaries =
    view.panels?.filter((summary) => summary.type === "number") || [];
  const tableSummaries =
    view.panels?.filter((summary) => summary.type === "table") || [];
  const gaugeSummaries =
    view.panels?.filter((summary) => summary.type === "gauge") || [];
  const textSummaries =
    view.panels?.filter((summary) => summary.type === "text") || [];

  return (
    <div>
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <Box className="mr-2 text-teal-600" size={20} />
        {title}
      </h3>
      <div className="space-y-6">
        {(numberSummaries.length > 0 ||
          tableSummaries.length > 0 ||
          pieChartSummaries.length > 0 ||
          gaugeSummaries.length > 0 ||
          textSummaries.length > 0) && (
          <div className="grid grid-cols-1 justify-items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            {numberSummaries.map((summary, index) => (
              <NumberPanel key={`${summary.name}-${index}`} summary={summary} />
            ))}

            {tableSummaries.map((summary, index) => (
              <TablePanel key={`${summary.name}-${index}`} summary={summary} />
            ))}

            {pieChartSummaries.map((summary, index) => (
              <PieChartPanel
                key={`${summary.name}-${index}`}
                summary={summary}
              />
            ))}

            {gaugeSummaries.map((summary, index) => (
              <GaugePanel key={`${summary.name}-${index}`} summary={summary} />
            ))}

            {textSummaries.map((summary, index) => (
              <TextPanel key={`${summary.name}-${index}`} summary={summary} />
            ))}
          </div>
        )}

        {view.rows && view.columns && (
          <DynamicDataTable columns={view.columns} rows={view.rows} />
        )}
      </div>
    </div>
  );
};

export default View;
