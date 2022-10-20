import clsx from "clsx";
import { useMemo } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useSortBy, useTable, useGroupBy, useExpanded } from "react-table";

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
  setSortOptions,
  sortBy,
  groupBy,
  hiddenColumns,
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
        }),
        ...(groupBy && {
          groupBy: groupBy
        }),
        ...(hiddenColumns && {
          hiddenColumns: hiddenColumns
        })
      },
      useControlledState: (state) => {
        return useMemo(() => {
          return {
            ...state,
            ...(sortBy && {
              sortBy: sortBy
            }),
            ...(groupBy && {
              groupBy: groupBy
            }),
            ...(hiddenColumns && {
              hiddenColumns: hiddenColumns
            })
          };
        }, [state]);
      }
    },
    useGroupBy,
    useSortBy,
    useExpanded
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const setHeaderClickHandler = (column) => {
    if (!column.canSort) return;
    const { isSorted, isSortedDesc, id } = column;
    if (isSorted && isSortedDesc) {
      setSortOptions();
    } else if (!isSorted) {
      setSortOptions(id, "asc");
    } else {
      setSortOptions(id, "desc");
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto" {...rest}>
      <table
        className={clsx(tableStyles.tableClass, stickyHead && "relative")}
        style={tableStyle}
        {...getTableProps()}
      >
        <thead className={`bg-white ${stickyHead ? "sticky top-0" : ""}`}>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  key={column.Header}
                  className={tableStyles.theadHeaderClass}
                  onClick={() => setHeaderClickHandler(column)}
                  {...column.getHeaderProps()}
                >
                  <div className="flex select-none">
                    {column.render("Header")}
                    {column.isSorted ? (
                      <span className="ml-2">
                        {column.isSortedDesc ? (
                          <TiArrowSortedDown />
                        ) : (
                          <TiArrowSortedUp />
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
                onClick={
                  row.isGrouped
                    ? () => row.toggleRowExpanded(!row.isExpanded)
                    : handleRowClick
                    ? () => handleRowClick(row)
                    : () => {}
                }
              >
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.Header}
                    className={`${tableStyles.tbodyDataClass} ${
                      cell.column.cellClass || ""
                    }`}
                    {...cell.getCellProps()}
                  >
                    {cell.isGrouped ? (
                      <div className="flex items-center">
                        <div
                          className={`transform duration-200 ${
                            row.isExpanded ? "rotate-90" : ""
                          }`}
                        >
                          <IoChevronForwardOutline />
                        </div>
                        {cell.render("Cell")}
                      </div>
                    ) : cell.isAggregated ? (
                      cell.render("Aggregated")
                    ) : cell.isPlaceholder ? null : (
                      cell.render("Cell")
                    )}
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
