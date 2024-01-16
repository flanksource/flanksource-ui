import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { ConfigAnalysis, ConfigItem } from "../../../api/types/configs";
import ConfigInsightsIcon from "./ConfigInsightsIcon";
import { ConfigIcon } from "../../Icon/ConfigIcon";
import ConfigInsightsSeverityIcons from "./ConfigInsightsSeverityIcons";
import { DateCell } from "../../../ui/table";

export const ConfigInsightsColumns: ColumnDef<
  ConfigAnalysis & { config?: ConfigItem },
  any
>[] = [
  {
    header: "Catalog",
    id: "config",
    aggregatedCell: "",
    size: 100,
    cell: ({ cell }) => {
      const config = cell.row.original.config;

      return (
        <div className="flex max-w-full truncate">
          <Link
            className="space-x-2  items-center"
            to={`/catalog/${config?.id}`}
          >
            <ConfigIcon config={config} className="w-4 h-4" />
            <span>{config?.name}</span>
          </Link>
        </div>
      );
    }
  },
  {
    header: "Type",
    id: "analysis_type",
    aggregatedCell: "",
    accessorKey: "analysis_type",
    size: 50,
    cell: ({ cell }) => {
      const data = cell.row.original;

      return (
        <div className="flex items-center max-w-full space-x-2">
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
    aggregatedCell: "",
    accessorKey: "analyzer",
    size: 100,
    enableGrouping: true,
    cell: ({ getValue }) => {
      return (
        <span className="flex-1 overflow-hidden overflow-ellipsis">
          {getValue<string>()}
        </span>
      );
    },
    enableSorting: false
  },
  {
    header: "Severity",
    id: "severity",
    aggregatedCell: "",
    accessorKey: "severity",
    size: 50,
    enableSorting: false,
    cell: ({ getValue }) => {
      return (
        <div className="flex-1 flex flex-row gap-1 items-center overflow-hidden overflow-ellipsis capitalize">
          <ConfigInsightsSeverityIcons severity={getValue<string>()} />
          <span>{getValue<string>()}</span>
        </div>
      );
    }
  },
  {
    header: "Status",
    id: "status",
    aggregatedCell: "",
    accessorKey: "status",
    size: 50,
    enableSorting: false
  },
  {
    header: "First Observed",
    id: "first_observed",
    aggregatedCell: "",
    accessorKey: "first_observed",
    size: 50,
    cell: DateCell
  },
  {
    header: "Last Observed",
    id: "last_observed",
    aggregatedCell: "",
    accessorKey: "last_observed",
    size: 50,
    cell: DateCell
  }
];
