import React, { useEffect, useState, useMemo } from "react";
import { RiContactsBookLine } from "react-icons/ri";
import { useTable } from "react-table";
import { GetName } from "./data";
import { Duration, Percentage } from "./renderers";
import { StatusList } from "./status";

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
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tbodyClass: "mt-4 rounded-md",
  tbodyRowClass: "border",
  tbodyDataClass: "px-6 py-2 whitespace-nowrap "
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

export function NewCanaryTable({ checks, ...rest }) {
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
        cellClass: ""
      },
      {
        Header: "Uptime",
        accessor: "uptime",
        Cell: UptimeCell,
        cellClass: ""
      },
      {
        Header: "Latency",
        accessor: "latency",
        Cell: LatencyCell,
        cellClass: ""
      }
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className={styles.outerDivClass}>
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
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
          <div
            className={`${styles.tableHeaderBg} ${styles.tableHeaderBgFront}`}
            style={{ zIndex: "-1", left: "-1px", width: "calc(100% + 1px)" }}
          />
          <div
            className={`${styles.tableHeaderBg} ${styles.tableHeaderBgBack}`}
            style={{ zIndex: "-2", left: "-1px", width: "calc(100% + 1px)" }}
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
