import clsx from "clsx";
import { useMemo } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useSortBy, useTable } from "react-table";

const tableStyles = {
  tableClass: "table-auto w-full border-l border-r border-b",
  theadHeaderClass: " tracking-wider",
  tbodyRowClass: "cursor-pointer text-sm",
  tbodyDataClass: "whitespace-nowrap p-2"
};

export const DataTable = ({
  columns,
  data,
  handleRowClick,
  tableStyle,
  stickyHead,
  isLoading,
  setSortBy,
  sortBy,
  ...rest
}) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      autoResetSortBy: false,
      initialState: {
        ...(sortBy && {
          sortBy: sortBy
        })
      },
      useControlledState: (state) => {
        return useMemo(() => {
          // if the sort column changes, update the url
          setSortBy(state.sortBy[0].id, state.sortBy[0].desc ? "desc" : "asc");
          return {
            ...state
          };
        }, [state]);
      }
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div {...rest}>
      <table
        className={clsx(tableStyles.tableClass, stickyHead && "relative")}
        style={tableStyle}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  key={column.Header}
                  className={tableStyles.theadHeaderClass}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <div className="flex select-none">
                    {column.render("Header")}
                    {column.isSorted ? (
                      <span className="ml-2">
                        {column.isSortedDesc ? (
                          <TiArrowSortedUp />
                        ) : (
                          <TiArrowSortedDown />
                        )}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                className={tableStyles.tbodyRowClass}
                {...row.getRowProps()}
                onClick={handleRowClick ? () => handleRowClick(row) : () => {}}
              >
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.Header}
                    className={`${tableStyles.tbodyDataClass} ${
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
      {rows.length <= 0 && (
        <div className="flex items-center justify-center py-20 px-2  border-b border-gray-300 text-center text-gray-400">
          {isLoading ? "Loading data.." : "No data available"}
        </div>
      )}
    </div>
  );
};
