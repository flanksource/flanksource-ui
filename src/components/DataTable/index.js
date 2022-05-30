import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useSortBy, useTable } from "react-table";

const tableStyles = {
  outerDivClass: "border border-b-0 border-gray-300",
  tableClass: "table-auto w-full",
  // theadClass: "z-10",
  theadRowClass:
    "border-b border-gray-200 rounded-t-md uppercase bg-column-background",
  theadHeaderClass:
    "px-5 py-4 text-left text-xs font-medium text-gray-500 tracking-wider",
  tbodyClass: "rounded-md",
  tbodyRowClass: "cursor-pointer text-sm",
  tbodyDataClass: "whitespace-nowrap border-gray-300 border-b p-2"
};

export const DataTable = ({
  columns,
  data,
  handleRowClick,
  tableStyle,
  isLoading,
  ...rest
}) => {
  const tableInstance = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className={tableStyles.outerDivClass} {...rest}>
      <table
        className={tableStyles.tableClass}
        style={tableStyle}
        {...getTableProps()}
      >
        <thead className={tableStyles.theadClass}>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              className={tableStyles.theadRowClass}
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
        <tbody className={tableStyles.tbodyClass} {...getTableBodyProps()}>
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
