import React, { useMemo } from "react";
import { useTable, useExpanded, useSortBy } from "react-table";
import { IoCaretUpOutline, IoClose, IoCheckmark } from "react-icons/io5";
import clsx from "clsx";

const TEST_STATUS = {
  FAILED: "failed",
  PASSED: "passed"
};

const columns = [
  {
    Header: "Description",
    accessor: "name",
    Cell
  },
  {
    Header: "Summary",
    accessor: "status"
  }
];

function Cell({ row, value }) {
  return (
    <span
      className={clsx(
        "flex items-center py-1",
        `pl-${4 * row.depth + (row.canExpand ? 1 : 4)}`
      )}
    >
      {row.canExpand && (
        <IoCaretUpOutline
          className={clsx("transform duration-300 mr-1", {
            "rotate-180": !row.isExpanded
          })}
        />
      )}
      {!!row.depth &&
        (row.original.status === TEST_STATUS.FAILED ? (
          <IoClose color="red" className="mr-1" />
        ) : (
          <IoCheckmark color="green" className="mr-1" />
        ))}
      {value}
    </span>
  );
}

const groupTestsByClassname = (tests) =>
  Object.entries(
    tests.reduce(
      (acc, test) => ({
        ...acc,
        [test.classname]: [...(acc[test.classname] || []), test]
      }),
      {}
    )
  ).map(([name, subRows]) => {
    const isFailed = subRows.some(
      ({ status }) => status === TEST_STATUS.FAILED
    );
    return {
      name,
      subRows,
      status: isFailed ? TEST_STATUS.FAILED : TEST_STATUS.PASSED
    };
  });

export function JUnitTable({ suites, onSelectTestCase }) {
  const data = useMemo(
    () =>
      suites.map((suite) => {
        const subRows = groupTestsByClassname(suite.tests);
        return {
          ...suite,
          subRows,
          status: suite.failed ? TEST_STATUS.FAILED : TEST_STATUS.PASSED
        };
      }),
    [suites]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy, useExpanded);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => {
          const headerGroupProps = headerGroup.getHeaderGroupProps({
            className: "border-t border-b border-gray-300 text-sm"
          });
          return (
            <tr key={headerGroupProps.key} {...headerGroupProps}>
              {headerGroup.headers.map((column) => {
                const headerProps = column.getHeaderProps(
                  column.getSortByToggleProps({
                    className: "font-light text-left"
                  })
                );
                return (
                  <th key={headerProps.key} {...headerProps}>
                    <span className="flex items-center justify-left">
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
          const rowProps = row.getToggleRowExpandedProps({
            className: "hover:bg-blue-50"
          });
          rowProps.onClick = row.canExpand
            ? rowProps.onClick
            : () => onSelectTestCase(row.original);
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
