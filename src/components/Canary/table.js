import React, { useEffect, useMemo, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useTable, useSortBy, useExpanded } from "react-table";
import { getAggregatedGroupedChecks } from "./aggregate";
import { getGroupedChecks } from "./grouping";
import { getColumns, makeColumnsForPivot } from "./Columns";
import { decodeUrlSearchParams, encodeObjectToUrlSearchParams } from "./url";
import { columnObject, firstColumns } from "./Columns/columns";
import { prepareRows } from "./Rows/lib";
import { useCheckSetEqualityForPreviousVsCurrent } from "../Hooks/useCheckSetEqualityForPreviousVsCurrent";

const styles = {
  outerDivClass: "border-l border-r border-gray-300",
  topBgClass: "bg-red-500",
  tableClass: "min-w-full border-separate shadow-lg bg-white rounded-lg",
  theadClass: "bg-white z-10",
  theadRowClass: "z-10",
  theadHeaderClass:
    "px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300",
  tbodyClass: "mt-4 rounded-md",
  tbodyRowClass: "border cursor-pointer",
  tbodyRowExpandableClass: "cursor-pointer",
  tbodyDataClass: "whitespace-nowrap border-gray-300 border-b",
  expandArrowIconClass: "ml-6 flex"
};

const sortByValidValues = new Map([
  ["name", null],
  ["checkStatuses", null],
  ["uptime", null],
  ["latency", null]
]);

