import { HealthCheck } from "@flanksource-ui/api/types/health";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";
import { Status } from "../../Status";
import { GetName } from "../data";
import style from "../index.module.css";
import { Duration, Percentage, StatusList, Title, empty } from "../renderers";
import { removeNamespacePrefix } from "../utils";
import {
  getHealthPercentageScore,
  getLatency,
  getUptimeScore
} from "./sorting";

export function Cell({ state, value, row, column }: any) {
  const { pivotCellType } = state;

  if (column.id === "name") {
    return TitleCell({ row } as any);
  }
  if (pivotCellType === "uptime" || column.id === "uptime") {
    if (value == null) {
      return empty;
    }
    const newValue = value?.uptime ?? value;
    return UptimeCell({ value: newValue });
  }

  if (pivotCellType === "status" || column.id === "status") {
    if (!value) {
      return empty;
    }
    if (typeof value === "object") {
      return <Status good={value.good} mixed={value.mixed} />;
    } else {
      return (
        <div className="flex items-center space-x-1">
          <Status good={value === "healthy"} />
          <LastTransitionCell
            value={row.original.last_runtime}
            min={1000 * 60 * 20 + 1}
          />
        </div>
      );
    }
  }
  if (pivotCellType === "latency" || column.id === "latency") {
    if (value == null) {
      return empty;
    }
    const newValue = value?.latency ?? value;
    return LatencyCell({ value: newValue });
  }

  if (
    pivotCellType === "last_transition_time" ||
    column.id === "last_transition_time"
  ) {
    if (value == null) {
      return empty;
    }
    const newValue = value;
    return LastTransitionCell({ value: newValue });
  }
  return null;
}

const day = 1000 * 60 * 60 * 24;
export function LastTransitionCell({
  value,
  min = 0,
  max = day * 7,
  suffix = null
}: any) {
  let diff = dayjs().diff(dayjs.utc(value));
  if (diff > max || diff <= min) {
    return null;
  }
  return (
    <>
      <span className="text-md">
        {suffix}
        {dayjs.duration(diff).humanize()}
      </span>
      <span className="text-light ml-0.5 text-xs text-gray-500">ago</span>
    </>
  );
}

export function HealthCell({ value }: any) {
  return <StatusList checkStatuses={value} />;
}

export function UptimeCell({ value }: any) {
  return (
    <Percentage upper={value.passed + value.failed} lower={value.passed} />
  );
}

export function LatencyCell({ value }: any) {
  return <Duration ms={value.p95 || value.p97 || value.p99} />;
}

type TitleCellProps = {
  hideNamespacePrefix?: boolean;
  showNamespaceTags?: boolean;
} & CellContext<HealthCheck, any>;

export function TitleCell({
  row,
  hideNamespacePrefix = false,
  showNamespaceTags = false
}: TitleCellProps) {
  const rowValues =
    (row.original as any)?.pivoted === true
      ? // @ts-expect-error
        (row.original[row.original.valueLookup] ?? null)
      : row.original;
  let title = GetName(rowValues);
  if (hideNamespacePrefix) {
    title = removeNamespacePrefix(title, rowValues);
  }
  return (
    <div className={clsx(style.checkTitleRow, "")}>
      <span
        className="flex flex-row items-center"
        // FIXME: change the width of the cells causes the columns to resize which is distracting
        // style={{
        //   paddingLeft: `${row.depth * 1.1}rem`
        // }}
      >
        <Title
          title={title}
          icon={rowValues.icon || rowValues.type}
          isDeleted={!!row.original.deleted_at}
        />

        {showNamespaceTags ? (
          rowValues.namespaces ? (
            <Badge
              className="ml-2"
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
            <Badge className="ml-2" text={rowValues.namespace} size="xs" />
          ) : null
        ) : null}
      </span>
    </div>
  );
}

function getSortString(original: any) {
  // case insensitive name sorting, with namespace as a secondary sort
  const sortString = `${original.sortKey?.toLowerCase()}${original.namespace?.toLowerCase()}`;
  return sortString;
}

function getPivotSortValueOrDefault(a: any, b: any, pivotAccessor: any) {
  if (pivotAccessor === "name") {
    const aValue =
      a.original?.pivoted === true
        ? (a?.original[a?.original?.valueLookup] ??
          a?.original?.aggregate ??
          undefined)
        : a?.original;
    const bValue =
      b?.original?.pivoted === true
        ? (b?.original[b?.original?.valueLookup] ??
          b?.original?.aggregate ??
          undefined)
        : b?.original;
    return { aValue, bValue };
  }

  const aValue =
    a.original?.pivoted === true
      ? (a.original[pivotAccessor] ?? a.original.aggregate ?? undefined)
      : a.original;
  const bValue =
    b.original?.pivoted === true
      ? (b.original[pivotAccessor] ?? b.original.aggregate ?? undefined)
      : b.original;

  return { aValue, bValue };
}

export function getSortType(pivotCellTypeOrAccessor: any, pivotAccessor: any) {
  const sortTypes: any = {
    latency: (a: any, b: any) => {
      const { aValue, bValue } = getPivotSortValueOrDefault(
        a,
        b,
        pivotAccessor
      );
      return getLatency(aValue) < getLatency(bValue) ? -1 : 1;
    },

    uptime: (a: any, b: any) => {
      const { aValue, bValue } = getPivotSortValueOrDefault(
        a,
        b,
        pivotAccessor
      );
      return getUptimeScore(aValue) < getUptimeScore(bValue) ? 1 : -1;
    },
    checkStatuses: (a: any, b: any) => {
      const { aValue, bValue } = getPivotSortValueOrDefault(
        a,
        b,
        pivotAccessor
      );
      return getHealthPercentageScore(aValue) < getHealthPercentageScore(bValue)
        ? 1
        : -1;
    },
    name: (a: any, b: any) => {
      const { aValue, bValue } = getPivotSortValueOrDefault(
        a,
        b,
        pivotAccessor
      );
      return getSortString(aValue) < getSortString(bValue) ? -1 : 1;
    }
  };
  return pivotAccessor === "name"
    ? sortTypes[pivotAccessor as any]
    : (sortTypes[pivotCellTypeOrAccessor] ?? "alphanumeric");
}

export function makeColumnsForPivot({
  pivotSet,
  pivotCellType,
  firstColumns,
  cellClass = `px-5 py-2`
}: any = {}) {
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

export function getColumns({
  columnObject,
  pivotCellType = null
}: Record<any, any>) {
  return Object.entries(columnObject).reduce((acc: any, [k, v], i) => {
    const { Header, accessor, cellClass, Cell: IncomingCell, id } = v as any;
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
      cellClass: cellClass ?? `py-2`,
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
