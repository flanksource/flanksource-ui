import {
  GroupingState,
  OnChangeFn,
  VisibilityState
} from "@tanstack/react-table";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  useMantineReactTable,
  MantineReactTable,
  MRT_TableOptions
} from "mantine-react-table";
import { SortingState } from "@tanstack/react-table";
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

export default function MRTDataTable<T extends Record<string, any> = {}>({
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
    persistToLocalStorage: false,
    paramPrefix: urlParamPrefix,
    defaultPageSize
  });
  const [sortState, setSortState] = useReactTableSortState({
    paramPrefix: urlParamPrefix,
    defaultSorting
  });

  const initialState = {
    ...(expandAllRows ? { expanded: true } : {})
  };

  const rowsPerPageOptions = Array.from(
    new Set(
      [
        defaultPageSize ? defaultPageSize.toString() : undefined,
        "50",
        "100",
        "200"
      ].filter((value): value is string => Boolean(value))
    )
  );

  const options = {
    data: data,
    columns: columns,
    enableGlobalFilter: false,
    enableFilters: false,
    enableHiding: !disableHiding,
    enableExpanding: enableExpanding,
    enableSelectAll: false,
    enableFullScreenToggle: false,
    layoutMode: "grid",
    enableTopToolbar: false,
    enableColumnResizing: true,
    enableStickyHeader: true,
    enableColumnActions: enableColumnActions,
    enableTableFooter: true,
    enableStickyFooter: true,
    // For performance reasons, we set the columnResizeMode to "onEnd" instead
    // of "onChange" to avoid re-rendering the table on every column resize.
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
    onGroupingChange: onGroupingChange,
    enableGrouping,
    // Hide the group by toolbar alert banner
    positionToolbarAlertBanner: "none",
    displayColumnDefOptions: {
      "mrt-row-expand": {
        size: 100,
        ...displayColumnDefOptions?.["mrt-row-expand"]
      },
      ...displayColumnDefOptions
    },
    mantineTableBodyRowProps: ({ row }: { row: MRT_Row<T> }) => ({
      onClick: () => onRowClick(row.original),
      sx: { cursor: "pointer", maxHeight: "100%", overflowY: "auto" },
      ...mantineTableBodyRowProps
    }),
    mantinePaperProps: () => ({
      sx: {
        flex: "1 1 auto",
        display: "flex",
        flexFlow: "column"
      }
    }),
    enablePagination: !disablePagination,
    enableExpandAll: enableGrouping,
    mantineTableContainerProps: {
      sx: {
        flex: "1 1 auto"
      }
    },
    mantineTableBodyCellProps: () => ({
      sx: {
        zIndex: "auto"
      }
    }),
    state: {
      isLoading,
      density: "xs",
      pagination: {
        pageIndex,
        pageSize
      },
      sorting: sortState,
      grouping: groupBy,
      columnVisibility: hiddenColumns.reduce((acc: VisibilityState, column) => {
        acc[column] = false;
        return acc;
      }, {})
    },
    initialState:
      Object.keys(initialState).length > 0 ? initialState : undefined,
    mantinePaginationProps: {
      rowsPerPageOptions
    },
    mantineExpandButtonProps: {
      size: "xs"
    },
    mantineExpandAllButtonProps: {
      size: "xs"
    },
    renderDetailPanel
  } as MRT_TableOptions;

  const table = useMantineReactTable(options);

  return <MantineReactTable table={table} />;
}
