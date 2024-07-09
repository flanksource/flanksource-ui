import TableSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TableSkeletonLoader";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useSearchParams } from "react-router-dom";
import { HealthCheck } from "../../api/types/health";
import { InfoMessage } from "../InfoMessage";
import { getCanaryTableColumns } from "./CanaryTableColumns";
import { prepareRows } from "./Rows/lib";
import { getAggregatedGroupedChecks } from "./aggregate";
import { getGroupedChecks } from "./grouping";
import { useHealthUserSettings } from "./useHealthUserSettings";

const styles = {
  outerDivClass: "border-l border-r border-gray-300 overflow-y-auto",
  topBgClass: "bg-red-500",
  tableClass: "min-w-full border-separate shadow-lg bg-white rounded-lg",
  theadClass: "bg-white z-10 sticky top-0",
  theadRowClass: "z-10",
  theadHeaderClass:
    "py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300",
  tbodyClass: "mt-4 rounded-md",
  tbodyRowClass: "border cursor-pointer",
  tbodyRowExpandableClass: "cursor-pointer",
  tbodyDataClass: "whitespace-nowrap border-gray-300 border-b"
};

type CanaryChecksProps = {
  checks?: HealthCheck[];
  labels?: string[];
  onCheckClick: (check: HealthCheck) => void;
  showNamespaceTags?: boolean;
  hideNamespacePrefix?: boolean;
  groupSingleItems?: boolean;
  theadStyle?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>;

export function CanaryTable({
  checks,
  labels,
  onCheckClick,
  showNamespaceTags,
  hideNamespacePrefix,
  groupSingleItems = true,
  theadStyle = {},
  ...rest
}: CanaryChecksProps) {
  const [params] = useSearchParams();

  const { groupBy = "canary_name" } = useHealthUserSettings();

  const pivotCellType = params.get("pivotCellType");
  const pivotLookup = params.get("pivotLabel");
  const pivotBy = params.get("pivotBy");

  const tableData = useMemo(() => {
    return groupBy !== "no-group"
      ? Object.values(
          getAggregatedGroupedChecks(
            getGroupedChecks(checks, groupBy),
            groupSingleItems
          )
        )
      : checks;
  }, [checks, groupBy, groupSingleItems]);

  const { rows } = useMemo(
    () => prepareRows({ tableData, hideNamespacePrefix, pivotBy, pivotLookup }),
    [hideNamespacePrefix, tableData, pivotBy, pivotLookup]
  );

  const shouldPivot =
    pivotCellType != null &&
    pivotCellType !== "" &&
    pivotBy != null &&
    pivotBy !== "none";

  return (
    <Table
      data={rows}
      labels={labels}
      pivotCellType={shouldPivot ? pivotCellType : null}
      onHealthCheckClick={onCheckClick}
      hasGrouping={groupBy !== "no-group"}
      groupBy={groupBy}
      showNamespaceTags={showNamespaceTags}
      hideNamespacePrefix={hideNamespacePrefix}
      theadStyle={theadStyle}
      {...rest}
    />
  );
}

type TableProps = {
  data: any[];
  labels?: string[];
  pivotCellType: string | null;
  hasGrouping: boolean;
  onHealthCheckClick: (check: HealthCheck) => void;
  showNamespaceTags?: boolean;
  hideNamespacePrefix?: boolean;
  theadStyle?: React.CSSProperties;
  groupBy?: string;
  isLoading?: boolean;
};

export function Table({
  data,
  labels,
  pivotCellType,
  hasGrouping = false,
  onHealthCheckClick,
  showNamespaceTags = false,
  hideNamespacePrefix = false,
  theadStyle = {},
  groupBy = "canary_name",
  isLoading = false,
  ...rest
}: TableProps) {
  const [params, setParams] = useSearchParams();

  const sortByValue = params.get("sortBy") || "name";
  const sortDesc = params.get("sortDesc") === "true" || false;

  const rowFinder = (row: any) => {
    const rowValues =
      row?.pivoted === true ? row[row.valueLookup] ?? null : row;
    return rowValues?.subRows || [];
  };

  // ensure sorting works when state isn't managed by caller
  const [sortBy, setSortBy] = useState<SortingState>();

  useEffect(() => {
    setSortBy([{ id: sortByValue, desc: sortDesc }]);
  }, [setSortBy, sortByValue, sortDesc]);

  const columns = useMemo(
    () =>
      getCanaryTableColumns({
        showNamespaceTags,
        hideNamespacePrefix
      }),
    [showNamespaceTags, hideNamespacePrefix]
  );

  const table = useReactTable<HealthCheck>({
    columns: columns,
    data,
    enableMultiSort: false,
    autoResetAll: false,
    getSubRows: rowFinder,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: hasGrouping ? getExpandedRowModel() : undefined,
    getGroupedRowModel: hasGrouping ? getGroupedRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: true,
    onSortingChange: (sorting) => {
      if (typeof sorting === "function") {
        const newSortBy = sorting(sortBy ?? []);
        setSortBy(newSortBy);
        if (newSortBy.length === 0) {
          params.delete("sortBy");
          params.delete("sortDesc");
        } else {
          params.set("sortBy", newSortBy[0].id);
          params.set("sortDesc", newSortBy[0].desc.toString());
        }
        setParams(params);
        return;
      }
      setSortBy(sorting);
      if (sorting.length === 0) {
        params.delete("sortBy");
        params.delete("sortDesc");
      } else {
        params.set("sortBy", sorting[0].id);
        params.set("sortDesc", sorting[0].desc.toString());
      }
      setParams(params);
    },
    enableHiding: true,
    state: {
      columnVisibility: hasGrouping ? { expander: true } : undefined,
      sorting: sortBy
    }
  });

  return (
    <div className={styles.outerDivClass} {...rest}>
      <div className={styles.topBgClass} />
      <table className={styles.tableClass} style={{ borderSpacing: "0" }}>
        <thead className={styles.theadClass} style={theadStyle}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className={styles.theadRowClass} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  className={clsx(styles.theadHeaderClass)}
                  key={column.id}
                  // Table header onClick sorting override:
                  // sortDesc cannot be null, only either true/false
                  onClick={column.column.getToggleSortingHandler()}
                >
                  <div
                    className={clsx(
                      "flex select-none",
                      (column.column.columnDef?.meta as Record<string, string>)
                        ?.cellClass
                    )}
                  >
                    {flexRender(
                      column.column.columnDef.header,
                      column.getContext()
                    )}
                    <span>
                      {column.column.getIsSorted() ? (
                        column.column.getIsSorted() ? (
                          <TiArrowSortedUp />
                        ) : (
                          <TiArrowSortedDown />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tbodyClass}>
          {table.getRowModel().rows.length > 0 &&
            table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className={`${styles.tbodyRowClass} ${
                    row.getCanExpand() ? styles.tbodyRowExpandableClass : ""
                  }`}
                  style={{}}
                  onClick={
                    row.getCanExpand()
                      ? () => row.getToggleExpandedHandler()()
                      : () => onHealthCheckClick(row.original)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.column.id}
                      className={`${styles.tbodyDataClass} ${
                        cell.column || ""
                      } ${
                        (cell.column.columnDef?.meta as Record<string, any>)
                          ?.cellClassName || ""
                      }`}
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
        </tbody>
      </table>
      {table.getRowModel().rows.length <= 0 && (
        <div className="flex items-center justify-center px-2 border-b border-gray-300 text-center text-gray-400">
          {isLoading ? (
            <TableSkeletonLoader className="mt-2" />
          ) : (
            <InfoMessage className="my-8 py-20" message="No data available" />
          )}
        </div>
      )}
    </div>
  );
}
