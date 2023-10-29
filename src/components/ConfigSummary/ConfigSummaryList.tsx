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
      className="max-w-full overflow-x-auto table-fixed table-auto"
      preferencesKey={""}
      savePreferences={false}
    />
  );
}
