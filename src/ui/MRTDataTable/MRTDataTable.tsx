import { memo, useCallback, useMemo } from "react";
import {
  GroupingState,
  OnChangeFn,
  SortingState,
  VisibilityState
} from "@tanstack/react-table";
import { LoadingOverlay } from "@mantine/core";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  useMantineReactTable,
  MantineReactTable,
  MRT_TableOptions
} from "mantine-react-table";
import useReactTablePaginationState from "../DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "../DataTable/Hooks/useReactTableSortState";

type MRTDataTableProps<T extends Record<string, any> = {}> = {
  data: T[];
  enableExpanding?: boolean;
  columns: MRT_ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  disablePagination?: boolean;
  enableColumnActions?: boolean;
  enableServerSideSorting?: boolean;
  enableServerSidePagination?: boolean;
  manualPageCount?: number;
  hiddenColumns?: string[];
  /**
   * The total number of rows in the dataset. This is used for server-side
   * pagination to determine the total number of pages.
   */
  totalRowCount?: number;
  renderDetailPanel?: (props: {
    row: MRT_Row<T>;
    table: MRT_TableInstance<T>;
  }) => React.ReactNode;
  groupBy?: string[];
  expandAllRows?: boolean;
  enableGrouping?: boolean;
  onGroupingChange?: OnChangeFn<GroupingState>;
  disableHiding?: boolean;
  mantineTableBodyRowProps?: {
    style?: Record<string, any>;
  };
  displayColumnDefOptions?: {
    "mrt-row-expand"?: Partial<MRT_ColumnDef<T>>;
  };
  /** Prefix to namespace URL search params for sorting/pagination */
  urlParamPrefix?: string;
  /** Default page size for pagination (overrides persisted default when set) */
  defaultPageSize?: number;
  /** Default sorting to seed when no sort is present */
  defaultSorting?: SortingState;
};

