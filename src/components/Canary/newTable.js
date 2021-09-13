import React, { useEffect, useState, useMemo } from "react";
import { RiContactsBookLine } from "react-icons/ri";
import { useTable } from "react-table";
import { GetName } from "./data";
import { Duration, Percentage } from "./renderers";
import { StatusList } from "./status";

const styles = {
  tableClass: "border border-green-500",
  theadClass: "border border-red-500",
  theadRowClass: "",
  theadHeaderClass: "",
  tbodyClass: "",
  tbodyRowClass: "",
  tbodyDataClass: ""
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
  const data = useMemo(() => {
    console.log(checks);
    return checks.map((check) => ({
      ...check,
      name: GetName(check)
    }));
  }, [checks]);

  const columns = useMemo(
    () => [
      {
        Header: "Checks",
        accessor: "name"
      },
      {
        Header: "Health",
        accessor: "checkStatuses",
        Cell: HealthCell
      },
      {
        Header: "Uptime",
        accessor: "uptime",
        Cell: UptimeCell
      },
      {
        Header: "Latency",
        accessor: "latency",
        Cell: LatencyCell
      }
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table className={styles.tableClass} {...getTableProps()}>
      <thead className={styles.theadClass}>
        {headerGroups.map((headerGroup) => (
          <tr
            className={styles.theadRowClass}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <th
                className={styles.theadHeaderClass}
                {...column.getHeaderProps()}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className={styles.tbodyClass} {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr
              key={row.id}
              className={styles.tbodyRowClass}
              {...row.getRowProps()}
            >
              {row.cells.map((cell) => (
                <td
                  key={cell.column.Header}
                  className={styles.tbodyDataClass}
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
  );
}
