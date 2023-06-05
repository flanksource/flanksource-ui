import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DataTableRow } from "./DataTableRow";
import { InfoMessage } from "../InfoMessage";
import { Pagination, PaginationType } from "./Pagination/Pagination";
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";
import usePreferences from "../../hooks/userPreferences";

const tableStyles = {
  theadHeaderClass:
    "px-3 py-3 text-left text-gray-500 font-medium text-xs tracking-wider",
  tbodyRowClass: "cursor-pointer text-sm",
  tbodyDataClass: "whitespace-nowrap p-2"
};

export type PaginationOptions = {
  setPagination: any;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  remote?: boolean;
  enable: boolean;
  loading?: boolean;
};

type DataTableProps<TableColumns, Data extends TableColumns> = {
  columns: ColumnDef<TableColumns>[];
  data: Data[];
  handleRowClick?: (row: Row<TableColumns>) => void;
  tableStyle?: React.CSSProperties;
  stickyHead?: boolean;
  isLoading?: boolean;
  groupBy?: string[];
  hiddenColumns?: string[];
  className?: string;
  isVirtualized?: boolean;
  virtualizedRowEstimatedHeight?: number;
  paginationClassName?: string;
  paginationType?: PaginationType;
  preferencesKey?: string;
  savePreferences?: boolean;
  overScan?: number;
  /**
   * Columns used for sorting the table
   *
   * @example
   *
   * const [tableSortByState, setTableSortByState] = useState<SortingState>([]);
   *
   *  <DataTable
   *   ...
   *   tableSortByState={tableSortByState}
   *   onTableSortByChanged={setTableSortByState}
   *   />
   */
  tableSortByState?: SortingState;

  /**
   *
   * Allows you to customize the table sorting behaviour
   *
   * @example
   *
   * const [tableSortByState, setTableSortByState] = useState<SortingState>([]);
   *
   *  <DataTable
   *   ...
   *   tableSortByState={tableSortByState}
   *   onTableSortByChanged={setTableSortByState}
   *   />
   *
   *
   */
  onTableSortByChanged?: (sortBy: Updater<SortingState>) => void;

  /**
   *
   * determineRowClassNames
   *
   * Allows you to customize the row class names, based on the row data
   *
   * For example, you can use this to gray out a row if it's deleted
   *
   */
  determineRowClassNamesCallback?: (row: Row<TableColumns>) => string;
  pagination?: PaginationOptions;
  enableServerSideSorting?: boolean;
} & React.HTMLAttributes<HTMLTableElement>;

type TablePreferences = {
  expandedRows: ExpandedState | undefined;
  scrollTop: number;
};

