import Convert from "ansi-to-html";
import clsx from "clsx";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useRowSelect, useTable } from "react-table";
import { EvidenceType } from "../../../api/services/evidence";
import { AttachEvidenceDialog } from "../../AttachEvidenceDialog";
import { IndeterminateCheckbox } from "../../IndeterminateCheckbox/IndeterminateCheckbox";

const convert = new Convert();

export const LogsTable = ({ logs: logsParam, actions, variant, viewOnly }) => {
  const [attachAsAsset, setAttachAsAsset] = useState(false);
  const [lines, setLines] = useState([]);
  const logs = useMemo(() => {
    if (logsParam == null) {
      return [];
    }

    if (Array.isArray(logsParam)) {
      return logsParam;
    }

    try {
      return JSON.parse(logsParam);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("cannot parse logs", logsParam);
      return [];
    }
  }, [logsParam]);

  // TODO(ciju): fix this
  /* eslint-disable react/no-unstable-nested-components */
  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: "Time",
        accessor: "timestamp",
        Cell: function timestampCell({ cell: { row } }) {
          return (
            <div className="min-w-max flex flex-row text-left">
              {variant === "comfortable" && !viewOnly && (
                <div className="mr-1.5">
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
              )}
              <p>
                {dayjs(row.original.timestamp).format(
                  "YYYY-MM-DD HH:mm.ss.SSS"
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
          const hasSelectedRows = Object.keys(selectedRowIds).length !== 0;
          return (
            <div className="flex justify-between">
              <span className="align-middle my-auto">Message</span>
              {!viewOnly && (
                <div className="flex justify-end -m-2 flex-wrap">
                  <div className="p-2">
                    <button
                      type="button"
                      disabled={!hasSelectedRows}
                      onClick={() => {
                        setLines(selectedFlatRows.map((d) => d.original));
                        setAttachAsAsset(true);
                      }}
                      className={clsx(
                        hasSelectedRows ? "btn-primary" : "hidden"
                      )}
                    >
                      Attach as Evidence
                    </button>
                  </div>
                </div>
              )}
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
  /* eslint-enable react/no-unstable-nested-components */
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
      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        onClose={() => setAttachAsAsset(false)}
        evidence={{ lines }}
        type={EvidenceType.Log}
        callback={(success) => {
          if (success) {
            setLines([]);
          }
        }}
      />
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
                  <th
                    key={column.id}
                    {...column.getHeaderProps()}
                    className="py-2"
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
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td key={cell.row.id} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
          {!rows.length && (
            <tr>
              <td className="text-center" colSpan={columns.length}>
                There are no logs matching the search query
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
LogsTable.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({})),
  variant: PropTypes.oneOf(["comfortable", "compact", ""])
};
LogsTable.defaultProps = {
  actions: [],
  variant: "comfortable"
};
