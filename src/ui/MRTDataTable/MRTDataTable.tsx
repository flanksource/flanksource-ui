import {
  MantineReactTable,
  MRT_ColumnDef,
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
};

export default function MRTDataTable<T extends Record<string, any> = {}>({
  data,
  columns,
  onRowClick = () => {},
  isLoading = false,
  disablePagination = false,
  enableServerSideSorting = false,
  enableServerSidePagination = false,
  manualPageCount
}: MRTDataTableProps<T>) {
  const { pageIndex, pageSize, setPageIndex } = useReactTablePaginationState();
  const [sortState, setSortState] = useReactTableSortState();

  const table = useMantineReactTable({
    data: data,
    columns: columns,
    enableGlobalFilter: false,
    enableFilters: false,
    enableHiding: true,
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
    manualSorting: enableServerSideSorting,
    manualPagination: enableServerSidePagination,
    pageCount: manualPageCount,
    onPaginationChange: setPageIndex,
    onSortingChange: setSortState,
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => onRowClick(row.original),
      sx: { cursor: "pointer", maxHeight: "100%", overflowY: "auto" }
    }),
    mantinePaperProps: () => ({
      sx: {
        flex: "1 1 0",
        display: "flex",
        "flex-flow": "column"
      }
    }),
    enablePagination: !disablePagination,
    enableExpandAll: true,
    mantineTableContainerProps: {
      sx: {
        flex: "1 1 0"
      }
    },
    state: {
      isLoading,
      density: "xs",
      pagination: {
        pageIndex,
        pageSize: pageSize
      },
      sorting: sortState
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize
      }
    },
    mantinePaginationProps: {
      rowsPerPageOptions: ["50", "100", "200"]
    }
  });

  return <MantineReactTable table={table} />;
}
