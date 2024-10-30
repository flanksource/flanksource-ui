import {
  GroupingState,
  OnChangeFn,
  VisibilityState
} from "@tanstack/react-table";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  useMantineReactTable
} from "mantine-react-table";
import useReactTablePaginationState from "../DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "../DataTable/Hooks/useReactTableSortState";

type MRTDataTableProps<T extends Record<string, any> = {}> = {
  data: T[];
  columns: MRT_ColumnDef<T>[];
  onRowClick: (row: T) => void;
  isLoading?: boolean;
  disablePagination?: boolean;
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
  manualGrouping?: boolean;
  defaultSortBy?: string;
};

export default function MRTDataTable<T extends Record<string, any> = {}>({
  data,
  columns,
  onRowClick = () => {},
  isLoading = false,
  disablePagination = false,
  enableServerSideSorting = undefined,
  enableServerSidePagination = false,
  enableGrouping = false,
  manualPageCount,
  totalRowCount,
  hiddenColumns = [],
  renderDetailPanel,
  groupBy = [],
  expandAllRows = false,
  onGroupingChange = () => {},
  disableHiding = false,
  manualGrouping = false,
  defaultSortBy
}: MRTDataTableProps<T>) {
  const { pageIndex, pageSize, setPageIndex } = useReactTablePaginationState();
  const [sortState, setSortState] = useReactTableSortState(
    undefined,
    undefined,
    defaultSortBy
  );

  const table = useMantineReactTable({
    data: data,
    columns: columns,
    enableGlobalFilter: false,
    enableFilters: false,
    enableHiding: !disableHiding,
    enableSelectAll: false,
    enableFullScreenToggle: false,
    layoutMode: "grid",
    enableColumnResizing: true,
    enableStickyHeader: true,
    enableTableFooter: true,
    enableStickyFooter: true,
    // For performance reasons, we set the columnResizeMode to "onEnd" instead
    // of "onChange" to avoid re-rendering the table on every column resize.
    columnResizeMode: "onEnd",
    enableDensityToggle: false,
    enableSorting: true,
    enableColumnOrdering: false,
    enableColumnDragging: false,
    manualGrouping,
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
    mantineTableBodyRowProps: ({ row }: { row: MRT_Row<T> }) => ({
      onClick: () => onRowClick(row.original),
      sx: { cursor: "pointer", maxHeight: "100%", overflowY: "auto" }
    }),
    mantinePaperProps: () => ({
      sx: {
        flex: "1 1 0",
        display: "flex",
        flexFlow: "column"
      }
    }),
    enablePagination: !disablePagination,
    enableExpandAll: true,
    mantineTableContainerProps: {
      sx: {
        flex: "1 1 0"
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
    initialState: {
      expanded: expandAllRows ? true : undefined,
      sorting: sortState
    },
    mantinePaginationProps: {
      rowsPerPageOptions: ["50", "100", "200"]
    },
    mantineExpandButtonProps: {
      size: 20
    },
    mantineExpandAllButtonProps: {
      size: 20
    },
    renderDetailPanel
  });

  return <MantineReactTable table={table} />;
}