export function DataTable<TableColumns, Data extends TableColumns>({
  columns,
  data,
  handleRowClick,
  tableStyle,
  stickyHead,
  isLoading,
  groupBy,
  hiddenColumns,
  className,
  isVirtualized = false,
  virtualizedRowEstimatedHeight = 35,
  tableSortByState,
  onTableSortByChanged,
  determineRowClassNamesCallback = () => "",
  pagination,
  paginationClassName = "py-4",
  paginationType = "complete",
  enableServerSideSorting = false,
  preferencesKey = "",
  savePreferences = false,
  overScan = 10,
  ...rest
}: DataTableProps<TableColumns, Data>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const { storePreferences, preferences } =
    usePreferences<TablePreferences>(preferencesKey);
  const emptyList = useMemo(() => [], []);

  const tableHiddenColumnsRecord = useMemo(
    () =>
      hiddenColumns?.reduce<VisibilityState>((acc, curr) => {
        acc[curr] = false;
        return acc;
      }, {}),
    [hiddenColumns]
  );

  // ensure sorting works when state isn't managed by caller
  const [sortBy, setSortBy] = useState<SortingState>(tableSortByState ?? []);

  // ensure sorting works when state isn't managed by caller
  useEffect(() => {
    setSortBy(tableSortByState ?? []);
  }, [tableSortByState]);

  const isGrouped = !!(groupBy?.length && groupBy.length > 0);

  const table = useReactTable<TableColumns>({
    columns,
    data,
    initialState: {
      expanded: savePreferences ? preferences.expandedRows : {}
    },
    state: {
      sorting: sortBy,
      ...(isGrouped ? { grouping: groupBy } : {}),
      columnVisibility: tableHiddenColumnsRecord,
      pagination: pagination?.enable
        ? {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize
          }
        : undefined
    },
    onPaginationChange: !!pagination?.enable
      ? pagination.setPagination
      : undefined,
    pageCount: pagination?.remote ? pagination.pageCount : undefined,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: isGrouped ? getExpandedRowModel() : undefined,
    getGroupedRowModel: isGrouped ? getGroupedRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel:
      pagination?.enable && !pagination.remote
        ? getPaginationRowModel()
        : undefined,
    manualPagination: !!pagination?.enable && pagination.remote,
    manualSorting: enableServerSideSorting,
    enableSortingRemoval: true,
    enableHiding: true,
    onSortingChange: (sorting) => {
      if (onTableSortByChanged) {
        onTableSortByChanged(sorting);
      } else {
        setSortBy(sorting);
      }
    }
  });

  const state = table.getState();

  const expandedRows = useMemo(() => {
    return state.expanded;
  }, [state]);

  useEffect(() => {
    if (!tableContainerRef.current || !savePreferences) {
      return;
    }
    tableContainerRef.current.scrollTop = preferences.scrollTop;
  }, [preferences.scrollTop, savePreferences]);

  useEffect(() => {
    if (!savePreferences) {
      return;
    }
    storePreferences({
      scrollTop,
      expandedRows
    });
  }, [expandedRows, scrollTop, storePreferences, savePreferences]);

  const { rows } =
    pagination?.enable && !pagination.remote
      ? table.getPaginationRowModel()
      : table.getRowModel();

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: isVirtualized ? rows.length : 0,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => virtualizedRowEstimatedHeight,
    overscan: overScan
  });

  const virtualRows = isVirtualized ? getVirtualItems() : emptyList;
  const totalSize = isVirtualized ? getTotalSize() : 0;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  useEffect(() => {
    const [lastItem] = [...virtualRows].reverse();
    if (!lastItem || !pagination || paginationType !== "virtual") {
      return;
    }
    if (lastItem.index >= rows.length - 1 && pagination.pageCount > 1) {
      table.setPageSize(pagination.pageSize * 2);
    }
  }, [rows.length, virtualRows, pagination, paginationType, table]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto space-y-2 h-full">
      <div
        ref={tableContainerRef}
        className={clsx("flex flex-col flex-1 overflow-y-auto", className)}
        {...rest}
        onScroll={(e) => {
          setScrollTop((e.target as HTMLDivElement).scrollTop);
        }}
      >
        <table
          className={clsx(
            // for some reason, it seems to need both auto and fixed, there may be
            // some other css class tied to auto
            `table-auto table-fixed w-full border border-gray-200 rounded-md`,
            stickyHead && "relative"
          )}
          style={tableStyle}
        >
          <thead
            className={`bg-white rounded-md ${
              stickyHead ? "sticky top-0 z-01" : ""
            }`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className="border-b border-gray-200 uppercase bg-column-background rounded-t-md items-center"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header, colIndex) =>
                  // First column goes inside the grouping column
                  // Hence the label for that is not needed
                  isGrouped &&
                  !header.column.getIsGrouped() &&
                  colIndex === 1 ? null : (
                    <th
                      key={header.id}
                      className={`${tableStyles.theadHeaderClass}${
                        header.column.getCanSort() ? " cursor-pointer" : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        width: header.column.getSize()
                      }}
                      colSpan={header.column?.columns?.length ?? 1}
                    >
                      {(header.headerGroup.depth === 0 ||
                        (header.column.parent?.columns?.length ?? 0) > 0) && (
                        <div
                          className={clsx(
                            "flex select-none",
                            header.headerGroup.depth > 0 && "text-xs"
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() ? (
                            <span className="ml-2">
                              {header.column.getIsSorted() === "asc" ? (
                                <TiArrowSortedDown />
                              ) : (
                                <TiArrowSortedUp />
                              )}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </th>
                  )
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {isVirtualized && paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {isVirtualized
              ? getVirtualItems().map(({ index }) => {
                  const row = rows[index];
                  return (
                    <DataTableRow
                      row={row}
                      cellClassNames={tableStyles.tbodyDataClass}
                      onRowClick={handleRowClick}
                      isGrouped={isGrouped}
                      rowClassNames={tableStyles.tbodyRowClass}
                      key={row.id}
                    />
                  );
                })
              : rows.map((row) => (
                  <DataTableRow
                    row={row}
                    cellClassNames={tableStyles.tbodyDataClass}
                    onRowClick={handleRowClick}
                    isGrouped={isGrouped}
                    rowClassNames={`${
                      tableStyles.tbodyRowClass
                    } ${determineRowClassNamesCallback(row)}`}
                    key={row.id}
                  />
                ))}
            {isVirtualized && paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
        {table.getRowModel().rows.length === 0 && (
          <div className="flex items-center justify-center px-2 border-b border-gray-300 text-center text-gray-400">
            {isLoading ? (
              <TableSkeletonLoader className="mt-2" />
            ) : (
              <InfoMessage className="my-8 py-20" message="No data available" />
            )}
          </div>
        )}
      </div>
      {pagination?.enable &&
        Boolean(table.getRowModel().rows.length) &&
        paginationType !== "virtual" && (
          <Pagination
            paginationType={paginationType}
            className={paginationClassName}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
            pageOptions={table.getPageOptions()}
            pageCount={table.getPageCount()}
            gotoPage={table.setPageIndex}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            setPageSize={table.setPageSize}
            state={{
              ...table.getState().pagination
            }}
            loading={pagination.loading}
          />
        )}
    </div>
  );
}
