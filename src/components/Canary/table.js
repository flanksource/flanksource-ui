import React, { useEffect, useMemo, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { IoChevronForwardOutline } from "react-icons/io5";
import { useTable, useSortBy, useExpanded } from "react-table";
import { getAggregatedGroupedChecks } from "./aggregate";
import { GetName } from "./data";
import { getGroupedChecks } from "./grouping";
import { Duration, Percentage, Title } from "./renderers";
import {
  getHealthPercentageScore,
  getLatency,
  getUptimeScore
} from "./sorting";
import { StatusList } from "./status";
import { decodeUrlSearchParams, encodeObjectToUrlSearchParams } from "./url";
import { Badge } from "../Badge";
import style from "./index.module.css";

const styles = {
  outerDivClass: "border-l border-r border-gray-300",
  topBgClass: "bg-red-500",
  tableClass: "min-w-full  border-separate",
  theadClass: "sticky top-11 bg-white z-10",
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

function ExpandArrow({ row }) {
  return row.canExpand ? (
    <div className={styles.expandArrowIconClass}>
      <div
        className={`transform duration-200 ${
          row.isExpanded ? "rotate-90" : ""
        }`}
      >
        <IoChevronForwardOutline />
      </div>
    </div>
  ) : null;
}

function TitleCell({ row }) {
  return (
    <div className={style.checkTitleRow}>
      <span
        className="flex flex-row items-center"
        style={{
          paddingLeft: `${row.depth * 1.1}rem`
        }}
      >
        <Title check={row.original} />
        {row.canExpand && row.subRows && row.subRows.length > 1 && (
          <span className="ml-1 flex items-center">
            <Badge
              className="ml-1"
              colorClass="bg-gray-200 text-gray-800"
              roundedClass="rounded-xl"
              text={row.subRows.length}
              size="xs"
            />
          </span>
        )}
        {row.showNamespaceTags && row.original.namespaces ? (
          <>
            <Badge
              className="ml-2"
              text={`${row.original.namespaces[0]}${
                row.original.namespaces.length > 1 ? ", ..." : ""
              }`}
              title={
                row.original.namespaces.length > 1
                  ? row.original.namespaces.join(", ")
                  : null
              }
              size="xs"
            />
          </>
        ) : row.original.namespace ? (
          <Badge className="ml-2" text={row.original.namespace} size="xs" />
        ) : null}
      </span>
    </div>
  );
}

function HealthCell({ value }) {
  return <StatusList checkStatuses={value} />;
}

function UptimeCell({ value }) {
  return (
    <Percentage upper={value.passed + value.failed} lower={value.passed} />
  );
}

function LatencyCell({ value }) {
  return <Duration ms={value.rolling1h} />;
}

function getChecksHeaderTitle() {
  const { groupBy } = decodeUrlSearchParams(window.location.search);
  return `Checks ${groupBy !== "no-group" ? `(Grouped by ${groupBy})` : ""}`;
}

const columnsKeyed = {
  expander: {
    id: "expander",
    Cell: ExpandArrow,
    cellClass: ""
  },
  name: {
    Header: getChecksHeaderTitle,
    accessor: "name",
    cellClass: `px-5 py-2 w-full max-w-0 overflow-hidden overflow-ellipsis relative`,
    Cell: TitleCell,
    sortType: (a, b) =>
      // case insensitive name sorting
      a.values.name?.toLowerCase() < b.values.name?.toLowerCase() ? -1 : 1
  },
  health: {
    Header: "Health",
    accessor: "checkStatuses",
    Cell: HealthCell,
    cellClass: "px-5 py-2",
    sortType: (a, b) =>
      getHealthPercentageScore(a.values) < getHealthPercentageScore(b.values)
        ? 1
        : -1
  },
  uptime: {
    Header: "Uptime",
    accessor: "uptime",
    Cell: UptimeCell,
    cellClass: "px-5 py-2",
    sortType: (a, b) =>
      getUptimeScore(a.values) < getUptimeScore(b.values) ? 1 : -1
  },
  latency: {
    Header: "Latency",
    accessor: "latency",
    Cell: LatencyCell,
    cellClass: "px-5 py-2",
    sortType: (a, b) => (getLatency(a.values) < getLatency(b.values) ? -1 : 1)
  }
};

export function CanaryTable({
  checks,
  labels,
  history,
  onCheckClick,
  selectedTab,
  showNamespaceTags,
  ...rest
}) {
  const searchParams = window.location.search;
  const { groupBy } = decodeUrlSearchParams(searchParams);

  const [tableData, setTableData] = useState(checks);

  // update table data if searchParam or check data changes
  useEffect(() => {
    setTableData(
      groupBy !== "no-group"
        ? Object.values(
            getAggregatedGroupedChecks(
              getGroupedChecks(checks, groupBy),
              selectedTab || null
            )
          )
        : checks
    );
  }, [searchParams, checks, groupBy, selectedTab]);

  const data = useMemo(
    () =>
      tableData.map((check) => ({
        ...check,
        name: GetName(check)
      })),
    [tableData]
  );

  const columns = useMemo(() => Object.values(columnsKeyed), []);

  return (
    <Table
      data={data}
      columns={columns}
      labels={labels}
      history={history}
      onUnexpandableRowClick={onCheckClick}
      hasGrouping={groupBy !== "no-group"}
      showNamespaceTags={showNamespaceTags}
      {...rest}
    />
  );
}

export function Table({
  data,
  columns,
  labels,
  history,
  hasGrouping = false,
  onUnexpandableRowClick,
  showNamespaceTags,
  ...rest
}) {
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
      autoResetExpanded: false
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
        <thead className={styles.theadClass}>
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
          {rows.map((row) => {
            prepareRow(row);
            row.showNamespaceTags = showNamespaceTags;
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
    </div>
  );
}
