import React, { useMemo } from "react";
import { useTable, useExpanded, useSortBy } from "react-table";
import { IoCaretUpOutline } from "react-icons/io5";
import clsx from "clsx";

const columns = [
  {
    id: "expander",
    Cell
  },
  {
    Header: "Description",
    accessor: "name"
  },
  {
    Header: "Summary",
    accessor: "status"
  }
];

function Cell({ row }) {
  return row.canExpand ? (
    <IoCaretUpOutline
      className={clsx("transform duration-300", {
        "rotate-180": !row.isExpanded
      })}
    />
  ) : null;
}

export function JUnitTable({ suites, onSelecteTestCase }) {
  const data = useMemo(
    () =>
      suites.map((suite) => ({
        ...suite,
        subRows: suite.tests,
        status: suite.failed ? "failed" : "passed"
      })),
    [suites]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy, useExpanded);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => {
          const headerGroupProps = headerGroup.getHeaderGroupProps();
          return (
            <tr key={headerGroupProps.key} {...headerGroupProps}>
              {headerGroup.headers.map((column) => {
                const headerProps = column.getHeaderProps(
                  column.getSortByToggleProps()
                );
                return (
                  <th key={headerProps.key} {...headerProps}>
                    <span className="flex items-center justify-center">
                      {column.render("Header")}
                      {column.isSorted && (
                        <IoCaretUpOutline
                          className={clsx("transform duration-300", {
                            "rotate-180": !column.isSortedDesc
                          })}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const rowProps = row.getToggleRowExpandedProps();
          rowProps.onClick = row.canExpand
            ? rowProps.onClick
            : () => onSelecteTestCase(row.original);
          return (
            <tr key={rowProps.key} {...rowProps}>
              {row.cells.map((cell) => {
                const cellProps = cell.getCellProps();
                return (
                  <td key={cellProps.key} {...cellProps}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
