import React, { useMemo } from "react";
import { Box } from "lucide-react";
import DynamicDataTable from "../DynamicDataTable";
import { ViewResult } from "../../types";
import FormikSearchInputClearable from "@flanksource-ui/components/Forms/Formik/FormikSearchInputClearable";
import { ViewColumnDropdown } from "../ViewColumnDropdown";
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
  showSearch?: boolean;
  dropdownOptionsData?: ViewResult; // Unfiltered data for dropdown options
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

const View: React.FC<ViewProps> = ({
  title,
  icon,
  view,
  showSearch = false,
  dropdownOptionsData
}) => {
  const hasDataTable = view.columns && view.columns.length > 0;

  // Extract filterable columns and their unique values from unfiltered data
  const filterableColumns = useMemo(() => {
    const sourceData = dropdownOptionsData || view;

    if (!sourceData.columns || !sourceData.rows) return [];

    return sourceData.columns
      .map((column, index) => {
        if (column.filter?.type !== "multiselect") return null;

        const uniqueValues = [
          ...new Set(
            sourceData
              .rows!.map((row) => row[index])
              .filter((value) => value != null && value !== "")
              .map(String)
          )
        ].sort();

        return { column, columnIndex: index, uniqueValues };
      })
      .filter(Boolean) as Array<{
      column: any;
      columnIndex: number;
      uniqueValues: string[];
    }>;
  }, [view, dropdownOptionsData]);

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

        {hasDataTable && (
          <div className="space-y-4">
            {showSearch && (
              <div className="flex flex-wrap items-center gap-2">
                <FormikSearchInputClearable
                  name="filter"
                  placeholder="Filter results..."
                  className="w-80"
                />

                {filterableColumns.map(({ column, uniqueValues }) => (
                  <ViewColumnDropdown
                    key={column.name}
                    label={column.name}
                    paramsKey={column.name.toLowerCase()}
                    options={uniqueValues}
                  />
                ))}
              </div>
            )}

            <DynamicDataTable columns={view.columns!} rows={view.rows || []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default View;
