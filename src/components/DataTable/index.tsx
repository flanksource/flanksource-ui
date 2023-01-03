import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useSearchParams } from "react-router-dom";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DataTableRow } from "./DataTableRow";
import { Loading } from "../Loading";
import { InfoMessage } from "../InfoMessage";

const tableStyles = {
  theadHeaderClass: " tracking-wider",
  tbodyRowClass: "cursor-pointer text-sm",
  tbodyDataClass: "whitespace-nowrap p-2"
};

type DataTableProps<TableColumns, Data extends TableColumns> = {
  columns: ColumnDef<TableColumns>[];
  data: Data[];
  handleRowClick?: (row: any) => void;
  tableStyle?: React.CSSProperties;
  stickyHead?: boolean;
  isLoading?: boolean;
  groupBy?: string[];
  hiddenColumns?: string[];
  className?: string;
  isVirtualized?: boolean;
  virtualizedRowEstimatedHeight?: number;
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
} & React.HTMLAttributes<HTMLTableElement>;

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
  ...rest
}: DataTableProps<TableColumns, Data>) {
  const [queryParams, setQueryParams] = useSearchParams();

  const tableContainerRef = useRef<HTMLDivElement>(null);

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
    state: {
      sorting: sortBy,
      ...(isGrouped ? { grouping: groupBy } : {}),
      columnVisibility: tableHiddenColumnsRecord
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: isGrouped ? getExpandedRowModel() : undefined,
    getGroupedRowModel: isGrouped ? getGroupedRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    enableHiding: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    onSortingChange: (sorting) => {
      if (onTableSortByChanged) {
        onTableSortByChanged(sorting);
      } else {
        setSortBy(sorting);
      }
    }
  });

  const { rows } = table.getRowModel();

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: isVirtualized ? rows.length : 0,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => virtualizedRowEstimatedHeight,
    overscan: 10
  });

  const virtualRows = getVirtualItems();
  const totalSize = getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div
      ref={tableContainerRef}
      className={clsx("flex flex-col flex-1 overflow-y-auto", className)}
      {...rest}
    >
      <table
        className={clsx(
          // for some reason, it seems to need both auto and fixed, there may be
          // some other css class tied to auto
          `table-auto table-fixed w-full`,
          stickyHead && "relative"
        )}
        style={tableStyle}
      >
        <thead className={`bg-white ${stickyHead ? "sticky top-0 z-01" : ""}`}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
                  >
                    <div className={"flex select-none"}>
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
                  </th>
                )
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
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
                    rowClassNames={`${
                      tableStyles.tbodyRowClass
                    } ${determineRowClassNamesCallback(row)}`}
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
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </table>
      {table.getRowModel().rows.length === 0 && (
        <div className="flex items-center justify-center py-20 px-2  border-b border-gray-300 text-center text-gray-400">
          {isLoading ? (
            <Loading text="Loading data.." />
          ) : (
            <InfoMessage className="my-8" message="No data available" />
          )}
        </div>
      )}
    </div>
  );
}