export function CanaryTable({
  checks,
  labels,
  history,
  onCheckClick,
  showNamespaceTags,
  hideNamespacePrefix,
  groupSingleItems = true,
  theadStyle = {},
  ...rest
}) {
  const searchParams = window.location.search;
  const {
    groupBy,
    pivotBy,
    pivotCellType,
    pivotLabel: pivotLookup
  } = decodeUrlSearchParams(searchParams);
  const [tableData, setTableData] = useState(checks);

  // update table data if searchParam or check data changes
  useEffect(() => {
    setTableData(
      groupBy !== "no-group"
        ? Object.values(
            getAggregatedGroupedChecks(
              getGroupedChecks(checks, groupBy),
              groupSingleItems
            )
          )
        : checks
    );
  }, [searchParams, checks, groupBy, groupSingleItems]);

  const { rows, meta } = useMemo(
    () => prepareRows({ tableData, hideNamespacePrefix, pivotBy, pivotLookup }),
    [hideNamespacePrefix, tableData, pivotBy, pivotLookup]
  );

  const isNewPivotSet = useCheckSetEqualityForPreviousVsCurrent(meta.pivotSet);

  const shouldPivot =
    pivotCellType != null &&
    pivotCellType !== "" &&
    pivotBy != null &&
    pivotBy !== "none";

  const columns = useMemo(() => {
    if (shouldPivot) {
      return makeColumnsForPivot({
        pivotSet: meta.pivotSet,
        pivotCellType,
        firstColumns
      });
    }
    return getColumns({
      columnObject,
      pivotCellType: null
    });
    // isNewPivotSet checks the old pivotSet against the new on, so it's a much better test
    // than 'meta.pivotSet', which will probably be referentially new on every fetch of data.
    // Testing the set directly meant we won't have to rebuild the columns, which is predicted to
    // be an expensive operation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pivotCellType, isNewPivotSet, pivotBy, pivotLookup]);

  return (
    <Table
      data={rows}
      columns={columns}
      labels={labels}
      history={history}
      pivotCellType={shouldPivot ? pivotCellType : null}
      onUnexpandableRowClick={onCheckClick}
      hasGrouping={groupBy !== "no-group"}
      showNamespaceTags={showNamespaceTags}
      hideNamespacePrefix={hideNamespacePrefix}
      theadStyle={theadStyle}
      {...rest}
    />
  );
}

export function Table({
  data,
  columns,
  labels,
  history,
  pivotCellType,
  hasGrouping = false,
  onUnexpandableRowClick,
  showNamespaceTags = false,
  hideNamespacePrefix = false,
  theadStyle = {},
  ...rest
}) {
  const rowFinder = (row) => {
    const rowValues =
      row?.pivoted === true ? row[row.valueLookup] ?? null : row;
    return rowValues?.subRows || [];
  };

  const {
    state: tableState,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setSortBy,
    prepareRow,
    toggleHideColumn,
    toggleRowExpanded
  } = useTable(
    {
      columns,
      data,
      disableMultiSort: true,
      autoResetSortBy: false,
      autoResetExpanded: false,
      getSubRows: rowFinder,
      useControlledState: (state) =>
        useMemo(
          () => ({
            ...state,
            pivotCellType
          }),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [state, pivotCellType]
        )
    },
    useSortBy,
    useExpanded
  );

  const tableSortState = tableState?.sortBy;

  // Hide expander column if there is no grouping
  useEffect(() => {
    toggleHideColumn("expander", !hasGrouping);
  }, [hasGrouping, toggleHideColumn]);

  // Set table's sort state according to url params on page load or url change
  useEffect(() => {
    const searchParams = window.location.search;
    const decodedParams = decodeUrlSearchParams(searchParams);
    const { sortBy, sortDesc } = decodedParams;

    // check for validity, else reset to default values
    const sortByChecked = sortByValidValues.has(sortBy) ? sortBy : "name";
    const sortDescChecked = typeof sortDesc === "boolean" ? sortDesc : false;

    setSortBy([{ id: sortByChecked, desc: sortDescChecked }]);
  }, [setSortBy]);

  // Table-state changes will trigger url changes
  useEffect(() => {
    const updateURLBySortState = (sortBy, sortDesc) => {
      const searchParams = window.location.search;
      const decodedParams = decodeUrlSearchParams(searchParams);

      // check for validity, else reset to default values
      const sortByChecked = sortByValidValues.has(sortBy) ? sortBy : "name";
      const sortDescChecked = typeof sortDesc === "boolean" ? sortDesc : false;

      const newFormState = {
        ...decodedParams,
        sortBy: sortByChecked,
        sortDesc: sortDescChecked
      };
      const encoded = encodeObjectToUrlSearchParams(newFormState);
      if (window.location.search !== `?${encoded}`) {
        history.push(`${window.location.pathname}?${encoded}`);
      }
    };

    if (tableSortState.length > 0) {
      updateURLBySortState(tableSortState[0].id, tableSortState[0].desc);
    }
  }, [tableSortState, history]);

  return (
    <div className={styles.outerDivClass} {...rest}>
      <div className={styles.topBgClass} />
      <table
        className={styles.tableClass}
        style={{ borderSpacing: "0" }}
        {...getTableProps()}
      >
        <thead className={styles.theadClass} style={theadStyle}>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              className={styles.theadRowClass}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  key={column.Header}
                  className={styles.theadHeaderClass}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  // Table header onClick sorting override:
                  // sortDesc cannot be null, only either true/false
                  onClick={() =>
                    column.toggleSortBy(
                      column.isSortedDesc != null ? !column.isSortedDesc : false
                    )
                  }
                >
                  <div className="flex select-none">
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TiArrowSortedUp />
                        ) : (
                          <TiArrowSortedDown />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tbodyClass} {...getTableBodyProps()}>
          {rows.length > 0 &&
            rows.map((row) => {
              prepareRow(row);
              row.showNamespaceTags = showNamespaceTags;
              row.hideNamespacePrefix = hideNamespacePrefix;
              return (
                <tr
                  key={row.id}
                  className={`${styles.tbodyRowClass} ${
                    row.canExpand ? styles.tbodyRowExpandableClass : ""
                  }`}
                  style={{}}
                  onClick={
                    row.canExpand
                      ? () => toggleRowExpanded(row.id)
                      : () => onUnexpandableRowClick(row.original)
                  }
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => (
                    <td
                      key={cell.column.Header}
                      className={`${styles.tbodyDataClass} ${
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
          No data available
        </div>
      )}
    </div>
  );
}
