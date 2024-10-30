import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import ChangeCount, { CountBar } from "@flanksource-ui/ui/Icons/ChangeCount";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { CellContext } from "@tanstack/react-table";
import { MRT_ColumnDef } from "mantine-react-table";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigListCostCell from "../ConfigList/Cells/ConfigListCostCell";
import { MRTConfigListDateCell } from "../ConfigList/Cells/ConfigListDateCell";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import ConfigInsightsIcon from "../Insights/ConfigInsightsIcon";
import {
  ConfigSummaryHealthAggregateCell,
  ConfigSummaryHealthCell
} from "./Cells/ConfigSummaryHealthCells";
import { ConfigSummaryTableVirtualAggregateColumn } from "./Cells/ConfigSummaryTableVirtualAggregateColumn";
import { ConfigSummaryVirtualColumnCell } from "./Cells/ConfigSummaryVirtualColumnCell";
import ConfigSummaryFavoriteButton from "./ConfigSummaryTypeFavorite";

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

function ConfigSummaryTypeCell({ cell, row }: MRTCellProps<ConfigSummary>) {
  const configType = cell.getValue<ConfigSummary["type"]>();

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
      <ConfigSummaryFavoriteButton configSummary={row.original}>
        <ConfigsTypeIcon config={{ type: configType }}>
          <div className="flex flex-row items-center gap-1">
            <span className="pl-1">{value}</span>
            <Badge text={configCount} />
          </div>
        </ConfigsTypeIcon>
      </ConfigSummaryFavoriteButton>
    </span>
  );
}

export function ConfigSummaryAnalysisCell({
  cell
}: Pick<MRTCellProps<ConfigSummary>, "cell">) {
  const value = cell.getValue<ConfigSummary["analysis"]>();
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

function ConfigSummaryAnalysisAggregateCell({
  row
}: Pick<CellContext<Pick<ConfigSummary, "analysis">, unknown>, "row">) {
  const subRows = row.subRows;

  const value = subRows.reduce(
    (acc, row) => {
      const analysis = row.original.analysis;
      if (analysis) {
        Object.entries(analysis).forEach(([key, value]) => {
          acc[key] = (acc[key] || 0) + value;
        });
      }
      return acc;
    },
    {} as Record<string, number>
  );

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

const configSummaryColumns: MRT_ColumnDef<ConfigSummary>[] = [
  {
    header: "changes",
    accessorKey: "changes",
    enableGrouping: false,
    enableHiding: false,
    AggregatedCell: ({ cell }) => {
      const value = cell.getValue<ConfigSummary["changes"]>();
      if (!value) {
        return null;
      }
      return <ChangeCount count={value} />;
    },
    Cell: ({ cell }) => {
      const value = cell.getValue<ConfigSummary["changes"]>();
      if (!value) {
        return null;
      }
      return <ChangeCount count={value} />;
    }
    // size: 100
  },
  {
    header: "Health",
    accessorKey: "health",
    enableGrouping: false,
    enableHiding: false,
    // minSize: 50,
    // maxSize: 100,
    Cell: ConfigSummaryHealthCell,
    AggregatedCell: ConfigSummaryHealthAggregateCell
  },
  {
    header: "analysis",
    accessorKey: "analysis",
    enableGrouping: false,
    enableHiding: false,
    Cell: ConfigSummaryAnalysisCell,
    AggregatedCell: (props) => (
      // @ts-ignore for some reason the cell type is not being inferred correctly
      <ConfigSummaryAnalysisAggregateCell {...props} />
    )
    // minSize: 30,
    // maxSize: 100
  },
  {
    header: "Cost (30d)",
    accessorKey: "cost_total_30d",
    enableGrouping: false,
    enableHiding: false,
    Cell: ConfigListCostCell
    // maxSize: 60
  },
  {
    header: "Created",
    accessorKey: "created_at",
    enableGrouping: false,
    enableHiding: false,
    Cell: MRTConfigListDateCell<ConfigSummary>
    // maxSize: 40
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    enableGrouping: false,
    enableHiding: false,
    Cell: MRTConfigListDateCell<ConfigSummary>
    // maxSize: 40
  },
  {
    header: "Is Favorite",
    accessorKey: "isFavorite",
    enableHiding: true,
    id: "favorite"
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
    (configSummary: ConfigSummary) => {
      params.delete("labels");
      if (groupBy.includes("type")) {
        const { type } = configSummary;
        params.set("configType", type);
      }
      const tags = groupBy
        .filter(
          (column) =>
            column !== "type" &&
            column !== "health" &&
            column !== "status" &&
            column !== "config_class"
        )
        .filter((column) => configSummary[column as keyof ConfigSummary]);
      if (tags.length > 0) {
        const tagsParam = tags
          .map((column) => {
            return `${column}__:__${
              configSummary[column as keyof ConfigSummary]
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
        enableGrouping: false,
        enableHiding: false,
        size: 400,
        AggregatedCell: ConfigSummaryTableVirtualAggregateColumn,
        Cell:
          column === "type"
            ? ConfigSummaryTypeCell
            : (props) => (
                <ConfigSummaryVirtualColumnCell
                  {...props}
                  groupByTags={groupByTags}
                  columnId={column}
                />
              )
      } satisfies MRT_ColumnDef<ConfigSummary>;
    });
    return [...newColumns, ...configSummaryColumns];
  }, [groupBy, groupByTags]);

  // when grouping, remove the last column from the groupBy and always hide the
  // isFavorite column
  const hiddenColumns = useMemo(() => {
    const list = groupBy.length > 1 ? groupBy.slice(0, groupBy.length - 1) : [];
    return [...list, "favorite"];
  }, [groupBy]);

  return (
    <MRTDataTable
      columns={virtualColumns}
      data={data}
      // when grouping, remove the last column from the groupBy
      groupBy={
        groupBy.length > 1 ? groupBy.slice(0, groupBy.length - 1) : undefined
      }
      hiddenColumns={hiddenColumns}
      onRowClick={handleRowClick}
      isLoading={isLoading}
      expandAllRows={groupBy[0] === "config_class"}
      enableGrouping
      disablePagination
      defaultSortBy="favorite"
    />
  );
}
