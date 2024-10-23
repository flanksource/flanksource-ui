import { Status } from "@flanksource-ui/components/Status";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import ChangeCountIcon, {
  CountBar
} from "@flanksource-ui/ui/Icons/ChangeCount";
import { MRT_ColumnDef } from "mantine-react-table";
import { FaTrash } from "react-icons/fa";
import { ConfigItem, ConfigSummary, Costs } from "../../../api/types/configs";
import { getTimeBucket } from "../../../utils/date";
import ConfigCostValue from "../ConfigCosts/ConfigCostValue";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import ConfigInsightsIcon from "../Insights/ConfigInsightsIcon";
import { aggregatedCosts } from "./Cells/ConfigListCostCell";
import { MRTConfigListDateCell } from "./Cells/ConfigListDateCell";
import MRTConfigListTagsCell from "./Cells/MRTConfigListTagsCell";

export const mrtConfigListColumns: MRT_ColumnDef<ConfigItem>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableColumnActions: false,
    Cell: ({ row, cell }) => {
      const configType = row.original.type;

      return (
        <div
          className="flex flex-row items-center space-x-2"
          style={{
            marginLeft: row.depth * 20
          }}
        >
          <ConfigsTypeIcon
            config={{ type: configType }}
            showPrimaryIcon={false}
          >
            <span>{cell.getValue<ConfigItem["name"]>()}</span>
          </ConfigsTypeIcon>
        </div>
      );
    },
    minSize: 300,
    size: 400,
    enableGrouping: true,
    enableSorting: true,
    enableHiding: false,
    AggregatedCell: ({ row }) => {
      if (row.getCanExpand()) {
        const groupingValue = row.getGroupingValue(
          row.groupingColumnId!
        ) as string;
        const count = row.subRows?.length;
        return (
          <div
            className="flex flex-row items-center gap-1"
            style={{
              marginLeft: row.depth * 20
            }}
          >
            {row.groupingColumnId === "type" ? (
              <ConfigsTypeIcon config={row.original} showLabel>
                <Badge text={count} />
              </ConfigsTypeIcon>
            ) : (
              <>
                {groupingValue ? (
                  <span className="ml-2">{groupingValue}</span>
                ) : (
                  <span className="ml-2 text-gray-500">(none)</span>
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
    size: 250,
    enableSorting: true,
    enableHiding: true,
    enableColumnActions: false,
    Cell: ({ row }) => {
      return <ConfigsTypeIcon config={row.original} showLabel />;
    }
  },
  {
    header: "Status",
    accessorKey: "health",
    minSize: 200,
    enableSorting: true,
    enableColumnActions: false,
    Cell: ({ cell, row }) => {
      const health = cell.getValue<ConfigItem["health"]>();
      const status = row.original.status;

      if (row.original.deleted_at) {
        return (
          <span className="flex flex-row items-center gap-1">
            <FaTrash className="text-red-500" />
            <span className="text-red-500">{status}</span>
          </span>
        );
      }

      return <Status status={health} statusText={status} />;
    }
  },
  {
    header: "Changes",
    accessorKey: "changes",
    id: "changes",
    Cell: ({ row, cell }) => {
      const changes = cell?.getValue<ConfigItem["changes"]>();

      if (!changes) {
        return null;
      }

      return <ChangeCountIcon count={changes} />;
    },
    enableGrouping: true,
    enableColumnActions: false,
    AggregatedCell: ({ cell }) => {
      const value = cell.getValue<ConfigItem["changes"]>();

      if (!value) {
        return null;
      }

      return <ChangeCountIcon count={value} />;
    },
    size: 200,
    meta: {
      cellClassName: "overflow-hidden"
    },
    enableSorting: false
  },
  {
    header: "Tags",
    accessorKey: "tags",
    enableColumnActions: false,
    Cell: (props) => (
      <MRTConfigListTagsCell
        {...props}
        enableFilterByTag
        filterByTagParamKey="labels"
      />
    ),
    minSize: 100
  },
  {
    header: "Analysis",
    accessorKey: "analysis",
    enableColumnActions: false,
    Cell: ({ cell }) => {
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
    },
    AggregatedCell: ({ cell }) => {
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
  },
  {
    header: "Cost",
    accessorKey: "cost_total_1d",
    aggregationFn: "sum",
    AggregatedCell: ({ row }) => {
      const configGroupCosts = aggregatedCosts(row, {
        cost_total_30d: 0,
        cost_total_7d: 0,
        cost_total_1d: 0,
        cost_per_minute: 0
      } as Required<Costs>);
      return <ConfigCostValue config={configGroupCosts} />;
    },
    Cell: ({ row }) => {
      return <ConfigCostValue config={row.original} popover={false} />;
    }
  },
  {
    header: "Created",
    accessorKey: "created_at",
    enableColumnActions: false,
    Cell: MRTConfigListDateCell,
    maxSize: 100
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    enableColumnActions: false,
    Cell: MRTConfigListDateCell,
    maxSize: 100
  },
  {
    header: "Deleted At",
    accessorKey: "deleted_at",
    enableColumnActions: false,
    Cell: MRTConfigListDateCell,
    size: 90,
    enableHiding: true
  },
  {
    header: "Changed",
    enableColumnActions: false,
    accessorFn: changeColumnAccessorFN,
    id: "changed",
    // sortingFn: changeColumnSortingFN,
    size: 180
  }
];

function changeColumnAccessorFN(row: any) {
  return getTimeBucket(row.updated_at);
}
