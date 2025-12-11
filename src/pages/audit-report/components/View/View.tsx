import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Table2, LayoutGrid } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DynamicDataTable from "../DynamicDataTable";
import { formatDisplayLabel } from "./panels/utils";
import {
  ColumnFilterOptions,
  DisplayTable,
  PanelResult,
  ViewColumnDef,
  ViewRow,
  ViewVariable
} from "../../types";
import { ViewColumnDropdown } from "../ViewColumnDropdown";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import ViewTableFilterForm from "./ViewTableFilterForm";
import { queryViewTable } from "../../../../api/services/views";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  NumberPanel,
  TablePanel,
  PieChartPanel,
  GaugePanel,
  TextPanel,
  DurationPanel,
  BarGaugePanel,
  PropertiesPanel,
  PlaybooksPanel
} from "./panels";
import GlobalFilters from "./GlobalFilters";
import GlobalFiltersForm from "./GlobalFiltersForm";
import { usePrefixedSearchParams } from "../../../../hooks/usePrefixedSearchParams";
import ViewCardsDisplay from "./ViewCardsDisplay";
import { VIEW_VAR_PREFIX } from "@flanksource-ui/pages/views/constants";

interface ViewProps {
  title?: string;
  panels?: PanelResult[];
  namespace?: string;
  name: string;
  columns?: ViewColumnDef[];
  columnOptions?: Record<string, ColumnFilterOptions>;
  table?: DisplayTable;
  variables?: ViewVariable[];
  card?: {
    columns: number;
    default?: boolean;
  };
  requestFingerprint: string;
  currentVariables?: Record<string, string>;
  hideVariables?: boolean;
}

