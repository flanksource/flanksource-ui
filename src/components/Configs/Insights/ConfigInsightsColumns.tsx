import { ConfigAnalysis, ConfigItem } from "@flanksource-ui/api/types/configs";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRT_ColumnDef } from "mantine-react-table";
import { Link } from "react-router-dom";
import { ConfigIcon } from "../../../ui/Icons/ConfigIcon";
import ConfigInsightsIcon from "./ConfigInsightsIcon";
import ConfigInsightsSeverityIcons from "./ConfigInsightsSeverityIcons";

export const ConfigInsightsColumns: MRT_ColumnDef<
  ConfigAnalysis & { config?: ConfigItem }
>[] = [
  {
    header: "Catalog",
    id: "catalog",
    enableHiding: true,
    size: 100,
    Cell: ({ cell }) => {
      const config = cell.row.original.config;

      return (
        <div className="flex max-w-full">
          <Link className="items-center" to={`/catalog/${config?.id}`}>
            <ConfigIcon config={config} />
            <span>{config?.name}</span>
          </Link>
        </div>
      );
    }
  },
  {
    header: "Type",
    id: "analysis_type",
    accessorKey: "analysis_type",
    size: 50,
    Cell: ({ cell }) => {
      const data = cell.row.original;

      return (
        <div className="flex max-w-full items-center space-x-2">
          <span className="w-auto">
            <ConfigInsightsIcon analysis={data} />
          </span>
          <span className="capitalize">{data.analysis_type}</span>
        </div>
      );
    },
    enableSorting: false
  },
  {
    header: "Analyzer",
    id: "analyzer",
    accessorKey: "analyzer",
    size: 100,
    enableGrouping: true,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();

      return (
        <span className="flex-1 overflow-hidden overflow-ellipsis">
          {value}
        </span>
      );
    },
    enableSorting: false
  },
  {
    header: "Severity",
    id: "severity",
    accessorKey: "severity",
    size: 50,
    enableSorting: false,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();

      return (
        <div className="flex flex-1 flex-row items-center gap-1 overflow-hidden overflow-ellipsis capitalize">
          <ConfigInsightsSeverityIcons severity={value} />
          <span>{value}</span>
        </div>
      );
    }
  },
  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 50,
    enableSorting: false
  },
  {
    header: "First Observed",
    id: "first_observed",
    accessorKey: "first_observed",
    size: 50,
    Cell: MRTDateCell
  },
  {
    header: "Last Observed",
    id: "last_observed",
    accessorKey: "last_observed",
    size: 50,
    Cell: MRTDateCell
  }
];
