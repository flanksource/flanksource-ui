import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useSearchParams } from "react-router-dom";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  GroupingState,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { Badge } from "../Badge";

const tableStyles = {
  tableClass: "table-auto w-full",
  theadHeaderClass: " tracking-wider",
  tbodyRowClass: "cursor-pointer text-sm",
  tbodyDataClass: "whitespace-nowrap p-2"
};

type DataTableProps<TableColumns, Data extends TableColumns> = {
  columns: ColumnDef<TableColumns>[];
  data: Data[];
  handleRowClick?: (row: any) => void;
  tableStyle?: React.StyleHTMLAttributes<HTMLTableElement>;
  stickyHead?: boolean;
  isLoading?: boolean;
  groupBy?: string[];
  hiddenColumns?: string[];
  className?: string;
  usageSection?: string;
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
  usageSection,
  ...rest
}: DataTableProps<TableColumns, Data>) {
  const [queryParams, setQueryParams] = useSearchParams({
    sortBy: "",
    sortOrder: ""
  });

  const sortField = queryParams.get("sortBy");
  const isSortOrderDesc =
    queryParams.get("sortOrder") === "desc" ? true : false;

  const sortBy = useMemo(() => {
    const data = sortField
      ? [
          {
            id: sortField,
            desc: isSortOrderDesc
          }
        ]
      : [];
    if (sortField === "config_type" && usageSection === "config-list") {
      data.push({
        id: "name",
        desc: isSortOrderDesc
      });
    }
    return data;
  }, [sortField, isSortOrderDesc, usageSection]);

  const [tableSortBy, setTableSortBy] = useState<SortingState>(sortBy);
  const [tableGroupBy, setTableGroupBy] = useState<GroupingState>(
    groupBy ?? []
  );

  const table = useReactTable<TableColumns>(
    {
      columns,
      data,
      // autoResetSortBy: false,
      state: {
        sorting: tableSortBy,
        grouping: tableGroupBy
        // columnFilters: hiddenColumns,
      },
      // onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      enableColumnResizing: true,
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
      onSortingChange: setTableSortBy,
      onGroupingChange: setTableGroupBy
    }

    // useGroupBy,
    // useSortBy,
    // useExpanded
  );

  const isGrouped = !!groupBy?.length;

  useEffect(() => {
    setTableGroupBy(Array.isArray(groupBy) ? groupBy : []);
  }, [groupBy, table]);

  useEffect(() => {
    console.log("tableSortBy", tableSortBy);
    // if (field === undefined && order === undefined) {
    //   queryParams.delete("sortBy");
    //   queryParams.delete("sortOrder");
    // } else {
    //   queryParams.set("sortBy", field);
    //   queryParams.set("sortOrder", order);
    // }
    // setQueryParams(queryParams);
  }, [tableSortBy]);

  return (
    <div
      className={clsx("flex flex-col flex-1 overflow-y-auto", className)}
      {...rest}
    >
      <table
        className={clsx(tableStyles.tableClass, stickyHead && "relative")}
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
                  >
                    <div className={"flex select-none"}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() ? (
                        <span className="ml-2">
                          {header.column.getIsSorted() === "desc" ? (
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
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className={tableStyles.tbodyRowClass}
                onClick={
                  row.getIsGrouped()
                    ? () => row.getToggleExpandedHandler()
                    : handleRowClick
                    ? () => handleRowClick(row)
                    : () => {}
                }
              >
                {row.getVisibleCells().map((cell, cellIndex) =>
                  cell.getIsPlaceholder() ? null : cell.getIsAggregated() &&
                    cellIndex === 1 ? null : (
                    <td
                      key={cell.id}
                      className={`${tableStyles.tbodyDataClass}`}
                    >
                      {cell.getIsGrouped() ? (
                        <div className="flex items-center">
                          <div
                            className={`duration-200 mr-2 ${
                              row.getIsExpanded() ? "rotate-90" : ""
                            }`}
                          >
                            <IoChevronForwardOutline />
                          </div>
                          <div className="shrink-0">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                          <div className="ml-1 flex items-center">
                            <Badge
                              className="ml-1"
                              colorClass="bg-gray-200 text-gray-800"
                              roundedClass="rounded-xl"
                              text={row?.subRows.length}
                              size="xs"
                            />
                          </div>
                        </div>
                      ) : cell.getIsAggregated() ? (
                        flexRender(
                          cell.column.columnDef.aggregatedCell,
                          cell.getContext()
                        )
                      ) : (
                        <div
                          // First column should be displaced if the table
                          // is grouped
                          className={`${
                            isGrouped && !row?.subRows.length && cellIndex === 1
                              ? "pl-12"
                              : ""
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      )}
                    </td>
                  )
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {table.getRowModel().rows.length === 0 && (
        <div className="flex items-center justify-center py-20 px-2  border-b border-gray-300 text-center text-gray-400">
          {isLoading ? "Loading data.." : "No data available"}
        </div>
      )}
    </div>
  );
}