function MRTDataTableInner<T extends Record<string, any> = {}>({
  data,
  columns,
  onRowClick = () => {},
  isLoading = false,
  disablePagination = false,
  enableServerSideSorting = false,
  enableServerSidePagination = false,
  enableGrouping = false,
  enableColumnActions = true,
  manualPageCount,
  totalRowCount,
  hiddenColumns = [],
  renderDetailPanel,
  groupBy = [],
  expandAllRows = false,
  enableExpanding = false,
  onGroupingChange = () => {},
  disableHiding = false,
  mantineTableBodyRowProps,
  displayColumnDefOptions,
  urlParamPrefix,
  defaultPageSize,
  defaultSorting
}: MRTDataTableProps<T>) {
  const { pageIndex, pageSize, setPageIndex } = useReactTablePaginationState({
    paramPrefix: urlParamPrefix,
    defaultPageSize
  });
  const [sortState, setSortState] = useReactTableSortState({
    paramPrefix: urlParamPrefix,
    defaultSorting
  });

  const initialState = useMemo(
    () => (expandAllRows ? { expanded: true } : undefined),
    [expandAllRows]
  );

  const rowsPerPageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          [
            defaultPageSize ? defaultPageSize.toString() : undefined,
            "50",
            "100",
            "200"
          ].filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)),
    [defaultPageSize]
  );

  const columnVisibility = useMemo(
    () =>
      hiddenColumns.reduce((acc: VisibilityState, column) => {
        acc[column] = false;
        return acc;
      }, {}),
    [hiddenColumns]
  );

  const mergedDisplayColumnDefOptions = useMemo(
    () => ({
      ...displayColumnDefOptions,
      "mrt-row-expand": {
        size: 100,
        ...displayColumnDefOptions?.["mrt-row-expand"]
      }
    }),
    [displayColumnDefOptions]
  );

  const tableBodyRowProps = useCallback(
    ({ row }: { row: MRT_Row<T> }) => ({
      onClick: () => onRowClick(row.original),
      sx: { cursor: "pointer", maxHeight: "100%", overflowY: "auto" },
      ...mantineTableBodyRowProps
    }),
    [mantineTableBodyRowProps, onRowClick]
  );

  const options = useMemo(
    () =>
      ({
        data,
        columns,
        enableGlobalFilter: false,
        enableFilters: false,
        enableHiding: !disableHiding,
        enableExpanding,
        enableSelectAll: false,
        enableFullScreenToggle: false,
        layoutMode: "grid",
        enableTopToolbar: false,
        enableColumnResizing: true,
        enableStickyHeader: true,
        enableColumnActions,
        enableTableFooter: true,
        enableStickyFooter: true,
        // For performance reasons, we set the columnResizeMode to "onEnd"
        // instead of "onChange" to avoid re-rendering the table on every
        // column resize.
        columnResizeMode: "onEnd",
        enableDensityToggle: false,
        enableSorting: true,
        enableColumnOrdering: false,
        enableColumnDragging: false,
        manualSorting: enableServerSideSorting,
        manualPagination: enableServerSidePagination,
        pageCount: manualPageCount,
        rowCount: totalRowCount,
        autoResetPageIndex: false,
        onPaginationChange: setPageIndex,
        onSortingChange: setSortState,
        onGroupingChange,
        enableGrouping,
        // Hide the group by toolbar alert banner
        positionToolbarAlertBanner: "none",
        displayColumnDefOptions: mergedDisplayColumnDefOptions,
        mantineTableBodyRowProps: tableBodyRowProps,
        mantinePaperProps: {
          sx: {
            flex: "1 1 auto",
            display: "flex",
            flexFlow: "column"
          }
        },
        enablePagination: !disablePagination,
        enableExpandAll: enableGrouping,
        mantineTableContainerProps: {
          sx: { flex: "1 1 auto" }
        },
        mantineTableBodyCellProps: {
          sx: { zIndex: "auto" }
        },
        // Use cell-level memoization so that individual cells only re-render
        // when their cell reference changes, not on every table state update.
        // This prevents O(rows × cols) re-renders of Mantine Box/Skeleton
        // components on state changes like sorting or pagination.
        memoMode: "cells",
        state: {
          showSkeletons: false,
          density: "xs",
          pagination: {
            pageIndex,
            pageSize
          },
          sorting: sortState,
          grouping: groupBy,
          columnVisibility
        },
        initialState,
        mantinePaginationProps: {
          rowsPerPageOptions
        },
        mantineExpandButtonProps: { size: "xs" as const },
        mantineExpandAllButtonProps: { size: "xs" as const },
        renderDetailPanel
      }) as MRT_TableOptions<T>,
    [
      data,
      columns,
      disableHiding,
      enableExpanding,
      enableColumnActions,
      enableServerSideSorting,
      enableServerSidePagination,
      manualPageCount,
      totalRowCount,
      setPageIndex,
      setSortState,
      onGroupingChange,
      enableGrouping,
      mergedDisplayColumnDefOptions,
      tableBodyRowProps,
      disablePagination,
      pageIndex,
      pageSize,
      sortState,
      groupBy,
      columnVisibility,
      initialState,
      rowsPerPageOptions,
      renderDetailPanel
    ]
  );

  const table = useMantineReactTable(options);

  return (
    <div style={{ position: "relative" }}>
      <MantineReactTable table={table} />

      <LoadingOverlay
        keepMounted
        visible={isLoading}
        transitionDuration={120}
        exitTransitionDuration={80}
        overlayOpacity={0.15}
        overlayBlur={1}
        zIndex={200}
      />
    </div>
  );
}

// Wrap in React.memo to prevent re-renders from ancestor context changes
// (e.g. HealthPageContext, ConfigPageContext) that don't affect this component.
const MRTDataTable = memo(MRTDataTableInner) as typeof MRTDataTableInner;
export default MRTDataTable;
