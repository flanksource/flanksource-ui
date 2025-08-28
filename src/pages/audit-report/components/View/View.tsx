import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box } from "lucide-react";
import DynamicDataTable from "../DynamicDataTable";
import { formatDisplayLabel } from "./panels/utils";
import {
  PanelResult,
  ViewColumnDef,
  ViewRow,
  ViewVariable,
  ViewResult
} from "../../types";
import { ViewColumnDropdown } from "../ViewColumnDropdown";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import ViewTableFilterForm from "./ViewTableFilterForm";
import { queryViewTable } from "../../../../api/services/views";
import {
  NumberPanel,
  TablePanel,
  PieChartPanel,
  GaugePanel,
  TextPanel
} from "./panels";
import GlobalFilters from "./GlobalFilters";
import GlobalFiltersForm from "./GlobalFiltersForm";
import { usePrefixedSearchParams } from "../../../../hooks/usePrefixedSearchParams";

interface ViewProps {
  title?: string;
  panels?: PanelResult[];
  namespace?: string;
  name: string;
  columns?: ViewColumnDef[];
  columnOptions?: Record<string, string[]>;
  variables?: ViewVariable[];
  viewResult?: ViewResult;
  currentVariables?: Record<string, string>;
}

const View: React.FC<ViewProps> = ({
  title,
  namespace,
  name,
  columns,
  columnOptions,
  panels,
  variables,
  viewResult,
  currentVariables
}) => {
  const { pageSize } = useReactTablePaginationState();

  // Create unique prefix for this view's table
  const tablePrefix = `view_${namespace}_${name}`;
  const [tableSearchParams] = usePrefixedSearchParams(tablePrefix);

  // Create unique prefix for global filters
  const globalVarPrefix = "viewvar";
  const hasDataTable = columns && columns.length > 0;

  const columnFilterFields = useMemo(
    () =>
      hasDataTable
        ? columns
            .filter((column) => column.filter?.type === "multiselect")
            .map((column) => column.name)
        : [],
    [hasDataTable, columns]
  );

  const filterFields = useMemo(() => {
    // Only include column filters in Formik form, not global filters
    return columnFilterFields;
  }, [columnFilterFields]);

  // Fetch table data with only column filters (no global filters)
  const {
    data: tableResponse,
    isLoading,
    error: tableError
  } = useQuery({
    queryKey: [
      "view-table",
      namespace,
      name,
      tableSearchParams.toString(),
      viewResult?.requestFingerprint
    ],
    queryFn: () =>
      queryViewTable(
        namespace ?? "",
        name ?? "",
        columns ?? [],
        tableSearchParams,
        viewResult?.requestFingerprint || ""
      ),
    enabled: !!namespace && !!name && !!columns && columns.length > 0,
    staleTime: 5 * 60 * 1000
  });

  const rows = (tableResponse?.data as ViewRow[]) || [];
  const totalEntries = tableResponse?.totalEntries;

  // Extract filterable columns and their unique values from unfiltered data
  const filterableColumns = useMemo(() => {
    if (!columns) return [];

    return columns
      .map((column, index) => {
        if (column.filter?.type !== "multiselect") return null;
        const uniqueValues = columnOptions?.[column.name]?.sort() ?? [];
        return { column, columnIndex: index, uniqueValues };
      })
      .filter(Boolean) as Array<{
      column: any;
      columnIndex: number;
      uniqueValues: string[];
    }>;
  }, [columns, columnOptions]);

  return (
    <>
      {title !== "" && (
        <h3 className="mb-4 flex items-center text-xl font-semibold">
          <Box className="mr-2 text-teal-600" size={20} />
          {title}
        </h3>
      )}

      {variables && variables.length > 0 && (
        <GlobalFiltersForm
          variables={variables}
          globalVarPrefix={globalVarPrefix}
          currentVariables={currentVariables}
        >
          <GlobalFilters variables={variables} />
        </GlobalFiltersForm>
      )}

      {variables && variables.length > 0 && (
        <hr className="my-4 border-gray-200" />
      )}

      <div className="mb-4 space-y-6">
        {panels && panels.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {panels.map((panel, index) => renderPanel(panel, index))}
          </div>
        )}
      </div>

      <ViewTableFilterForm
        filterFields={filterFields}
        defaultFieldValues={{}}
        tablePrefix={tablePrefix}
      >
        {hasDataTable && (
          <div className="mb-2">
            <div className="flex flex-wrap items-center gap-2">
              {filterableColumns.map(({ column, uniqueValues }) => (
                <ViewColumnDropdown
                  key={column.name}
                  label={formatDisplayLabel(column.name)}
                  paramsKey={column.name}
                  options={uniqueValues}
                />
              ))}
            </div>
          </div>
        )}
      </ViewTableFilterForm>

      {tableError && (
        <div className="text-center text-red-500">
          <p>
            Error loading table data:{" "}
            {tableError instanceof Error ? tableError.message : "Unknown error"}
          </p>
        </div>
      )}

      {hasDataTable && (
        <DynamicDataTable
          columns={columns}
          isLoading={isLoading}
          rows={rows || []}
          pageCount={totalEntries ? Math.ceil(totalEntries / pageSize) : 1}
          totalRowCount={totalEntries}
          tablePrefix={tablePrefix}
        />
      )}
    </>
  );
};

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

export default View;