const View: React.FC<ViewProps> = ({
  title,
  namespace,
  name,
  columns,
  columnOptions,
  panels,
  table,
  variables,
  card,
  requestFingerprint,
  currentVariables,
  hideVariables
}) => {
  const tablePrefix = `view_${namespace}_${name}`;

  const defaultPageSize = table?.size;

  const defaultSorting = useMemo(() => {
    const sort = table?.sort?.trim();
    if (!sort) {
      return undefined;
    }

    const desc = sort.startsWith("-");
    const id = sort.replace(/^[-+]/, "");

    if (!id) {
      return undefined;
    }

    return [
      {
        id,
        desc
      }
    ];
  }, [table?.sort]);

  const { pageSize } = useReactTablePaginationState({
    paramPrefix: tablePrefix,
    defaultPageSize: defaultPageSize
  });

  // Create unique prefix for this view's table
  const [tableSearchParams, setTableSearchParams] = usePrefixedSearchParams(
    tablePrefix,
    false
  );

  // Separate display mode state (frontend only, not sent to backend)
  const [searchParams, setSearchParams] = useSearchParams();

  // Create unique prefix for global filters (same as ViewSection uses)
  const globalVarPrefix = VIEW_VAR_PREFIX;
  const hasDataTable = columns && columns.length > 0;

  // Detect if card mode is available (supports both new and old cardPosition field)
  const hasCardMode = useMemo(() => {
    return (
      columns?.some((col) => col.card != null || col.cardPosition != null) ??
      false
    );
  }, [columns]);

  // Determine default display mode: use spec default if available, otherwise "table"
  const defaultDisplayMode =
    panels && panels.length > 0
      ? "table"
      : card?.default && hasCardMode
        ? "cards"
        : "table";

  // Get display mode from URL params (default based on spec)
  // Using unprefixed param since this is purely frontend UI state
  const displayMode =
    (searchParams.get("display") as "table" | "cards") || defaultDisplayMode;

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

  useEffect(() => {
    setTableSearchParams((current) => {
      const updated = new URLSearchParams(current);
      let changed = false;

      if (defaultPageSize && defaultPageSize > 0 && !updated.get("pageSize")) {
        updated.set("pageSize", defaultPageSize.toString());
        changed = true;
      }

      if (!updated.get("pageIndex")) {
        updated.set("pageIndex", "0");
        changed = true;
      }

      if (
        defaultSorting &&
        defaultSorting.length > 0 &&
        !updated.get("sortBy")
      ) {
        const sort = defaultSorting[0];
        updated.set("sortBy", sort.id);
        updated.set("sortOrder", sort.desc ? "desc" : "asc");
        changed = true;
      }

      return changed ? updated : current;
    });
  }, [defaultPageSize, defaultSorting, setTableSearchParams]);

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
        const options = columnOptions?.[column.name];
        return { column, columnIndex: index, options };
      })
      .filter(Boolean) as Array<{
      column: ViewColumnDef;
      columnIndex: number;
      options?: ColumnFilterOptions;
    }>;
  }, [columns, columnOptions]);

  return (
    <>
      <div className="flex-none">
        {title !== "" && (
          <h3 className="mb-4 flex items-center text-xl font-semibold">
            <Box className="text-teal-600 mr-2" size={20} />
            {title}
          </h3>
        )}

        {!hideVariables && variables && variables.length > 0 && (
          <GlobalFiltersForm
            variables={variables}
            globalVarPrefix={globalVarPrefix}
            currentVariables={currentVariables}
          >
            <GlobalFilters variables={variables} />
          </GlobalFiltersForm>
        )}

        {!hideVariables && variables && variables.length > 0 && (
          <hr className="my-4 border-gray-200" />
        )}

        <div className="mb-4 space-y-6">
          {panels && panels.length > 0 && (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gridAutoRows: "minmax(auto, 250px)"
              }}
            >
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {filterableColumns.map(({ column, options }) => (
                    <ViewColumnDropdown
                      key={column.name}
                      label={formatDisplayLabel(column.name)}
                      paramsKey={column.name}
                      options={options}
                      isLabelsColumn={column.type === "labels"}
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
      </div>

      {tableError && (
        <div className="mb-4">
          <ErrorViewer error={tableError} className="max-w-4xl" />
        </div>
      )}

      {hasDataTable &&
        (displayMode === "cards" && hasCardMode ? (
          <ViewCardsDisplay
            columns={columns}
            columnsCount={card?.columns}
            isLoading={isLoading}
            rows={rows || []}
            pageCount={totalEntries ? Math.ceil(totalEntries / pageSize) : 1}
            totalRowCount={totalEntries}
          />
        ) : (
          <div className="min-h-0 flex-1">
            <DynamicDataTable
              columns={columns}
              isLoading={isLoading}
              rows={rows || []}
              pageCount={totalEntries ? Math.ceil(totalEntries / pageSize) : 1}
              totalRowCount={totalEntries}
              tablePrefix={tablePrefix}
              defaultPageSize={defaultPageSize}
              defaultSorting={defaultSorting}
            />
          </div>
        ))}
    </>
  );
};

/**
 * Groups bargauge panels by their group field and merges their rows.
 * Each row preserves its source panel's full bargauge config via _bargauge field.
 */
export const groupPanels = (panels: PanelResult[]): PanelResult[] => {
  const panelsByGroup: { [key: string]: PanelResult[] } = {};
  const groupedIndices = new Set<number>();

  panels.forEach((panel, index) => {
    if (panel.type === "bargauge" && panel.bargauge?.group) {
      const group = panel.bargauge.group;
      if (!panelsByGroup[group]) {
        panelsByGroup[group] = [];
      }
      panelsByGroup[group].push(panel);
      groupedIndices.add(index);
    }
  });

  const result: PanelResult[] = [];

  panels.forEach((panel, index) => {
    if (!groupedIndices.has(index)) {
      result.push(panel);
      return;
    }

    const group = panel.bargauge?.group;
    const isFirstInGroup = group && panelsByGroup[group]?.[0] === panel;

    if (isFirstInGroup) {
      const panelsInGroup = panelsByGroup[group!];
      const mergedRows = panelsInGroup.flatMap((p) =>
        (p.rows || []).map((row) => ({
          ...row,
          _bargauge: p.bargauge
        }))
      );

      result.push({
        ...panelsInGroup[0],
        name: group!,
        rows: mergedRows
      });
    }
  });

  return result;
};

const groupAndRenderPanels = (panels: PanelResult[]) => {
  const groupedPanels = groupPanels(panels);
  return groupedPanels.map((panel, index) => renderPanel(panel, index));
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
    case "properties":
      return <PropertiesPanel key={`${panel.name}-${index}`} summary={panel} />;
    case "playbooks":
      return <PlaybooksPanel key={`${panel.name}-${index}`} summary={panel} />;
    default:
      return null;
  }
};

export default View;
