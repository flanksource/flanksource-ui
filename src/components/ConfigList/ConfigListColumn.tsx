import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import React from "react";
import { ConfigItem } from "../../api/services/configs";
import { getTimeBucket, TIME_BUCKETS } from "../../utils/date";
import { FormatCurrency } from "../ConfigCosts";
import ConfigListAnalysisCell from "./Cells/ConfigListAnalysisCell";
import ConfigListChangeCell from "./Cells/ConfigListChangeCell";
import ConfigListCostCell from "./Cells/ConfigListCostCell";
import ConfigListDateCell from "./Cells/ConfigListDateCell";
import ConfigListNameCell from "./Cells/ConfigListNameCell";
import ConfigListTagsCell from "./Cells/ConfigListTagsCell";
import ConfigListTypeCell from "./Cells/ConfigListTypeCell";

export const configListColumns: ColumnDef<ConfigItem, any>[] = [
  {
    header: "Type",
    id: "config_type",
    cell: ConfigListTypeCell,
    aggregatedCell: "",
    accessorKey: "config_type",
    size: 250,
    enableGrouping: true
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ConfigListNameCell,
    size: 350,
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
      if (!value) {
        return "";
      }
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      );
    },
    size: 150,
    meta: {
      cellClassName: "overflow-hidden"
    },
    enableSorting: false
  },
  {
    header: "Analysis",
    accessorKey: "analysis",
    cell: ConfigListAnalysisCell,
    aggregatedCell: "",
    size: 120
  },
  {
    header: "Cost (per min)",
    accessorKey: "cost_per_minute",
    cell: ConfigListCostCell,
    aggregationFn: "sum",
    aggregatedCell: CostAggregate,
    size: 50
  },
  {
    header: "Cost (24hr)",
    accessorKey: "cost_total_1d",
    cell: ConfigListCostCell,
    aggregationFn: "sum",
    aggregatedCell: CostAggregate,
    size: 50
  },
  {
    header: "Cost (7d)",
    accessorKey: "cost_total_7d",
    cell: ConfigListCostCell,
    aggregationFn: "sum",
    aggregatedCell: CostAggregate,
    size: 50
  },
  {
    header: "Cost (30d)",
    accessorKey: "cost_total_30d",
    cell: ConfigListCostCell,
    aggregationFn: "sum",
    aggregatedCell: CostAggregate,
    size: 50
  },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: React.memo(ConfigListTagsCell),
    aggregatedCell: "",
    size: 250,
    meta: {
      cellClassName: "overflow-hidden"
    }
  },
  {
    header: "All Tags",
    accessorKey: "allTags",
    cell: React.memo((props) => (
      <ConfigListTagsCell {...props} hideGroupByView />
    )),
    aggregatedCell: "",
    size: 250,
    meta: {
      cellClassName: "overflow-hidden"
    }
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: ConfigListDateCell,
    aggregatedCell: "",
    size: 80
  },
  {
    header: "Last Updated",
    accessorKey: "updated_at",
    cell: ConfigListDateCell,
    aggregatedCell: "",
    size: 90
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

function CostAggregate({ getValue }: CellContext<ConfigItem, any>) {
  const value = getValue<ConfigItem["cost_per_minute"]>();
  return !value || parseFloat(value.toFixed(2)) === 0 ? (
    ""
  ) : (
    <FormatCurrency value={value} />
  );
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
