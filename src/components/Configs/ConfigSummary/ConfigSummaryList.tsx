import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import {
  StatusInfo,
  StatusLine
} from "@flanksource-ui/components/StatusLine/StatusLine";
import { Badge } from "@flanksource-ui/ui/Badge";
import { CountBadge } from "@flanksource-ui/ui/Badge/CountBadge";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { BiLabel } from "react-icons/bi";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import ConfigListCostCell from "../ConfigList/Cells/ConfigListCostCell";
import ConfigListDateCell from "../ConfigList/Cells/ConfigListDateCell";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import ConfigInsightsIcon from "../Insights/ConfigInsightsIcon";

export function getConfigStatusColor(health?: ConfigSummary["health"]) {
  if (!health) {
    return "gray";
  }
  if (health.healthy && health.healthy > 0) {
    return "green";
  }
  if (health.unhealthy && health.unhealthy > 0) {
    return "red";
  }
  if (health.warning && health.warning > 0) {
    return "orange";
  }
  return "gray";
}

function ConfigSummaryTypeCell({
  getValue,
  row
}: CellContext<ConfigSummary, unknown>) {
  const configType = getValue<ConfigSummary["type"]>();

  const configCount = row.original.count;

  const value = useMemo(() => {
    if (configType?.split("::").length === 1) {
      return configType;
    }
    return configType
      ?.substring(configType.indexOf("::") + 2)
      .replaceAll("::", " ")
      .trim();
  }, [configType]);

  return (
    <span className="flex flex-nowrap gap-1">
      <ConfigsTypeIcon config={{ type: configType }}>
        <span className="pl-1"> {value}</span>
        <Badge text={configCount} />
      </ConfigsTypeIcon>
    </span>
  );
}

function ConfigSummaryAnalysisCell({
  getValue
}: CellContext<ConfigSummary, unknown>) {
  const value = getValue<ConfigSummary["analysis"]>();
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-row gap-1 overflow-hidden truncate">
      {Object.entries(value).map(([key, value]) => {
        return (
          <div className="flex flex-row gap-0.5" key={key}>
            <span>
              <ConfigInsightsIcon
                analysis={{
                  analysis_type: key,
                  severity: value.severity
                }}
              />
            </span>
            <span>
              <CountBadge value={value} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

const configSummaryColumns: ColumnDef<ConfigSummary, any>[] = [
  {
    header: "changes",
    accessorKey: "changes",
    cell: ({ getValue }: CellContext<ConfigSummary, any>) => {
      const value = getValue();
      if (!value) {
        return null;
      }
      return <CountBadge value={value} />;
    },
    size: 40
  },
  {
    header: "Health",
    accessorKey: "health",
    minSize: 50,
    maxSize: 100,
    cell: ({ getValue }: CellContext<ConfigSummary, any>) => {
      const value = getValue<ConfigSummary["health"]>();

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const statusLines = useMemo(() => {
        const data: StatusInfo[] = Object.entries(value ?? {}).map(
          ([key, value]) => {
            return {
              label: value,
              // @ts-ignore
              color: getConfigStatusColor({
                [key]: value
              })
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
    },
    aggregatedCell: ({ row }: CellContext<ConfigSummary, any>) => {
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

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const statusLines = useMemo(() => {
        const data: StatusInfo[] = Object.entries(value ?? {}).map(
          ([key, value]) => {
            return {
              label: value.toString(),
              // @ts-ignore
              color: getConfigStatusColor({
                [key]: value
              })
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
  },
  {
    header: "analysis",
    accessorKey: "analysis",
    cell: ConfigSummaryAnalysisCell,
    minSize: 30,
    maxSize: 100
  },
  {
    header: () => <div title="Cost">Cost (30d)</div>,
    accessorKey: "cost_total_30d",
    cell: ConfigListCostCell,
    maxSize: 60
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: ConfigListDateCell<ConfigSummary>,
    aggregatedCell: "",
    maxSize: 40
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    cell: ConfigListDateCell<ConfigSummary>,
    aggregatedCell: "",
    maxSize: 40
  }
];

type ConfigSummaryListProps = {
  data: ConfigSummary[];
  isLoading?: boolean;
  groupBy?: string[];
  groupByTags?: string[];
};

export default function ConfigSummaryList({
  data,
  isLoading = false,
  groupBy = ["type"],
  groupByTags = []
}: ConfigSummaryListProps) {
  const [params, setParams] = useSearchParams();

  const handleRowClick = useCallback(
    (row: Row<ConfigSummary>) => {
      if (groupBy.includes("type")) {
        const { type } = row.original;
        params.set("configType", type);
      }
      const tags = groupBy.filter(
        (column) =>
          column !== "type" && column !== "health" && column !== "status"
      );
      if (tags.length > 0) {
        const tagsParam = tags
          .map((column) => {
            return `${column}__:__${
              row.original[column as keyof ConfigSummary]
            }`;
          })
          .join(",");
        params.set("labels", tagsParam);
      }
      params.delete("groupBy");
      setParams(params);
    },
    [groupBy, params, setParams]
  );

  const virtualColumns = useMemo(() => {
    const newColumns = groupBy.map((column) => {
      return {
        header: column.toLocaleUpperCase(),
        accessorKey: column,
        maxSize: 250,
        minSize: 100,
        aggregatedCell: ({ row }) => {
          if (row.getCanExpand()) {
            const groupingValue = row.getGroupingValue(
              row.groupingColumnId!
            ) as string;
            const count = row.subRows.reduce(
              (acc, row) => acc + row.original.count,
              0
            );
            return (
              <div
                className="flex flex-row items-center gap-1"
                style={{
                  marginLeft: row.depth * 20
                }}
              >
                {row.getIsExpanded() ? <IoChevronDown /> : <IoChevronForward />}
                {row.groupingColumnId === "type" ? (
                  <ConfigsTypeIcon config={row.original} showLabel>
                    <Badge text={count} />
                  </ConfigsTypeIcon>
                ) : (
                  <div className="flex flex-row gap-1 items-center">
                    {groupingValue ? (
                      <span>{groupingValue}</span>
                    ) : (
                      <span className="text-gray-400">(None)</span>
                    )}
                    <Badge text={count} />
                  </div>
                )}
              </div>
            );
          }
        },
        cell:
          column === "type"
            ? ConfigSummaryTypeCell
            : ({ getValue, row }: CellContext<ConfigSummary, any>) => {
                const isTag = groupByTags.includes(column);
                const value = getValue();

                return (
                  <div
                    className="flex flex-1 flex-row gap-1 items-center"
                    style={{
                      marginLeft: (row.depth + 1) * 20
                    }}
                  >
                    {isTag && <BiLabel />}
                    {value ? (
                      <span>{value}</span>
                    ) : (
                      <span className="text-gray-400">(None)</span>
                    )}
                    <Badge text={row.original.count} />
                  </div>
                );
              }
      } satisfies ColumnDef<ConfigSummary, any>;
    });
    return [...newColumns, ...configSummaryColumns];
  }, [groupBy, groupByTags]);

  return (
    <DataTable
      stickyHead
      columns={virtualColumns}
      data={data}
      // when grouping, remove the last column from the groupBy
      groupBy={
        groupBy.length > 1 ? groupBy.slice(0, groupBy.length - 1) : undefined
      }
      hiddenColumns={
        groupBy.length > 1 ? groupBy.slice(0, groupBy.length - 1) : undefined
      }
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      className="max-w-full overflow-x-auto table-fixed table-auto"
      savePreferences={false}
    />
  );
}
