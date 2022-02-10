import React, { useMemo } from "react";
import Convert from "ansi-to-html";
import DOMPurify from "dompurify";
import { isArray } from "lodash";
import dayjs from "dayjs";
import { useTable, useRowSelect } from "react-table";
import clsx from "clsx";
import PropTypes from "prop-types";
import { IndeterminateCheckbox } from "../../IndeterminateCheckbox/IndeterminateCheckbox";

const convert = new Convert();

export const LogsTable = ({ logs, actions }) => {
  if (logs != null && !isArray(logs)) {
    try {
      logs = JSON.parse(logs);
    } catch (e) {
      console.error("cannot parse logs", logs);
      logs = [];
    }
  }
  if (logs == null) {
    logs = [];
  }
  const timestampCell = ({ cell: { row } }) => (
    <div className="min-w-max pl-6 pr-20 flex flex-row">
      <div className="mr-1.5">
        <IndeterminateCheckbox
          className="focus:ring-indigo-400 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          {...row.getToggleRowSelectedProps()}
        />
      </div>
      <p>{dayjs(row.original.timestamp).format("MMM DD, YYYY HH:mm.ss.SSS")}</p>
    </div>
  );
  const messageCell = ({ cell: { value } }) => (
    <div
      className="pl-6 pr-12"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(convert.toHtml(value || ""))
      }}
    />
  );
  const buttonHeader = () => (
    <button
      className="bg-dark-blue text-white text-sm leading-4 font-medium py-2 my-1 mr-2 rounded-6px w-44"
      type="button"
      onClick={() => {}}
    >
      Create new hypothesis
    </button>
  );

  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: "Time",
        accessor: "timestamp",
        Cell: timestampCell
      },
      {
        Header: "Message",
        accessor: "message",
        id: "message",
        Cell: messageCell
      },
      {
        Header: buttonHeader,
        id: "button"
      }
    ],
    []
  );
  const data = useMemo(() => logs, [logs]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds }
  } = useTable(
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
    <div className="mx-auto flex flex-col justify-center relative">
      {actions.length >= 0 && (
        <div
          className="flex justify-between items-center overflow-y-hidden mb-4"
          style={{
            maxHeight: Object.keys(selectedRowIds).length ? "100px" : "0px",
            transition: "max-height 0.25s  ease-in-out"
          }}
        >
          <div>
            {Object.keys(selectedRowIds).length > 0 && (
              <span className="text-sm text-gray-400">
                {Object.keys(selectedRowIds).length} selected
              </span>
            )}
          </div>

          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              disabled={!Object.keys(selectedRowIds).length}
              onClick={() => {
                action.handler(selectedFlatRows.map((d) => d.original));
              }}
              className={clsx(
                Object.keys(selectedRowIds).length > 0
                  ? "text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  : "text-gray-400 bg-gray-200",
                "inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded"
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      <div className="pb-12">
        <div className="flex flex-col">
          <div className="inline-block min-w-full">
            <table className="w-full border rounded-t-6px" {...getTableProps()}>
              <thead className="bg-lightest-gray border rounded-t-6px">
                {headerGroups.map((headerGroup) => {
                  const { key, ...restHeaderGroupProps } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...restHeaderGroupProps}>
                      {headerGroup.headers.map((column) => (
                        <th
                          key={column.id}
                          className="pl-6 text-medium-gray text-xs leading-4 font-medium tracking-wider uppercase text-left"
                          {...column.getHeaderProps()}
                        >
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
                    <tr
                      className="border-b"
                      key={row.id}
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell) => (
                        <td
                          key={cell.row.id}
                          className=" py-4 text-darker-black text-sm"
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
        </div>
      </div>
    </div>
  );
};
LogsTable.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({}))
};
LogsTable.defaultProps = {
  actions: []
};
