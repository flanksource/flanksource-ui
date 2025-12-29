import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import ChangeCount, { CountBar } from "@flanksource-ui/ui/Icons/ChangeCount";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigListCostCell from "../ConfigList/Cells/ConfigListCostCell";
import ConfigListDateCell from "../ConfigList/Cells/ConfigListDateCell";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import ConfigInsightsIcon from "../Insights/ConfigInsightsIcon";
import {
  ConfigSummaryHealthAggregateCell,
  ConfigSummaryHealthCell
} from "./Cells/ConfigSummaryHealthCells";
import { ConfigSummaryTableVirtualAggregateColumn } from "./Cells/ConfigSummaryTableVirtualAggregateColumn";
import { ConfigSummaryVirtualColumnCell } from "./Cells/ConfigSummaryVirtualColumnCell";
import ConfigSummaryFavoriteButton from "./ConfigSummaryTypeFavorite";

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
    <span
      className="flex flex-nowrap gap-1"
      style={{
        marginLeft: row.depth * 20
      }}
    >
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
  getValue
}: Pick<CellContext<Pick<ConfigSummary, "analysis">, any>, "getValue">) {
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

const configSummaryColumns: ColumnDef<ConfigSummary, any>[] = [
  {
    header: "changes",
    accessorKey: "changes",
    aggregatedCell: ({ getValue }) => {
      const value = getValue();
      if (!value) {
        return null;
      }
      return <ChangeCount count={value} />;
    },
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
    aggregatedCell: (props) => (
      // @ts-ignore for some reason the cell type is not being inferred correctly
      <ConfigSummaryAnalysisAggregateCell {...props} />
    ),
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
  },
  {
    header: "Is Favorite",
    accessorKey: "isFavorite",
    enableHiding: true
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
      params.delete("labels");
      if (groupBy.includes("type")) {
        const { type } = row.original;
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
        aggregatedCell: ConfigSummaryTableVirtualAggregateColumn,
        cell:
          column === "type"
            ? ConfigSummaryTypeCell
            : (props) => (
                <ConfigSummaryVirtualColumnCell
                  {...props}
                  groupByTags={groupByTags}
                  columnId={column}
                />
              )
      } satisfies ColumnDef<ConfigSummary>;
    });
    return [...newColumns, ...configSummaryColumns];
  }, [groupBy, groupByTags]);

  // when grouping, remove the last column from the groupBy and always hide the
  // isFavorite column
  const hiddenColumns = useMemo(() => {
    const list = groupBy.length > 1 ? groupBy.slice(0, groupBy.length - 1) : [];
    return [...list, "isFavorite"];
  }, [groupBy]);

  // Determine if groups should be expanded by default
  const shouldExpandAllRows = useMemo(() => {
    // If no grouping is applied, no rows to expand
    if (groupBy.length <= 1) {
      return false;
    }

    // Get the first grouping field
    const primaryGroupingField = groupBy[0];

    // Count unique values for the primary grouping field
    const uniqueGroups = new Set(
      data.map((item) => item[primaryGroupingField as keyof ConfigSummary])
    );

    // If there's only one unique group, expand it by default
    return uniqueGroups.size === 1;
  }, [data, groupBy]);

  return (
    <DataTable
      key={`datatable-${data.length}-${shouldExpandAllRows}`}
      stickyHead
      columns={virtualColumns}
      data={data}
      // when grouping, remove the last column from the groupBy
      groupBy={
        groupBy.length > 1 ? groupBy.slice(0, groupBy.length - 1) : undefined
      }
      tableSortByState={[
        {
          desc: false,
          id: "isFavorite"
        }
      ]}
      hiddenColumns={hiddenColumns}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      className="max-w-full table-auto table-fixed overflow-x-auto"
      savePreferences={false}
      expandAllRows={shouldExpandAllRows}
    />
  );
}
