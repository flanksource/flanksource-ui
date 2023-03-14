import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { ConfigItem } from "../../api/services/configs";
import { ConfigTypeInsights } from "../ConfigInsights";
import { DateCell } from "../ConfigViewer/columns";
import { Icon } from "../Icon";
import { AnalysisIcon } from "../ConfigList/Cells/ConfigListAnalysisCell";

export const ConfigInsightsColumns: ColumnDef<
  ConfigTypeInsights & { config?: ConfigItem },
  any
>[] = [
  {
    header: "Config",
    id: "config",
    aggregatedCell: "",
    size: 100,
    cell: ({ cell }) => {
      const config = cell.row.original.config;

      return (
        <div data-tip={`${config?.name}`} className="flex max-w-full">
          <Link
            className="space-x-2 text-ellipsis overflow-hidden w-full items-center"
            to={`/configs/${config?.id}`}
          >
            <Icon
              className="w-4 h-4"
              name={config?.external_type}
              secondary={config?.config_type}
            />
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
        <div
          data-tip={`${data.analysis_type}`}
          className="flex items-center max-w-full space-x-2 "
        >
          <span className="w-auto">
            <AnalysisIcon analysis={data} />
          </span>
          <span className="overflow-hidden overflow-ellipsis inline-block w-full">
            {data.analysis_type}
          </span>
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
    cell: ({ cell }) => {
      const data = cell.row.original;

      return (
        <span
          data-tip={`${data.analyzer}`}
          className="flex-1 overflow-hidden inline-block w-full overflow-ellipsis"
        >
          {data.analyzer}
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
    enableSorting: false
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
