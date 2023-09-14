import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  Row,
  flexRender
} from "@tanstack/react-table";
import React, { useCallback, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";

type InfiniteTableProps<T> = React.HTMLProps<HTMLDivElement> & {
  columns: ColumnDef<T, any>[];
  isFetching: boolean;
  isLoading: boolean;
  totalEntries: number;
  allRows: T[];
  fetchNextPage: () => void;
  maxHeight?: string;
  virtualizedRowEstimatedHeight?: number;
  loaderView: React.ReactNode;
  stickyHead?: boolean;
  columnsClassName?: { [key: string]: string };
};

export function InfiniteTable<T>({
  columns,
  isFetching,
  isLoading,
  totalEntries,
  allRows,
  fetchNextPage,
  maxHeight,
  loaderView,
  stickyHead,
  columnsClassName,
  virtualizedRowEstimatedHeight = 50
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
      <table
        className={clsx(
          `table-auto table-fixed w-full flex flex-col p-0`,
          stickyHead && "relative"
        )}
      >
        <thead
          className={`flex flex-col flex-1 bg-white ${
            stickyHead ? "sticky top-0 z-1" : ""
          }`}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="flex flex-row flex-1" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ padding: "0px" }}
                    className={clsx(columnsClassName?.[header.id])}
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
        <tbody className={`flex flex-col flex-1`}>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<T>;
            return (
              <tr className="flex flex-row flex-1" key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className={clsx(columnsClassName?.[cell.column.id])}
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
