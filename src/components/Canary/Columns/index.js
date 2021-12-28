import {
  getHealthPercentageScore,
  getLatency,
  getUptimeScore
} from "./sorting";
import { Duration, Percentage, Title, empty, StatusList } from "../renderers";
import { removeNamespacePrefix } from "../utils";
import { GetName } from "../data";
import { Badge } from "../../Badge";

export function Cell({ state, value, row, column }) {
  const { pivotCellType } = state;

  if (column.id === "name") {
    return TitleCell({ row });
  }
  if (pivotCellType === "uptime" || column.id === "uptime") {
    if (value == null) {
      return empty;
    }
    const newValue = value?.uptime ?? value;
    return UptimeCell({ value: newValue });
  }

  if (pivotCellType === "checkStatuses" || column.id === "checkStatuses") {
    if (value == null) {
      return empty;
    }
    const newValue = value?.checkStatuses ?? value;
    return HealthCell({ value: newValue });
  }
  if (pivotCellType === "latency" || column.id === "latency") {
    if (value == null) {
      return empty;
    }
    const newValue = value?.latency ?? value;
    return LatencyCell({ value: newValue });
  }
  return null;
}

export function HealthCell({ value }) {
  return <StatusList checkStatuses={value} />;
}

export function UptimeCell({ value }) {
  return (
    <Percentage upper={value.passed + value.failed} lower={value.passed} />
  );
}

export function LatencyCell({ value }) {
  return <Duration ms={value.rolling1h} />;
}

export function TitleCell({ row }) {
  const rowValues =
    row.original?.pivoted === true
      ? row.original[row.original.valueLookup] ?? null
      : row.original;
  let title = GetName(rowValues);
  if (row.hideNamespacePrefix) {
    title = removeNamespacePrefix(title, rowValues);
  }

  return (
    <div
      className="flex flex-row items-center"
      style={{
        paddingLeft: `${row.depth * 1.1}rem`
      }}
    >
      <Title
        title={title}
        icon={rowValues.icon || rowValues.type}
        className="overflow-hidden overflow-ellipsis"
      />
      {row.canExpand && rowValues.subRows && rowValues?.subRows.length > 1 && (
        <span className="ml-1 flex items-center">
          <Badge
            className="ml-1"
            colorClass="bg-gray-200 text-gray-800"
            roundedClass="rounded-xl"
            text={rowValues?.subRows.length}
            size="xs"
          />
        </span>
      )}
      {row.showNamespaceTags ? (
        <div
          className="flex items-center ml-2"
          style={{
            position: "sticky",
            right: "-20px"
          }}
        >
          {rowValues.namespaces ? (
            <Badge
              className="z-10"
              text={`${rowValues.namespaces[0]}${
                rowValues.namespaces.length > 1 ? ", ..." : ""
              }`}
              title={
                rowValues.namespaces.length > 1
                  ? rowValues.namespaces.join(", ")
                  : null
              }
              size="xs"
            />
          ) : rowValues.namespace ? (
            <Badge className="z-10" text={rowValues.namespace} size="xs" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function getSortString(original) {
  // case insensitive name sorting, with namespace as a secondary sort
  const sortString = `${original.sortKey?.toLowerCase()}${original.namespace?.toLowerCase()}`;
  return sortString;
}

function getPivotSortValueOrDefault(a, b, pivotAccessor) {
  if (pivotAccessor === "name") {
    const aValue =
      a.original?.pivoted === true
        ? a?.original[a?.original?.valueLookup] ??
          a?.original?.aggregate ??
          undefined
        : a?.original;
    const bValue =
      b?.original?.pivoted === true
        ? b?.original[b?.original?.valueLookup] ??
          b?.original?.aggregate ??
          undefined
        : b?.original;
    return { aValue, bValue };
  }

  const aValue =
    a.original?.pivoted === true
      ? a.original[pivotAccessor] ?? a.original.aggregate ?? undefined
      : a.original;
  const bValue =
    b.original?.pivoted === true
      ? b.original[pivotAccessor] ?? b.original.aggregate ?? undefined
      : b.original;

  return { aValue, bValue };
}

export function getSortType(pivotCellTypeOrAccessor, pivotAccessor) {
  const sortTypes = {
    latency: (a, b) => {
      const { aValue, bValue } = getPivotSortValueOrDefault(
        a,
        b,
        pivotAccessor
      );
      return getLatency(aValue) < getLatency(bValue) ? -1 : 1;
    },

    uptime: (a, b) => {
      const { aValue, bValue } = getPivotSortValueOrDefault(
        a,
        b,
        pivotAccessor
      );
      return getUptimeScore(aValue) < getUptimeScore(bValue) ? 1 : -1;
    },
    checkStatuses: (a, b) => {
      const { aValue, bValue } = getPivotSortValueOrDefault(
        a,
        b,
        pivotAccessor
      );
      return getHealthPercentageScore(aValue) < getHealthPercentageScore(bValue)
        ? 1
        : -1;
    },
    name: (a, b) => {
      const { aValue, bValue } = getPivotSortValueOrDefault(
        a,
        b,
        pivotAccessor
      );
      return getSortString(aValue) < getSortString(bValue) ? -1 : 1;
    }
  };
  return pivotAccessor === "name"
    ? sortTypes[pivotAccessor]
    : sortTypes[pivotCellTypeOrAccessor] ?? "alphanumeric";
}

export function makeColumnsForPivot({
  pivotSet,
  pivotCellType,
  firstColumns,
  cellClass = `px-4 py-2`
} = {}) {
  // For syntax https://stackoverflow.com/a/26578323/15581317
  const columns = [];
  for (const [, value] of pivotSet.entries()) {
    columns[columns.length] = {
      Header: value.replace("piv0t-", ""),
      accessor: value,
      cellClass,
      Cell,
      sortType:
        pivotCellType != null
          ? getSortType(pivotCellType, value)
          : "alphanumeric"
    };
  }
  const firsts = getColumns({ columnObject: firstColumns, pivotCellType });
  return [...firsts, ...columns];
}

export function getColumns({ columnObject, pivotCellType = null }) {
  return Object.entries(columnObject).reduce((acc, [k, v], i) => {
    const { Header, accessor, cellClass, Cell: IncomingCell, id } = v;
    const pivotAccessor =
      accessor == null || typeof accessor === "function"
        ? id == null
          ? k
          : id
        : accessor;
    acc[i] = {
      ...(id != null && { id }),
      ...(id == null && typeof accessor === "function" && { id: k }),
      ...(accessor != null && { accessor }),
      Header: Header ?? (() => null),
      cellClass: cellClass ?? `px-4 py-2`,
      Cell: IncomingCell ?? Cell,
      sortType:
        pivotCellType != null
          ? getSortType(pivotCellType, pivotAccessor)
          : accessor != null
          ? getSortType(accessor, pivotAccessor)
          : "alphanumeric"
    };
    return acc;
  }, []);
}
