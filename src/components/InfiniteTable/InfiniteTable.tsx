import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React, { useCallback, useMemo, useRef } from "react";

type InfiniteTableProps<T> = React.HTMLProps<HTMLDivElement> & {
  columns: ColumnDef<T, any>[];
  isFetching: boolean;
  className?: string;
  isLoading: boolean;
  totalEntries: number;
  allRows: T[];
  fetchNextPage: () => void;
  maxHeight?: string;
  virtualizedRowEstimatedHeight?: number;
  loaderView: React.ReactNode;
  stickyHead?: boolean;
  columnsClassName?: { [key: string]: string };
  onRowClick?: (row: Row<T>) => void;
};

export function InfiniteTable<T>({
  columns,
  isFetching,
  isLoading,
  totalEntries,
  allRows,
  className = "table-auto table-condensed text-sm",
  fetchNextPage,
  maxHeight,
  loaderView,
  stickyHead,
  columnsClassName,
  virtualizedRowEstimatedHeight = 50,
  onRowClick = () => {}
}: InfiniteTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const containerStyle = useMemo(() => {
    if (!maxHeight) {
      return {};
    }
    return {
      maxHeight
    };
  }, [maxHeight]);

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          allRows.length < totalEntries
        ) {
          fetchNextPage();
        }
      }
    },
    [isFetching, allRows, totalEntries, fetchNextPage]
  );

  const table = useReactTable<T>({
    data: allRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => virtualizedRowEstimatedHeight,
    overscan: 10
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  if (isLoading) {
    return <div className="flex flex-col overflow-y-auto">{loaderView}</div>;
  }

  return (
    <div
      className="flex flex-col overflow-y-auto overflow-x-hidden"
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      ref={tableContainerRef}
      style={containerStyle}
    >
      <table className={clsx(`mr-2 p-0`, stickyHead && "relative", className)}>
        <thead className={`${stickyHead ? "sticky top-0" : ""}`}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(columnsClassName?.[header.id], "py-0")}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler()
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<T>;
            return (
              <tr role="button" onClick={() => onRowClick(row)} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className={clsx(
                        columnsClassName?.[cell.column.id],
                        "px-0.5 py-0.5"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
