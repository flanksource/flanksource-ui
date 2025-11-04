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
  TextPanel,
  DurationPanel,
  BarGaugePanel
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
          <div className="min-h-100 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {groupAndRenderPanels(panels)}
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

const groupAndRenderPanels = (panels: PanelResult[]) => {
  const grouped: { [key: string]: PanelResult[] } = {};
  const processedIndices = new Set<number>();

  // Group bargauge panels by their group field
  panels.forEach((panel, index) => {
    if (panel.type === "bargauge" && panel.bargauge?.group) {
      const groupKey = panel.bargauge.group;
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(panel);
      processedIndices.add(index);
    }
  });

  const result: JSX.Element[] = [];
  let panelIndex = 0;

  // Render panels, merging grouped ones
  panels.forEach((panel, originalIndex) => {
    if (processedIndices.has(originalIndex)) {
      const groupKey = panel.bargauge?.group;
      if (groupKey && grouped[groupKey]?.[0] === panel) {
        // First panel in group - merge all panels in this group
        const groupPanels = grouped[groupKey];
        const mergedRows = groupPanels.flatMap((p) =>
          (p.rows || []).map((row) => ({
            ...row,
            _thresholds: p.bargauge?.thresholds
          }))
        );

        const mergedPanel: PanelResult = {
          ...groupPanels[0],
          name: groupKey,
          rows: mergedRows
        };
        const element = renderPanel(mergedPanel, panelIndex++);
        if (element) result.push(element);
      }
      // Skip subsequent panels in the same group
    } else {
      const element = renderPanel(panel, panelIndex++);
      if (element) result.push(element);
    }
  });

  return result;
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
    case "bargauge":
      return <BarGaugePanel key={`${panel.name}-${index}`} summary={panel} />;
    case "text":
      return <TextPanel key={`${panel.name}-${index}`} summary={panel} />;
    case "duration":
      return <DurationPanel key={`${panel.name}-${index}`} summary={panel} />;
    default:
      return null;
  }
};

export default View;
