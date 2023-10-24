import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { ConfigSummary } from "../../api/types/configs";
import { DataTable } from "../DataTable";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import { CountBadge } from "../Badge/CountBadge";
import ConfigListCostCell from "../ConfigList/Cells/ConfigListCostCell";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "../Badge";
import ConfigsTypeIcon from "../Configs/ConfigsTypeIcon";
import ConfigListDateCell from "../ConfigList/Cells/ConfigListDateCell";

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
      <ConfigsTypeIcon config={{ type: configType }} />
      <span className="pl-1"> {value}</span>
      <Badge text={configCount} />
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
    header: "type",
    accessorKey: "type",
    cell: ConfigSummaryTypeCell,
    maxSize: 200
  },
  {
    header: "analysis",
    accessorKey: "analysis",
    cell: ConfigSummaryAnalysisCell,
    maxSize: 100
  },
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
    maxSize: 40
  },
  {
    id: "cost",
    header: () => <div className="block w-full text-center">cost</div>,
    size: 200,
    columns: [
      {
        header: () => <div className="block w-full text-center">Min</div>,
        accessorKey: "cost_per_minute",
        cell: ConfigListCostCell
      },
      {
        header: () => <div className="block w-full text-center">1d</div>,
        accessorKey: "cost_total_1d",
        cell: ConfigListCostCell
      },
      {
        header: () => <div className="block w-full text-center">7d</div>,
        accessorKey: "cost_total_7d",
        cell: ConfigListCostCell
      },
      {
        header: () => <div className="block w-full text-center">30d</div>,
        accessorKey: "cost_total_30d",
        cell: ConfigListCostCell
      }
    ]
  },
  {
    header: "Agent",
    accessorKey: "agent",
    enableSorting: false,
    cell: ({ getValue }: CellContext<ConfigSummary, any>) => {
      const agent = getValue<ConfigSummary["agent"]>();
      if (agent?.name === "local" || !agent) {
        return null;
      }
      return <span>{agent.name}</span>;
    },
    size: 70
  },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: ({ getValue }: CellContext<ConfigSummary, any>) => {
      return null;
    },
    size: 140
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: ConfigListDateCell<ConfigSummary>,
    aggregatedCell: "",
    size: 50
  },
  {
    header: "Last Updated",
    accessorKey: "updated_at",
    cell: ConfigListDateCell<ConfigSummary>,
    aggregatedCell: "",
    size: 50
  }
];

type ConfigSummaryListProps = {
  data: ConfigSummary[];
  isLoading?: boolean;
};

export default function ConfigSummaryList({
  data,
  isLoading = false
}: ConfigSummaryListProps) {
  const [params, setParams] = useSearchParams();

  const handleRowClick = useCallback(
    (row: Row<ConfigSummary>) => {
      const { type } = row.original;
      params.set("type", type);
      setParams(params);
    },
    [params, setParams]
  );

  return (
    <DataTable
      stickyHead
      isVirtualized
      columns={configSummaryColumns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      className="max-w-full overflow-x-auto"
      preferencesKey={""}
      savePreferences={false}
    />
  );
}
