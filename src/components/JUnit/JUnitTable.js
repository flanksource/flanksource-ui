import React, { useEffect, useMemo } from "react";
import { useTable, useExpanded, useSortBy, useFilters } from "react-table";
import { IoCaretUpOutline, IoClose, IoCheckmark } from "react-icons/io5";
import clsx from "clsx";
import PropTypes from "prop-types";

const TEST_STATUS = {
  FAILED: "failed",
  PASSED: "passed"
};

const columns = [
  {
    Header: "Description",
    accessor: "name",
    Cell: CellName
  },
  {
    Header: "Summary",
    accessor: "status"
  },
  {
    Header: "Duration",
    accessor: "duration",
    Cell: ({ value }) => formatDuration(value)
  }
];

function formatDuration(valueInSeconds) {
  const date = new Date(valueInSeconds * 1000);
  const ms = `000${date.getUTCMilliseconds()}`.slice(-3);
  const s = `00${date.getUTCSeconds()}`.slice(-2);
  const m = `00${date.getUTCMinutes()}`.slice(-2);
  const h = date.getUTCHours() || 0;
  return `${h}:${m}:${s}.${ms}`;
}

function CellName({ row, value }) {
  return (
    <span
      className={clsx(
        "flex items-center py-1",
        `pl-${3 * row.depth + (row.canExpand ? 0 : 4)}`
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
      {row.canExpand && (
        <span className="pl-2 text-gray-400 text-sm">
          ({row.original.passed} / {row.original.countTest})
        </span>
      )}
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
    const duration = subRows.reduce((acc, row) => acc + row.duration, 0);
    const passed = subRows.filter(
      ({ status }) => status === TEST_STATUS.PASSED
    ).length;
    return {
      name,
      subRows,
      status: isFailed ? TEST_STATUS.FAILED : TEST_STATUS.PASSED,
      duration,
      passed,
      countTest: subRows.length
    };
  });

export function JUnitTable({ suites, onSelectTestCase, hidePassing }) {
  const data = useMemo(
    () =>
      suites.map((suite) => {
        const subRows = groupTestsByClassname(suite.tests);
        const passed = suite.tests.filter(
          ({ status }) => status === TEST_STATUS.PASSED
        ).length;
        return {
          ...suite,
          subRows,
          status: suite.failed ? TEST_STATUS.FAILED : TEST_STATUS.PASSED,
          countTest: suite.tests.length,
          passed
        };
      }),
    [suites]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setFilter,
    prepareRow
  } = useTable({ columns, data }, useFilters, useSortBy, useExpanded);

  useEffect(() => {
    setFilter("status", hidePassing ? TEST_STATUS.FAILED : null);
  }, [hidePassing]);

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
                    className: "font-light text-left px-2"
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
                const cellProps = cell.getCellProps({ className: "px-2" });
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

JUnitTable.propTypes = {
  suites: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      passed: PropTypes.number,
      failed: PropTypes.number,
      duration: PropTypes.number,
      tests: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          classname: PropTypes.string,
          duration: PropTypes.number,
          status: PropTypes.string
        })
      )
    })
  ).isRequired,
  onSelectTestCase: PropTypes.func,
  hidePassing: PropTypes.bool
};

JUnitTable.defaultProps = {
  onSelectTestCase: () => {},
  hidePassing: true
};
