import React, { useMemo } from "react";
import Convert from "ansi-to-html";
import DOMPurify from "dompurify";
import { isArray } from "lodash";
import dayjs from "dayjs";
import { useTable, useRowSelect } from "react-table";
import clsx from "clsx";
import PropTypes from "prop-types";
import { BsFillBarChartFill } from "react-icons/bs";
import { IndeterminateCheckbox } from "../../IndeterminateCheckbox/IndeterminateCheckbox";

const convert = new Convert();

export const LogsTable = ({ logs, actions, variant }) => {
  if (logs != null && !isArray(logs)) {
    try {
      logs = JSON.parse(logs);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("cannot parse logs", logs);
      logs = [];
    }
  }
  if (logs == null) {
    logs = [];
  }

  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: "Time",
        accessor: "timestamp",
        Cell: function timestampCell({ cell: { row } }) {
          return (
            <div className="min-w-max flex flex-row items-center">
              {variant === "comfortable" ? (
                <div className="mr-1.5">
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
              ) : (
                <div className="mr-2.5">
                  <BsFillBarChartFill className="text-dark-blue text-base" />
                </div>
              )}
              <p>
                {dayjs(row.original.timestamp).format(
                  "MMM DD, YYYY HH:mm.ss.SSS"
                )}
              </p>
            </div>
          );
        }
      },
      {
        Header: function MessageHeader(props) {
          const { state, selectedFlatRows } = props;
          const { selectedRowIds } = state;
          return (
            <div className="flex justify-between">
              <span className="align-middle my-auto">Message</span>
              <div className="flex justify-end -m-2 flex-wrap">
                {actions.map((action) => (
                  <div key={action.label} className="p-2">
                    <button
                      type="button"
                      disabled={!Object.keys(selectedRowIds).length}
                      onClick={() => {
                        action.handler(selectedFlatRows.map((d) => d.original));
                      }}
                      className={clsx(
                        Object.keys(selectedRowIds).length === 0
                          ? "btn-disabled"
                          : "btn-primary"
                      )}
                    >
                      {action.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        },
        accessor: "message",
        id: "message",
        Cell: function messageCell({ cell: { value } }) {
          return (
            <div
              className="break-all"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(convert.toHtml(value || ""))
              }}
            />
          );
        }
      }
    ],
    [actions, variant]
  );
  const data = useMemo(() => logs, [logs]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data
      },
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => [...columns]);
      }
    );
  return (
    <div className="pb-12">
      <table
        className={clsx(
          "w-full",
          variant === "comfortable" ? "comfortable-table" : "compact-table"
        )}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td key={cell.row.id} {...cell.getCellProps()}>
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
};
LogsTable.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({})),
  variant: PropTypes.oneOf(["comfortable", "compact"])
};
LogsTable.defaultProps = {
  actions: [],
  variant: "comfortable"
};
