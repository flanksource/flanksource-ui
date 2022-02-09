import React, { useMemo } from "react";
import Convert from "ansi-to-html";
import DOMPurify from "dompurify";
import { isArray } from "lodash";
import dayjs from "dayjs";
import { useTable, useRowSelect } from "react-table";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import PropTypes from "prop-types";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";

const convert = new Convert();

export function LogsTable({ logs, actions }) {
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
  const columns = useMemo(
    () => [
      {
        Header: "Message",
        accessor: "message",
        Cell: function dataMessage({ cell: { value } }) {
          return (
            <div
              className="pl-6"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(convert.toHtml(value || ""))
              }}
            />
          );
        }
      }
    ],
    []
  );
  const data = useMemo(() => logs, []);
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
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: "Time",
          accessor: "timestamp",
          Cell: function dataItems({ cell: { value, row } }) {
            return (
              <div className="min-w-max w-72 ml-6 flex flex-row">
                <div className="mr-1 5">
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
                <p>{dayjs(value).format("MMM DD, YYYY HH:mm.ss.mmm")}</p>
              </div>
            );
          }
        },
        ...columns
      ]);
    }
  );
  return (
    <>
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
                onClick={() =>
                  action.handler(
                    JSON.stringify(
                      {
                        selectedRowIds,
                        "selectedFlatRows[].original": selectedFlatRows.map(
                          (d) => d.original
                        )
                      },
                      null,
                      2
                    )
                  )
                }
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
              <table
                className="w-full border rounded-t-6px"
                {...getTableProps()}
              >
                <thead className="bg-lightest-gray border rounded-t-6px">
                  {headerGroups.map((headerGroup) => (
                    <tr key={uuidv4()} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          key={uuidv4()}
                          className="pl-6 text-medium-gray text-xs leading-4 font-medium tracking-wider uppercase text-left"
                          {...column.getHeaderProps()}
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                      <button
                        className="bg-dark-blue text-white text-sm leading-4 font-medium py-2 my-1 mr-2 rounded-6px w-44"
                        type="button"
                        onClick={() => {}}
                      >
                        Create new hypothesis
                      </button>
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        className="border-b"
                        key={uuidv4()}
                        {...row.getRowProps()}
                      >
                        {row.cells.map((cell) => (
                          <td
                            key={uuidv4()}
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
              {/* <pre> */}
              {/*  <code> */}
              {/*    {JSON.stringify( */}
              {/*      { */}
              {/*        selectedRowIds, */}
              {/*        "selectedFlatRows[].original": selectedFlatRows.map( */}
              {/*          (d) => d.original */}
              {/*        ) */}
              {/*      }, */}
              {/*      null, */}
              {/*      2 */}
              {/*    )} */}
              {/*  </code> */}
              {/* </pre> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
LogsTable.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({}))
};
LogsTable.defaultProps = {
  actions: []
};
