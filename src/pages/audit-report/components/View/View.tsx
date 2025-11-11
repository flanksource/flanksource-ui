import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Table2, LayoutGrid } from "lucide-react";
import { useSearchParams } from "react-router-dom";
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
  TextPanel,
  DurationPanel
} from "./panels";
import GlobalFilters from "./GlobalFilters";
import GlobalFiltersForm from "./GlobalFiltersForm";
import { usePrefixedSearchParams } from "../../../../hooks/usePrefixedSearchParams";
import ViewCardsDisplay from "./ViewCardsDisplay";

interface ViewProps {
  title?: string;
  panels?: PanelResult[];
  namespace?: string;
  name: string;
  columns?: ViewColumnDef[];
  columnOptions?: Record<string, string[]>;
  variables?: ViewVariable[];
  requestFingerprint: string;
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
  requestFingerprint,
  currentVariables
}) => {
  const { pageSize } = useReactTablePaginationState();

  // Create unique prefix for this view's table
  const tablePrefix = `view_${namespace}_${name}`;
  const [tableSearchParams] = usePrefixedSearchParams(tablePrefix);

  // Separate display mode state (frontend only, not sent to backend)
  const [searchParams, setSearchParams] = useSearchParams();

  // Create unique prefix for global filters
  const globalVarPrefix = "viewvar";
  const hasDataTable = columns && columns.length > 0;

  // Detect if card mode is available
  const hasCardMode = useMemo(() => {
    return columns?.some((col) => col.card?.enabled) ?? false;
  }, [columns]);

  // Get display mode from URL params (default to table)
  // Using unprefixed param since this is purely frontend UI state
  const displayMode =
    (searchParams.get("display") as "table" | "cards") || "table";

  const setDisplayMode = (mode: "table" | "cards") => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("display", mode);
      return newParams;
    });
  };

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
      requestFingerprint
    ],
    queryFn: () =>
      queryViewTable(
        namespace ?? "",
        name ?? "",
        columns ?? [],
        tableSearchParams,
        requestFingerprint
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
          <Box className="text-teal-600 mr-2" size={20} />
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
          <div className="min-h-100 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="flex flex-wrap items-center justify-between gap-2">
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

              {/* Display Mode Toggle */}
              {hasCardMode && (
                <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1">
                  <button
                    onClick={() => setDisplayMode("table")}
                    className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                      displayMode === "table"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title="Table view"
                  >
                    <Table2 size={16} />
                    Table
                  </button>
                  <button
                    onClick={() => setDisplayMode("cards")}
                    className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                      displayMode === "cards"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title="Card view"
                  >
                    <LayoutGrid size={16} />
                    Cards
                  </button>
                </div>
              )}
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

      {hasDataTable &&
        (displayMode === "cards" && hasCardMode ? (
          <ViewCardsDisplay
            columns={columns}
            isLoading={isLoading}
            rows={rows || []}
            pageCount={totalEntries ? Math.ceil(totalEntries / pageSize) : 1}
            totalRowCount={totalEntries}
          />
        ) : (
          <DynamicDataTable
            columns={columns}
            isLoading={isLoading}
            rows={rows || []}
            pageCount={totalEntries ? Math.ceil(totalEntries / pageSize) : 1}
            totalRowCount={totalEntries}
            tablePrefix={tablePrefix}
          />
        ))}
    </>
  );
};

const renderPanel = (panel: PanelResult, index: number) => {
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
    case "duration":
      return <DurationPanel key={`${panel.name}-${index}`} summary={panel} />;
    default:
      return null;
  }
};

export default View;
