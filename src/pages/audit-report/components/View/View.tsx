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

const renderPanel = (panel: any, index: number) => {
  switch (panel.type) {
    case "number":
      return <NumberPanel key={`${panel.name}-${index}`} summary={panel} />;
    case "table":
      return <TablePanel key={`${panel.name}-${index}`} summary={panel} />;
    case "piechart":
      return <PieChartPanel key={`${panel.name}-${index}`} summary={panel} />;
    case "gauge":
      return <GaugePanel key={`${panel.name}-${index}`} summary={panel} />;
    case "text":
      return <TextPanel key={`${panel.name}-${index}`} summary={panel} />;
    default:
      return null;
  }
};

const View: React.FC<ViewProps> = ({ title, icon, view }) => {
  return (
    <div>
      {title !== "" && (
        <h3 className="mb-4 flex items-center text-xl font-semibold">
          <Box className="mr-2 text-teal-600" size={20} />
          {title}
        </h3>
      )}

      <div className="space-y-6">
        {view.panels && view.panels.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {view.panels.map((panel, index) => renderPanel(panel, index))}
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
