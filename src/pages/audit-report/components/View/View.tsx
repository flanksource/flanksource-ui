import React, { useMemo } from "react";
import { Box } from "lucide-react";
import DynamicDataTable from "../DynamicDataTable";
import { ViewResult, CombinedViewResult } from "../../types";
import { ViewColumnDropdown } from "../ViewColumnDropdown";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
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
  view: CombinedViewResult;
  showFilter?: boolean;
  dropdownOptionsData?: ViewResult;
  filterFields?: string[];
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
  showFilter = false,
  dropdownOptionsData,
  filterFields = []
}) => {
  const { pageSize } = useReactTablePaginationState();
  const hasDataTable = view.columns && view.columns.length > 0;

  // Extract filterable columns and their unique values from unfiltered data
  const filterableColumns = useMemo(() => {
    const sourceData = dropdownOptionsData || view;

    if (!sourceData.columns) return [];

    return sourceData.columns
      .map((column, index) => {
        if (column.filter?.type !== "multiselect") return null;

        const uniqueValues =
          sourceData.columnOptions?.[column.name]?.sort() || [];

        return { column, columnIndex: index, uniqueValues };
      })
      .filter(Boolean) as Array<{
      column: any;
      columnIndex: number;
      uniqueValues: string[];
    }>;
  }, [view, dropdownOptionsData]);

  return (
    <>
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
      </div>

      {hasDataTable && (
        <>
          {showFilter && (
            <div className="mb-2">
              <FormikFilterForm paramsToReset={[]} filterFields={filterFields}>
                <div className="flex flex-wrap items-center gap-2">
                  {filterableColumns.map(({ column, uniqueValues }) => (
                    <ViewColumnDropdown
                      key={column.name}
                      label={column.name}
                      paramsKey={column.name.toLowerCase()}
                      options={uniqueValues}
                    />
                  ))}
                </div>
              </FormikFilterForm>
            </div>
          )}

          <DynamicDataTable
            columns={view.columns!}
            rows={view.rows || []}
            pageCount={
              view.totalEntries ? Math.ceil(view.totalEntries / pageSize) : 1
            }
            totalRowCount={view.totalEntries}
          />
        </>
      )}
    </>
  );
};

export default View;
