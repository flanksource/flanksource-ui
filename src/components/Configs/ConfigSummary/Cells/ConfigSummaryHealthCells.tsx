import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import { Status } from "@flanksource-ui/components/Status";
import { CellContext } from "@tanstack/react-table";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

// Order health keys by severity (healthy, unhealthy, warning, unknown)
const healthOrder = ["healthy", "unhealthy", "warning", "unknown"];

function orderByHealth(entries: [string, number][]): [string, number][] {
  return entries.sort((a, b) => {
    const indexA = healthOrder.indexOf(a[0]);
    const indexB = healthOrder.indexOf(b[0]);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export function ConfigSummaryHealthCell({
  getValue,
  row
}: CellContext<ConfigSummary, any>) {
  const [searchParams] = useSearchParams();

  const value = getValue<ConfigSummary["health"]>();
  const type = row.original.type;
  const groupBy = searchParams.get("groupBy");

  const urlBase = useMemo(() => {
    if (groupBy) {
      return `/catalog?groupBy=${groupBy}&configType=${type}`;
    }
    return `/catalog?configType=${type}`;
  }, [groupBy, type]);

  const statusItems = useMemo(() => {
    return orderByHealth(Object.entries(value ?? {})).map(([key, count]) => ({
      key,
      count,
      url: `${urlBase}&health=${key}:1`
    }));
  }, [urlBase, value]);

  if (!value) {
    return null;
  }

  return (
    <div
      className="flex flex-row flex-wrap items-center gap-1"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {statusItems.map((item) => (
        <Link key={item.key} to={item.url}>
          <Status status={item.key} count={item.count} />
        </Link>
      ))}
    </div>
  );
}

export function ConfigSummaryHealthAggregateCell({
  row
}: CellContext<ConfigSummary, any>) {
  const value = row.subRows.reduce(
    (acc, row) => {
      const health = row.original.health;
      if (health) {
        Object.entries(health).forEach(([key, value]) => {
          acc[key] = (acc[key] || 0) + value;
        });
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const statusItems = useMemo(() => {
    return orderByHealth(Object.entries(value ?? {})).map(([key, count]) => ({
      key,
      count
    }));
  }, [value]);

  if (!value || Object.keys(value).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap items-center gap-1">
      {statusItems.map((item) => (
        <Status key={item.key} status={item.key} count={item.count} />
      ))}
    </div>
  );
}
