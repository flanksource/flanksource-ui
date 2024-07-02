import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { BiLabel } from "react-icons/bi";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import ConfigListCostCell from "../ConfigList/Cells/ConfigListCostCell";
import ConfigListDateCell from "../ConfigList/Cells/ConfigListDateCell";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import ConfigInsightsIcon from "../Insights/ConfigInsightsIcon";
import {
  ConfigSummaryHealthAggregateCell,
  ConfigSummaryHealthCell
} from "./Cells/ConfigSummaryHealthCells";
import ChangeCount, { CountBar } from "@flanksource-ui/ui/Icons/ChangeCount";

export function getConfigStatusColor(health?: ConfigSummary["health"]) {
  if (!health) {
    return "bg-gray-400/80";
  }
  if (health.healthy && health.healthy > 0) {
    return "bg-green-500/60";
  }
  if (health.unhealthy && health.unhealthy > 0) {
    return "bg-red-500/50";
  }
  if (health.warning && health.warning > 0) {
    return "bg-orange-400/60";
  }
  return "bg-gray-500/40";
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
        <div className="flex flex-row items-center gap-1">
          <span className="pl-1">{value}</span>
          <Badge text={configCount} />
        </div>
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
      <CountBar
        iconClass="px-1  bg-zinc-100"
        items={Object.entries(value).map(([key, value]) => {
          return {
            count: value,
            icon: (
              <ConfigInsightsIcon
                size={20}
                analysis={{
                  analysis_type: key,
                  severity: ""
                }}
              />
            )
          };
        })}
      />
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
      return <ChangeCount count={value} />;
    },
    size: 40
  },
  {
    header: "Health",
    accessorKey: "health",
    minSize: 50,
    maxSize: 100,
    cell: ConfigSummaryHealthCell,
    aggregatedCell: ConfigSummaryHealthAggregateCell
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
};

export default function ConfigSummaryList({
  data,
  isLoading = false,
  groupBy = ["type"]
}: ConfigSummaryListProps) {
  const [params, setParams] = useSearchParams();

  const groupByTags = useMemo(() => {
    const groupByProp = params.get("groupBy") ?? undefined;
    if (!groupByProp) {
      return [];
    }
    return groupByProp
      .split(",")
      .filter((group) => group.includes("__tag"))
      .map((group) => group.replace("__tag", ""));
  }, [params]);

  const handleRowClick = useCallback(
    (row: Row<ConfigSummary>) => {
      if (groupBy.includes("type")) {
        const { type } = row.original;
        params.set("configType", type);
      }
      const tags = groupBy
        .filter(
          (column) =>
            column !== "type" && column !== "health" && column !== "status"
        )
        .filter((column) => row.original[column as keyof ConfigSummary]);
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
      } satisfies ColumnDef<ConfigSummary>;
    });
    return [...newColumns, ...configSummaryColumns];
  }, [groupBy, groupByTags]);

  const [sortState, updateSortState] = useReactTableSortState();

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
      enableServerSideSorting
      onTableSortByChanged={updateSortState}
      tableSortByState={sortState}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      className="max-w-full overflow-x-auto table-fixed table-auto"
      savePreferences={false}
    />
  );
}
