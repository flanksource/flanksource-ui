import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useSearchParams } from "react-router-dom";
import { useSortBy, useTable, useGroupBy, useExpanded } from "react-table";
import { Badge } from "../Badge";

const tableStyles = {
  tableClass: "table-auto w-full",
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
  groupBy,
  hiddenColumns,
  className,
  usageSection,
  ...rest
}) => {
  const [queryParams, setQueryParams] = useSearchParams({
    sortBy: "",
    sortOrder: ""
  });

  const sortField = queryParams.get("sortBy");
  const isSortOrderDesc =
    queryParams.get("sortOrder") === "desc" ? true : false;

  const setSortBy = (field, order) => {
    if (field === undefined && order === undefined) {
      queryParams.delete("sortBy");
      queryParams.delete("sortOrder");
    } else {
      queryParams.set("sortBy", field);
      queryParams.set("sortOrder", order);
    }
    setQueryParams(queryParams);
  };

  const sortBy = useMemo(() => {
    const data = sortField
      ? [
          {
            id: sortField,
            desc: isSortOrderDesc
          }
        ]
      : [];
    if (sortField === "config_type" && usageSection === "config-list") {
      data.push({
        id: "name",
        desc: isSortOrderDesc
      });
    }
    return data;
  }, [sortField, isSortOrderDesc, usageSection]);

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
      setSortBy();
    } else if (!isSorted) {
      setSortBy(id, "asc");
    } else {
      setSortBy(id, "desc");
    }
  };

  const isGrouped = !!groupBy?.length;

  useEffect(() => {
    tableInstance.setGroupBy(Array.isArray(groupBy) ? groupBy : []);
  }, [groupBy, tableInstance]);

  useEffect(() => {
    tableInstance.setSortBy(Array.isArray(sortBy) ? sortBy : []);
  }, [sortBy, tableInstance]);

  return (
    <div
      className={clsx("flex flex-col flex-1 overflow-y-auto", className)}
      {...rest}
    >
      <table
        className={clsx(tableStyles.tableClass, stickyHead && "relative")}
        style={tableStyle}
        {...getTableProps()}
      >
        <thead className={`bg-white ${stickyHead ? "sticky top-0 z-01" : ""}`}>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, colIndex) =>
                // First column goes inside the grouping column
                // Hence the label for that is not needed
                isGrouped && !column.isGrouped && colIndex === 1 ? null : (
                  <th
                    key={column.Header}
                    className={`${tableStyles.theadHeaderClass}${
                      column.canSort ? " cursor-pointer" : ""
                    }`}
                    onClick={() => setHeaderClickHandler(column)}
                    {...column.getHeaderProps()}
                  >
                    <div className={"flex select-none"}>
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
                )
              )}
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
                {row.cells.map((cell, cellIndex) =>
                  cell.isPlaceholder ? null : cell.isAggregated &&
                    cellIndex === 1 ? null : (
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
                            className={`duration-200 mr-2 ${
                              row.isExpanded ? "rotate-90" : ""
                            }`}
                          >
                            <IoChevronForwardOutline />
                          </div>
                          <div className="shrink-0">{cell.render("Cell")}</div>
                          <div className="ml-1 flex items-center">
                            <Badge
                              className="ml-1"
                              colorClass="bg-gray-200 text-gray-800"
                              roundedClass="rounded-xl"
                              text={row?.subRows.length}
                              size="xs"
                            />
                          </div>
                        </div>
                      ) : cell.isAggregated ? (
                        cell.render("Aggregated")
                      ) : (
                        <div
                          // First column should be displaced if the table
                          // is grouped
                          className={`${
                            isGrouped && !row?.subRows.length && cellIndex === 1
                              ? "pl-12"
                              : ""
                          }`}
                        >
                          {cell.render("Cell")}
                        </div>
                      )}
                    </td>
                  )
                )}
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
