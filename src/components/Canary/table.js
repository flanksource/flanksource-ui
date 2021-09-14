import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useTable, useSortBy } from "react-table";
import { GetName } from "./data";
import { Duration, Percentage } from "./renderers";
import {
  getHealthPercentageScore,
  getLatency,
  getUptimeScore
} from "./sorting";
import { StatusList } from "./status";
import { decodeUrlSearchParams, encodeObjectToUrlSearchParams } from "./url";

const styles = {
  outerDivClass: "",
  tableClass: "min-w-full relative",
  theadClass: "sticky top-6 z-10",
  tableHeaderBg: "h-10 absolute top-0",
  tableHeaderBgFront:
    "bg-gray-100 rounded-tl-md rounded-tr-md border border-b-0",
  tableHeaderBgBack: "bg-white",
  theadRowClass: "z-10",
  theadHeaderClass:
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ",
  tbodyClass: "mt-4 rounded-md",
  tbodyRowClass: "border",
  tbodyDataClass: "px-6 py-2 whitespace-nowrap"
};

function HealthCell({ value }) {
  return <StatusList checkStatuses={value} />;
}

function UptimeCell({ value }) {
  return (
    <Percentage upper={value.passed + value.failed} lower={value.passed} />
  );
}

function LatencyCell({ value }) {
  return <Duration ms={value.rolling1h} />;
}

export function CanaryTable({ checks, labels, history, ...rest }) {
  const data = useMemo(
    () =>
      checks.map((check) => ({
        ...check,
        name: GetName(check)
      })),
    [checks]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Checks",
        accessor: "name",
        cellClass: "w-full max-w-0 overflow-hidden overflow-ellipsis"
      },
      {
        Header: "Health",
        accessor: "checkStatuses",
        Cell: HealthCell,
        cellClass: "",
        sortType: (a, b) =>
          getHealthPercentageScore(a.values) <
          getHealthPercentageScore(b.values)
            ? 1
            : -1
      },
      {
        Header: "Uptime",
        accessor: "uptime",
        Cell: UptimeCell,
        cellClass: "",
        sortType: (a, b) =>
          getUptimeScore(a.values) < getUptimeScore(b.values) ? 1 : -1
      },
      {
        Header: "Latency",
        accessor: "latency",
        Cell: LatencyCell,
        cellClass: "",
        sortType: (a, b) =>
          getLatency(a.values) < getLatency(b.values) ? -1 : 1
      }
    ],
    []
  );

  const {
    state: tableState,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setSortBy,
    prepareRow
  } = useTable(
    { columns, data, disableMultiSort: true, autoResetSortBy: false },
    useSortBy
  );

  const { watch, setValue } = useForm({
    defaultValues: decodeUrlSearchParams(window.location.search)
  });

  const watchSortBy = watch("sortBy");
  const watchSortDesc = watch("sortDesc");

  // Set table's sort state according to url params on page load
  useEffect(() => {
    const searchParams = window.location.search;
    const decodedParams = decodeUrlSearchParams(searchParams);
    setSortBy([{ id: decodedParams.sortBy, desc: decodedParams.sortDesc }]);
  }, [setSortBy]);

  // Form's sortBy and sortDesc state changes updates url
  useEffect(() => {
    const searchParams = window.location.search;
    const decodedParams = decodeUrlSearchParams(searchParams);
    const newFormState = {
      ...decodedParams,
      sortBy: watchSortBy,
      sortDesc: watchSortDesc
    };
    const encoded = encodeObjectToUrlSearchParams(newFormState);
    if (window.location.search !== `?${encoded}`) {
      // See https://github.com/remix-run/history/blob/main/docs/getting-started.md
      history.push(`/canary?${encoded}`);
    }
  }, [watchSortBy, watchSortDesc, history]);

  // Table-state changes will in turn trigger changes in the formState
  useEffect(() => {
    if (tableState?.sortBy) {
      if (tableState.sortBy.length > 0) {
        setValue("sortBy", tableState.sortBy[0].id);
        setValue("sortDesc", tableState.sortBy[0].desc);
      } else {
        setValue("sortBy", null);
        setValue("sortDesc", null);
      }
    }
  }, [tableState, setValue]);

  return (
    <div className={styles.outerDivClass} {...rest}>
      <table className={styles.tableClass} {...getTableProps()}>
        <thead className={styles.theadClass}>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              className={styles.theadRowClass}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  key={column.Header}
                  className={styles.theadHeaderClass}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <div className="flex select-none">
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
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
          <tr
            className={`${styles.tableHeaderBg} ${styles.tableHeaderBgFront}`}
            style={{ zIndex: "-1", left: "-1px", width: "calc(100% + 2px)" }}
          />
          <tr
            className={`${styles.tableHeaderBg} ${styles.tableHeaderBgBack}`}
            style={{ zIndex: "-2", left: "-1px", width: "calc(100% + 2px)" }}
          />
        </thead>
        <tbody className={styles.tbodyClass} {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                className={`${styles.tbodyRowClass}`}
                style={{}}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.Header}
                    className={`${styles.tbodyDataClass} ${
                      cell.column.cellClass || ""
                    }`}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
