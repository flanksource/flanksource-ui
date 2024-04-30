import { Status } from "@flanksource-ui/components/Status";
import { Badge } from "@flanksource-ui/ui/Badge";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import React from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { ConfigAnalysisTypeItem } from "../../../api/services/configs";
import { ConfigAnalysis, ConfigItem } from "../../../api/types/configs";
import { TIME_BUCKETS, getTimeBucket } from "../../../utils/date";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import ConfigInsightsIcon from "../Insights/ConfigInsightsIcon";
import ConfigListAnalysisCell from "./Cells/ConfigListAnalysisCell";
import ConfigListChangeCell from "./Cells/ConfigListChangeCell";
import ConfigListCostCell, {
  ConfigListCostAggregate
} from "./Cells/ConfigListCostCell";
import ConfigListDateCell from "./Cells/ConfigListDateCell";
import ConfigListNameCell from "./Cells/ConfigListNameCell";
import ConfigListTagsCell from "./Cells/ConfigListTagsCell";

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
    header: "Name",
    accessorKey: "name",
    cell: ConfigListNameCell,
    size: 270,
    enableGrouping: true,
    enableSorting: true,
    enableHiding: false,
    aggregatedCell: ({ row }: CellContext<ConfigItem, any>) => {
      if (row.getCanExpand()) {
        const groupingValue = row.getGroupingValue(
          row.groupingColumnId!
        ) as string;
        const count = row.subRows.length;
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
              <>
                {groupingValue && (
                  <span className="ml-2">{groupingValue} </span>
                )}
                <Badge text={count} />
              </>
            )}
          </div>
        );
      }
    }
  },
  {
    header: "Type",
    accessorKey: "type",
    size: 150,
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }: CellContext<ConfigItem, any>) => {
      return <ConfigsTypeIcon config={row.original} showLabel />;
    }
  },
  {
    header: "Status",
    accessorKey: "health",
    size: 100,
    enableSorting: true,
    cell: ({ getValue, row }: CellContext<ConfigItem, any>) => {
      const health = getValue<ConfigItem["health"]>();
      const status = row.original.status;

      return <Status status={health} statusText={status} />;
    }
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
          {data.map((item: { count: number; analysis: ConfigAnalysis }) => {
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
    header: () => <div>Cost</div>,
    accessorKey: "cost_total_1d",
    aggregationFn: "sum",
    aggregatedCell: ConfigListCostAggregate,
    cell: ConfigListCostCell,
    maxSize: 60
  },
  // {
  //   header: "Agent",
  //   accessorKey: "agent",
  //   enableSorting: false,
  //   cell: ({ getValue }: CellContext<ConfigItem, any>) => {
  //     const agent = getValue<ConfigItem["agent"]>();
  //     if (agent?.name === "local") {
  //       return null;
  //     }
  //     return <span>{agent?.name}</span>;
  //   }
  // },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: React.memo(ConfigListTagsCell),
    aggregatedCell: "",
    size: 240
  },
  // {
  //   header: "Tags",
  //   accessorKey: "tags",
  //   cell: React.memo((props) => (
  //     <ConfigListTagsCell {...props} hideGroupByView />
  //   )),
  //   aggregatedCell: "",
  //   size: 240
  // },
  // {
  //   header: "Labels",
  //   accessorKey: "labels",
  //   cell: React.memo((props) => (
  //     <ConfigListTagsCell {...props} hideGroupByView label="Labels" />
  //   )),
  //   size: 240
  // },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: ConfigListDateCell,
    aggregatedCell: "",
    maxSize: 70
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    cell: ConfigListDateCell,
    aggregatedCell: "",
    maxSize: 70
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
