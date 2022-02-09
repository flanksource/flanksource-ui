import React, { useCallback, useMemo, useState } from "react";
import Convert from "ansi-to-html";
import DOMPurify from "dompurify";
import { isArray } from "lodash";
import dayjs from "dayjs";
import { useTable } from "react-table";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "../../Modal";
import { ListBoxLogs } from "./ListBoxLogs";

const convert = new Convert();

export function LogsTable({ logs, actions = [] }) {
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
  const [selectedList, setSelectedList] = useState([]);
  const [isModal, setIsModal] = useState(false);

  const handleSelect = useCallback((log, selected) => {
    if (selected) {
      setSelectedList((prevState) => [...prevState, log]);
    } else {
      setSelectedList((prevState) => prevState.filter((obj) => log !== obj));
    }
  }, []);
  const columns = useMemo(
    () => [
      {
        Header: "Time",
        accessor: "timestamp",
        Cell: ({ cell: { value, row } }) => (
          <div className="flex">
            <div className="border-gray-100 ">
              <input
                type="checkbox"
                className="focus:ring-indigo-400 h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
                onChange={(e) => {
                  handleSelect(row.values, e.target.checked);
                }}
                checked={selectedList.indexOf(row.values) >= 0}
              />
            </div>

            {dayjs(value).format("MMM DD, YYYY HH:mm.ss.mmm")}
          </div>
        )
      },
      {
        Header: "Message",
        accessor: "message",
        Cell: ({ cell: { value } }) => (
          <div
            className=""
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(convert.toHtml(value || ""))
            }}
          />
        )
      }
    ],
    [handleSelect, selectedList]
  );
  const data = useMemo(() => logs, [logs]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data
    });
  return (
    <>
      <div className="mx-auto flex flex-col justify-center relative">
        {actions.length >= 0 && (
          <div
            className="flex justify-between items-center overflow-y-hidden mb-4"
            style={{
              maxHeight: selectedList.length > 0 ? "100px" : "0px",
              transition: "max-height 0.25s  ease-in-out"
            }}
          >
            <div>
              {selectedList.length > 0 && (
                <span className="text-sm text-gray-400">
                  {selectedList.length} selected
                </span>
              )}
            </div>

            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                disabled={!(selectedList.length > 0)}
                onClick={() => action.handler(selectedList)}
                className={`${selectedList.length > 0
                  ? "text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  : "text-gray-400 bg-gray-200"
                  } inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        <div className="pb-12">
          <div className="flex flex-col">
            <div className="align-middle inline-block min-w-full">
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
                      <th className="py-0.75 text-right">
                        <button
                          className="bg-dark-blue text-white text-sm leading-4 font-medium px-3.5 py-2 mr-2 rounded-6px"
                          type="button"
                          onClick={() => setIsModal(true)}
                        >
                          Create new hypothesis
                        </button>
                      </th>
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr key={uuidv4()} {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            key={uuidv4()}
                            className="pl-6 border-b py-4 text-darker-black text-sm text-left"
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                        <td className="pl-6 border-b" />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Modal
                open={isModal}
                onClose={() => setIsModal(false)}
                cardClass="w-full overflow-y-auto"
                contentClass="h-full p-10"
                cardStyle={{
                  maxWidth: "392px",
                  maxHeight: "356px"
                }}
                closeButtonStyle={{ padding: "2.2rem 2.1rem 0 0" }}
                hideActions
              >
                <div className="">
                  <h3 className="pb-4 text-darkest-gray text-2xl font-semibold">
                    Сhoose incident
                  </h3>
                  <div className="my-4">
                    <p className="text-left text-sm font-medium text-darkest-gray">
                      Choose incident
                    </p>
                    <ListBoxLogs
                      items={[
                        { name: "Add new incident", id: uuidv4() },
                        { name: "Arlene Mccoy", id: uuidv4() },
                        { name: "Devon Webb", id: uuidv4() },
                        { name: "Tom Cook", id: uuidv4() }
                      ]}
                    />
                  </div>
                  <p className="text-left text-sm font-medium text-darkest-gray">
                    Choose hypothesis
                  </p>
                  <div className="my-4">
                    <ListBoxLogs
                      items={[
                        { name: "Add new incident", id: uuidv4() },
                        { name: "Arlene Mccoy", id: uuidv4() },
                        { name: "Devon Webb", id: uuidv4() },
                        { name: "Tom Cook", id: uuidv4() }
                      ]}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="bg-dark-blue text-white rounded-6px py-2 px-4"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </Modal>
              {/* <table */}
              {/*  className="min-w-full divide-y divide-gray-300 border-separate" */}
              {/*  style={{ borderSpacing: "0px" }} */}
              {/* > */}
              {/*  <thead className="sticky top-0 bg-white"> */}
              {/*    <tr> */}
              {/*      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300 pr-5"> */}
              {/*        Time */}
              {/*      </th> */}
              {/*      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300"> */}
              {/*        Message */}
              {/*      </th> */}
              {/*    </tr> */}
              {/*  </thead> */}
              {/*  <tbody */}
              {/*    className="bg-white divide-y divide-gray-300" */}
              {/*    style={{ fontSize: "0.75rem", lineHeight: "0.9rem" }} */}
              {/*  > */}
              {/*    {logs.map((row, idx) => ( */}
              {/*      // eslint-disable-next-line react/no-array-index-key */}
              {/*      <tr key={idx}> */}
              {/*        /!* {actions.length >= 0 && ( *!/ */}
              {/*        /!*  <td className="border-b border-gray-100 "> *!/ */}
              {/*        /!*    <input *!/ */}
              {/*        /!*      type="checkbox" *!/ */}
              {/*        /!*      className="focus:ring-indigo-400 h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2" *!/ */}
              {/*        /!*      onChange={(e) => *!/ */}
              {/*        /!*        handleSelect(row, e.target.checked) *!/ */}
              {/*        /!*      } *!/ */}
              {/*        /!*      checked={selectedList.indexOf(row) >= 0} *!/ */}
              {/*        /!*    /> *!/ */}
              {/*        /!*  </td> *!/ */}
              {/*        /!* )} *!/ */}
              {/*        <td */}
              {/*          className="border-b border-gray-100 no-wrap py-1 flex flex-row" */}
              {/*          style={{ whiteSpace: "nowrap" }} */}
              {/*        > */}
              {/*          <input */}
              {/*            type="checkbox" */}
              {/*            className="focus:ring-indigo-400 h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2" */}
              {/*            onChange={(e) => handleSelect(row, e.target.checked)} */}
              {/*            checked={selectedList.indexOf(row) >= 0} */}
              {/*          /> */}
              {/*          <p> */}
              {/*            {dayjs(row.timestamp).format( */}
              {/*              "MMM DD, YYYY HH:mm.ss.mmm" */}
              {/*            )} */}
              {/*          </p> */}
              {/*        </td> */}
              {/*        <td */}
              {/*          className="border-b border-gray-100" */}
              {/*          // eslint-disable-next-line react/no-danger */}
              {/*          dangerouslySetInnerHTML={{ */}
              {/*            __html: DOMPurify.sanitize( */}
              {/*              convert.toHtml(row.message ? row.message : "") */}
              {/*            ) */}
              {/*          }} */}
              {/*        /> */}
              {/*      </tr> */}
              {/*    ))} */}
              {/*  </tbody> */}
              {/* </table> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
