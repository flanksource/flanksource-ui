import { ConfigSummary } from "@flanksource-ui/api/types/configs";

import { CellContext } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getConfigStatusColor } from "../ConfigSummaryList";
import {
  Count,
  CountBar,
  OrderByColor
} from "@flanksource-ui/ui/Icons/ChangeCount";

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
    const data: Count[] = Object.entries(value ?? {}).map(([key, value]) => {
      return {
        count: value,
        label: value,
        url: `${urlBase}&health=${key}:1`,
        color: getConfigStatusColor({
          [key]: value
        } as ConfigSummary["health"])
      };
    });
    return data;
  }, [urlBase, value]);

  if (!value) {
    return null;
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <CountBar items={OrderByColor(statusLines)} barStyle="RAG" />
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

  const statusLines = useMemo(() => {
    const data: Count[] = Object.entries(value ?? {}).map(([key, value]) => {
      return {
        count: value.toString(),
        color: getConfigStatusColor({
          [key]: value
        } as ConfigSummary["health"])
      };
    });
    return data;
  }, [value]);

  if (!value) {
    return null;
  }
  return <CountBar items={OrderByColor(statusLines)} barStyle="RAG" />;
}
