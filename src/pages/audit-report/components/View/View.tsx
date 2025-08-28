import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
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
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { queryViewTable } from "../../../../api/services/views";
import {
  NumberPanel,
  TablePanel,
  PieChartPanel,
  GaugePanel,
  TextPanel
} from "./panels";
import GlobalFilters from "./GlobalFilters";

interface ViewProps {
  title?: string;
  panels?: PanelResult[];
  namespace?: string;
  name: string;
  columns?: ViewColumnDef[];
  columnOptions?: Record<string, string[]>;
  variables?: ViewVariable[];
  viewId?: string;
  onGlobalFilterStateChange?: (filterState: Record<string, string>) => void;
  viewResult?: ViewResult;
  currentGlobalFilters?: Record<string, string>;
}

const View: React.FC<ViewProps> = ({
  title,
  namespace,
  name,
  columns,
  columnOptions,
  panels,
  variables,
  viewId,
  onGlobalFilterStateChange,
  viewResult,
  currentGlobalFilters
}) => {
  const { pageSize } = useReactTablePaginationState();
  const [searchParams] = useSearchParams();
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

  const defaultFilterValues = useMemo(() => {
    // No defaults needed since global filters are handled separately
    return {};
  }, []);

  // Use only column filters for table data, not global filters
  const tableSearchParams = searchParams;

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

      <GlobalFilters
        filters={variables}
        viewId={viewId || ""}
        namespace={namespace}
        name={name}
        onFilterStateChange={onGlobalFilterStateChange}
      />

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

      <FormikFilterForm
        paramsToReset={[]}
        filterFields={filterFields}
        defaultFieldValues={defaultFilterValues}
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
      </FormikFilterForm>

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
