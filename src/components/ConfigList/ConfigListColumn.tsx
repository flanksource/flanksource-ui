import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import React from "react";
import { ConfigAnalysisTypeItem, ConfigItem } from "../../api/services/configs";
import { getTimeBucket, TIME_BUCKETS } from "../../utils/date";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import { FormatCurrency } from "../CostDetails/CostDetails";
import ConfigListAnalysisCell from "./Cells/ConfigListAnalysisCell";
import ConfigListChangeCell from "./Cells/ConfigListChangeCell";
import ConfigListCostCell from "./Cells/ConfigListCostCell";
import ConfigListDateCell from "./Cells/ConfigListDateCell";
import ConfigListNameCell from "./Cells/ConfigListNameCell";
import ConfigListTagsCell from "./Cells/ConfigListTagsCell";
import ConfigListTypeCell from "./Cells/ConfigListTypeCell";
import { ConfigTypeInsights } from "../ConfigInsights";

function CountBadge({ value }: { value: number | undefined | null }) {
  if (!value) {
    return null;
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
      {value}
    </span>
  );
}

export const configListColumns: ColumnDef<ConfigItem, any>[] = [
  {
    header: "Type",
    id: "type",
    cell: ConfigListTypeCell,
    aggregatedCell: "",
    accessorKey: "type",
    size: 250,
    enableGrouping: true
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ConfigListNameCell,
    size: 270,
    enableGrouping: true,
    enableSorting: true
  },
  {
    header: "Changes",
    accessorKey: "changes",
    id: "changes",
    cell: React.memo(ConfigListChangeCell),
    enableGrouping: true,
    aggregationFn: changeAggregationFN,
    aggregatedCell: ({ getValue }: CellContext<ConfigItem, any>) => {
      const value = getValue();
      return <CountBadge value={value} />;
    },
    size: 75,
    meta: {
      cellClassName: "overflow-hidden"
    },
    enableSorting: false
  },
  {
    header: "Analysis",
    accessorKey: "analysis",
    cell: ConfigListAnalysisCell,
    aggregationFn: analysisAggregationFN,
    aggregatedCell: ({ getValue }: CellContext<ConfigItem, any>) => {
      const data = getValue();
      return (
        <div className="inline-flex space-x-2 overflow-hidden truncate">
          {data.map((item: { count: number; analysis: ConfigTypeInsights }) => {
            return (
              <span
                className="inline-flex space-x-0.5"
                key={item.analysis.analysis_type}
              >
                <ConfigInsightsIcon analysis={item.analysis} />{" "}
                <CountBadge value={item.count} />
              </span>
            );
          })}
        </div>
      );
    },
    size: 150
  },
  {
    header: "Cost",
    accessorKey: "",
    cell: ConfigListCostCell,
    size: 180,
    enableSorting: false,
    columns: [
      {
        header: "min",
        accessorKey: "cost_per_minute",
        aggregationFn: "sum",
        aggregatedCell: CostAggregate,
        cell: ConfigListCostCell,
        size: 30
      },
      {
        header: "24hr",
        accessorKey: "cost_total_1d",
        aggregationFn: "sum",
        aggregatedCell: CostAggregate,
        cell: ConfigListCostCell,
        size: 30
      },
      {
        header: "7d",
        accessorKey: "cost_total_7d",
        aggregationFn: "sum",
        aggregatedCell: CostAggregate,
        cell: ConfigListCostCell,
        size: 30
      },
      {
        header: "30d",
        accessorKey: "cost_total_30d",
        aggregationFn: "sum",
        aggregatedCell: CostAggregate,
        cell: ConfigListCostCell,
        size: 30
      }
    ]
  },
  {
    header: "Agent",
    accessorKey: "agent",
    enableSorting: false,
    cell: ({ getValue }: CellContext<ConfigItem, any>) => {
      const agent = getValue<ConfigItem["agent"]>();
      if (agent?.name === "local") {
        return null;
      }
      return <span>{agent?.name}</span>;
    }
  },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: React.memo(ConfigListTagsCell),
    aggregatedCell: "",
    size: 210
  },
  {
    header: "All Tags",
    accessorKey: "allTags",
    cell: React.memo((props) => (
      <ConfigListTagsCell {...props} hideGroupByView />
    )),
    aggregatedCell: "",
    size: 210
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: ConfigListDateCell,
    aggregatedCell: "",
    size: 100
  },
  {
    header: "Last Updated",
    accessorKey: "updated_at",
    cell: ConfigListDateCell,
    aggregatedCell: "",
    size: 130
  },
  {
    header: "Deleted At",
    accessorKey: "deleted_at",
    cell: ConfigListDateCell,
    aggregatedCell: "",
    size: 90,
    enableHiding: true
  },
  {
    header: "Changed",
    accessorFn: changeColumnAccessorFN,
    id: "changed",
    sortingFn: changeColumnSortingFN,
    size: 180
  }
];

function changeAggregationFN(
  columnId: string,
  leafRows: Row<ConfigItem>[],
  childRows: Row<ConfigItem>[]
) {
  let sum = 0;
  leafRows?.forEach((row) => {
    const values = row.getValue<{ total: number }[]>(columnId);
    if (values) {
      sum += values.reduce((acc, val) => acc + val.total, 0);
    }
  });
  return sum;
}

function analysisAggregationFN(
  columnId: string,
  leafRows: Row<ConfigItem>[],
  childRows: Row<ConfigItem>[]
) {
  const result: Record<
    string,
    {
      count: number;
      data: ConfigAnalysisTypeItem;
    }
  > = {};
  leafRows?.forEach((row) => {
    const values = row.getValue<ConfigAnalysisTypeItem[]>(columnId) || [];
    values.forEach((value) => {
      result[value.analysis_type] = result[value.analysis_type] ?? {
        count: 0,
        data: value
      };
      result[value.analysis_type].count += 1;
    });
  });
  const data = Object.keys(result).map((key) => {
    return {
      type: key,
      count: result[key].count,
      analysis: result[key].data
    };
  });
  return data;
}

function CostAggregate({ getValue }: CellContext<ConfigItem, any>) {
  const value = getValue<ConfigItem["cost_per_minute"]>();
  return <FormatCurrency value={value} defaultValue="" hideMinimumValue />;
}

function changeColumnAccessorFN(row: any) {
  return getTimeBucket(row.updated_at);
}

function changeColumnSortingFN(rowA: any, rowB: any, columnId: string) {
  const rowAOrder =
    Object.values(TIME_BUCKETS).find((tb) => tb.name === rowA.values[columnId])
      ?.sortOrder || 0;
  const rowBOrder =
    Object.values(TIME_BUCKETS).find((tb) => tb.name === rowB.values[columnId])
      ?.sortOrder || 0;
  if (rowAOrder >= rowBOrder) {
    return 1;
  } else {
    return -1;
  }
}
