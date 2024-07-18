import { EvidenceType } from "@flanksource-ui/api/types/evidence";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import LogItem from "@flanksource-ui/types/Logs";
import TableSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TableSkeletonLoader";
import { sanitizeHTMLContent } from "@flanksource-ui/utils/common";
import {
  ColumnDef,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import Convert from "ansi-to-html";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AttachAsEvidenceButton from "../../Incidents/AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import { InfoMessage } from "../../InfoMessage";
import { LogsTableLabelsCell, LogsTableTimestampCell } from "./LogsTableCells";

const convert = new Convert();

type SizeTypes = {
  size?: number;
  maxSize?: number;
};

type LogsTableProps = {
  logs: LogItem[];
  actions?: Record<string, any>;
  variant?: "comfortable" | "compact";
  viewOnly?: boolean;
  isLoading?: boolean;
  areQueryParamsEmpty?: boolean;
  componentId?: string;
  columnSizes?: {
    Time?: SizeTypes;
    Message?: SizeTypes;
    Labels?: SizeTypes;
  };
};

export function LogsTable({
  logs,
  actions = [],
  variant,
  viewOnly,
  isLoading = false,
  areQueryParamsEmpty = false,
  componentId,
  columnSizes
}: LogsTableProps) {
  const [lines, setLines] = useState<LogItem[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [searchParams] = useSearchParams();

  const topologyId = searchParams.get("topologyId");
  const query = searchParams.get("query");
  const debouncedQueryValue = useDebouncedValue(query, 500);
  const logsSelector = searchParams.get("logsSelector");

  useEffect(() => {
    setLines([]);
    setRowSelection({});
  }, [debouncedQueryValue, logsSelector, topologyId]);

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    const savedColumnSizes = localStorage.getItem("logsTableColumnSizes");
    if (savedColumnSizes != null && savedColumnSizes !== "") {
      return JSON.parse(savedColumnSizes);
    }
    return {};
  });

  // debounce the column sizing state so it doesn't update too often
  const debouncedColumnSizing = useDebouncedValue(columnSizing, 500);

  // save the column sizing state to local storage, after it has been debounced
  useEffect(() => {
    if (debouncedColumnSizing != null) {
      localStorage.setItem(
        "logsTableColumnSizes",
        JSON.stringify(debouncedColumnSizing)
      );
    }
  }, [debouncedColumnSizing]);

  const columns = useMemo(
    () =>
      [
        {
          id: "selection",
          header: "Time",
          accessor: "timestamp",
          enableResizing: false,
          size: columnSizes?.Time?.size ?? 5,
          maxSize: columnSizes?.Time?.maxSize ?? 6,
          cell: ({ cell }) => (
            <LogsTableTimestampCell
              cell={cell}
              variant={variant}
              viewOnly={viewOnly}
              className="break-word flex flex-row text-left"
            />
          )
        },
        {
          header: (props) => {
            const { table } = props;
            const selectedFlatRows = table.getSelectedRowModel().flatRows;
            const { rowSelection } = table.getState();
            const hasSelectedRows = Object.keys(rowSelection).length !== 0;
            return (
              <div className="flex justify-between">
                <span className="my-auto align-middle">Message</span>
                {!viewOnly && (
                  <div className="-m-2 flex flex-wrap justify-end">
                    <div className="p-2">
                      <AttachAsEvidenceButton
                        disabled={!hasSelectedRows}
                        onClick={() => {
                          setLines(selectedFlatRows.map((d) => d.original));
                        }}
                        className={clsx(
                          hasSelectedRows ? "btn-primary" : "hidden"
                        )}
                        evidence={{ lines }}
                        type={EvidenceType.Log}
                        component_id={componentId}
                        callback={(success: boolean) => {
                          if (success) {
                            setLines([]);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          },
          accessor: "message",
          id: "message",
          size: columnSizes?.Message?.size || 300,
          cell: ({ cell, row }) => {
            return (
              <div
                className="break-all"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTMLContent(
                    convert.toHtml(row.original.message)
                  )
                }}
              />
            );
          }
        },
        {
          size: columnSizes?.Labels?.size || 100,
          id: "labels",
          header: "Labels",
          cell: ({ cell }) => <LogsTableLabelsCell cell={cell} />
        }
      ] as Array<ColumnDef<LogItem>>,
    [
      columnSizes?.Time?.size,
      columnSizes?.Time?.maxSize,
      columnSizes?.Message?.size,
      columnSizes?.Labels?.size,
      variant,
      viewOnly,
      lines,
      componentId
    ]
  );

  const table = useReactTable({
    columns,
    data: logs,
    state: {
      rowSelection,
      columnSizing
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    onColumnSizingChange: setColumnSizing,
    autoResetAll: false
  });

  // in order to ensure column resizing doesn't affect the selection column, we
  // need to rebase the new size to the base size of 400, total size of all
  // columns, including the selection column. This will ensure that the
  // selection remains the same size as it is rendered, and the other columns
  // sizes are rebased to relation to 100% of the width.
  const determineColumnWidth = useCallback(
    (column: string) => {
      if (column === undefined) {
        return;
      }
      const columnSize = table.getColumn(column)?.getSize();
      if (columnSize === undefined) {
        return (1 / (table.getTotalSize() - 6)) * 400;
      }
      if (column === "selection") {
        return columnSize;
      }
      return (columnSize / (table.getTotalSize() - 6)) * 400;
    },
    [table]
  );

  const { rows } = table.getRowModel();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 62,
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
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <div className="block w-full pb-6">
        <table
          className={clsx(
            "w-full table-fixed",
            variant === "comfortable" ? "comfortable-table" : "compact-table"
          )}
        >
          <thead className="sticky top-0 bg-white font-bold">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        width: determineColumnWidth(header.id)
                      }}
                      className={`group relative overflow-hidden`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* Use column.getResizerProps to hook up the events correctly */}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-gray-400 opacity-100 ${
                            header.column.getIsResizing()
                              ? "bg-black opacity-100"
                              : ""
                          }`}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((item) => {
              const row = rows[item.index];
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize()
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td className="text-center" colSpan={columns.length}>
                  {areQueryParamsEmpty ? (
                    <InfoMessage
                      className="my-8"
                      message="Please select a component to view the logs"
                    />
                  ) : isLoading ? (
                    <TableSkeletonLoader />
                  ) : (
                    <InfoMessage
                      className="my-8"
                      message="There are no logs matching the search query"
                    />
                  )}
                </td>
              </tr>
            )}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
