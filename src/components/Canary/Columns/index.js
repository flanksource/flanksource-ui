import { Duration, Percentage, Title } from "../renderers";
import {
  getHealthPercentageScore,
  getLatency,
  getUptimeScore
} from "../sorting";
import { StatusList } from "../status";
import { removeNamespacePrefix } from "../utils";
import { GetName } from "../data";
import { Badge } from "../../Badge";
import style from "../index.module.css";

export function Cell({ value, row, column }) {
  if (column.id === "name") {
    return TitleCell({ row });
  }
  if (column.id === "checkStatuses") {
    return HealthCell({ value });
  }
  if (column.id === "latency") {
    return LatencyCell({ value });
  }
  if (column.id === "uptime") {
    return UptimeCell({ value });
  }
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
  let title = GetName(row.original);
  if (row.hideNamespacePrefix) {
    title = removeNamespacePrefix(title, row.original);
  }

  return (
    <div className={style.checkTitleRow}>
      <span
        className="flex flex-row items-center"
        style={{
          paddingLeft: `${row.depth * 1.1}rem`
        }}
      >
        <Title title={title} icon={row.original.icon || row.original.type} />
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
        {row.showNamespaceTags ? (
          row.original.namespaces ? (
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
          ) : row.original.namespace ? (
            <Badge className="ml-2" text={row.original.namespace} size="xs" />
          ) : null
        ) : null}
      </span>
    </div>
  );
}

export function getSortType(pivotCellTypeOrAccessor) {
  const sortTypes = {
    latency: (a, b) =>
      getLatency(a.original) < getLatency(b.original) ? -1 : 1,
    uptime: (a, b) =>
      getUptimeScore(a.original) < getUptimeScore(b.original) ? 1 : -1,
    checkStatuses: (a, b) =>
      getHealthPercentageScore(a.original) <
      getHealthPercentageScore(b.original)
        ? 1
        : -1,
    name: (a, b) => {
      const getSortString = (original) =>
        // case insensitive name sorting, with namespace as a secondary sort
        `${original.sortKey?.toLowerCase()}${original.namespace?.toLowerCase()}`;

      return getSortString(a.original) < getSortString(b.original) ? -1 : 1;
    }
  };
  return sortTypes[pivotCellTypeOrAccessor] ?? "alphanumeric";
}

export function getColumns({ columnObject, pivotCellType = null }) {
  return Object.entries(columnObject).reduce((acc, [, v], i) => {
    const { Header, accessor, cellClass, Cell: IncomingCell, id } = v;
    acc[i] = {
      ...(id != null && { id }),
      Header: Header ?? (() => null),
      ...(id == null && accessor != null && { accessor }),
      cellClass: cellClass ?? `px-5 py-2`,
      Cell: IncomingCell ?? Cell,
      sortType:
        pivotCellType != null
          ? getSortType(pivotCellType)
          : accessor != null
          ? getSortType(accessor)
          : "alphanumeric"
    };
    return acc;
  }, []);
}
