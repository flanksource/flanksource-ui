import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import {
  StatusInfo,
  StatusLine
} from "@flanksource-ui/components/StatusLine/StatusLine";
import { CellContext } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getConfigStatusColor } from "../ConfigSummaryList";

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

  const statusLines = useMemo(() => {
    const data: StatusInfo[] = Object.entries(value ?? {}).map(
      ([key, value]) => {
        return {
          label: value,
          url: `${urlBase}&health=${key}:1`,
          color: getConfigStatusColor({
            [key]: value
          } as ConfigSummary["health"])
        };
      }
    );
    return data;
  }, [urlBase, value]);

  if (!value) {
    return null;
  }

  return (
    <div
      className="flex flex-row gap-1"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <StatusLine label="" statuses={statusLines} />
    </div>
  );
}

export function ConfigSummaryHealthAggregateCell({
  row
}: CellContext<ConfigSummary, any>) {
  const value = row.subRows.reduce((acc, row) => {
    const health = row.original.health;
    if (health) {
      Object.entries(health).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const statusLines = useMemo(() => {
    const data: StatusInfo[] = Object.entries(value ?? {}).map(
      ([key, value]) => {
        return {
          label: value.toString(),
          color: getConfigStatusColor({
            [key]: value
          } as ConfigSummary["health"])
        };
      }
    );
    return data;
  }, [value]);

  if (!value) {
    return null;
  }
  return (
    <div className="flex flex-row gap-1">
      <StatusLine label="" statuses={statusLines} />
    </div>
  );
}
