import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import { Badge } from "@flanksource-ui/ui/Badge";
import { CountBadge } from "@flanksource-ui/ui/Badge/CountBadge";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigListCostCell from "../ConfigList/Cells/ConfigListCostCell";
import ConfigListDateCell from "../ConfigList/Cells/ConfigListDateCell";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import ConfigInsightsIcon from "../Insights/ConfigInsightsIcon";

function ConfigSummaryTypeCell({
  getValue,
  row
}: CellContext<ConfigSummary, unknown>) {
  const configType = getValue<ConfigSummary["type"]>();

  const configCount = row.original.total_configs;

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
    maxSize: 20
  },
  {
    header: "analysis",
    accessorKey: "analysis",
    cell: ConfigSummaryAnalysisCell,
    maxSize: 60
  },
  {
    header: () => <div title="Cost">Cost (30d)</div>,
    accessorKey: "cost_total_30d",
    cell: ConfigListCostCell,
    maxSize: 20
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: ConfigListDateCell<ConfigSummary>,
    aggregatedCell: "",
    maxSize: 30
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    cell: ConfigListDateCell<ConfigSummary>,
    aggregatedCell: "",
    maxSize: 30
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

  const handleRowClick = useCallback(
    (row: Row<ConfigSummary>) => {
      if (groupBy.includes("type")) {
        const { type } = row.original;
        params.set("configType", type);
      } else {
        const tags = groupBy
          .map((column) => {
            return `${column}__:__${
              row.original[column as keyof ConfigSummary]
            }`;
          })
          .join(",");
        params.set("tags", tags);
      }
      params.delete("groupBy");
      setParams(params);
    },
    [groupBy, params, setParams]
  );

  const virtualColumns = useMemo(() => {
    const newColumns = groupBy.map((column) => {
      if (column === "type") {
        return {
          header: "Type",
          accessorKey: "type",
          cell: ConfigSummaryTypeCell
        } satisfies ColumnDef<ConfigSummary, any>;
      }
      return {
        header: column.toLocaleUpperCase(),
        accessorKey: column,
        cell: ({ getValue, row }: CellContext<ConfigSummary, any>) => {
          const value = getValue();
          return (
            <div className="flex flex-1 flex-row gap-1 items-center">
              <span>{value}</span>
              <Badge text={row.original.total_configs} />
            </div>
          );
        }
      } satisfies ColumnDef<ConfigSummary, any>;
    });
    return [...newColumns, ...configSummaryColumns];
  }, [groupBy]);

  return (
    <DataTable
      stickyHead
      columns={virtualColumns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      className="max-w-full overflow-x-auto table-fixed table-auto"
      savePreferences={false}
    />
  );
}
