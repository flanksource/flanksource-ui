import { ConfigAnalysis, ConfigItem } from "@flanksource-ui/api/types/configs";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRT_ColumnDef } from "mantine-react-table";
import { Link } from "react-router-dom";
import { ConfigIcon } from "../../../ui/Icons/ConfigIcon";
import ConfigInsightsIcon from "./ConfigInsightsIcon";
import ConfigInsightsSeverityIcons from "./ConfigInsightsSeverityIcons";

const paramsToReset = ["pageIndex", "pageSize"];

export const ConfigInsightsColumns: MRT_ColumnDef<
  ConfigAnalysis & { config?: ConfigItem }
>[] = [
  {
    header: "Catalog",
    id: "catalog",
    accessorFn: (row) => row.config?.name ?? "",
    enableHiding: true,
    size: 100,
    Cell: ({ cell }) => {
      const config = cell.row.original.config;

      return (
        <FilterByCellValue
          paramKey="catalogId"
          filterValue={config?.id ?? ""}
          paramsToReset={paramsToReset}
        >
          <div className="flex max-w-full">
            <Link className="items-center" to={`/catalog/${config?.id}`}>
              <ConfigIcon config={config} />
              <span>{config?.name}</span>
            </Link>
          </div>
        </FilterByCellValue>
      );
    }
  },
  {
    header: "Type",
    id: "analysis_type",
    accessorKey: "analysis_type",
    size: 80,
    Cell: ({ cell }) => {
      const data = cell.row.original;

      return (
        <FilterByCellValue
          paramKey="type"
          filterValue={data.analysis_type}
          paramsToReset={paramsToReset}
        >
          <div className="flex max-w-full items-center space-x-2">
            <span className="w-auto">
              <ConfigInsightsIcon analysis={data} />
            </span>
            <span className="capitalize">{data.analysis_type}</span>
          </div>
        </FilterByCellValue>
      );
    }
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
        <FilterByCellValue
          paramKey="analyzer"
          filterValue={value}
          paramsToReset={paramsToReset}
        >
          <span className="flex-1 overflow-hidden overflow-ellipsis">
            {value}
          </span>
        </FilterByCellValue>
      );
    }
  },
  {
    header: "Summary",
    id: "summary",
    accessorKey: "summary",
    size: 300,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      if (!value) return null;
      return (
        <span className="overflow-hidden overflow-ellipsis text-gray-600">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    }
  },
  {
    header: "Severity",
    id: "severity",
    accessorKey: "severity",
    size: 50,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();

      return (
        <FilterByCellValue
          paramKey="severity"
          filterValue={value}
          paramsToReset={paramsToReset}
        >
          <div className="flex flex-1 flex-row items-center gap-1 overflow-hidden overflow-ellipsis capitalize">
            <ConfigInsightsSeverityIcons severity={value} />
            <span>{value}</span>
          </div>
        </FilterByCellValue>
      );
    }
  },
  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 50,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();

      if (!value) {
        return <span className="text-gray-400">—</span>;
      }

      return (
        <FilterByCellValue
          paramKey="status"
          filterValue={value}
          paramsToReset={paramsToReset}
        >
          <span className="capitalize">{value}</span>
        </FilterByCellValue>
      );
    }
  },
  {
    header: "Source",
    id: "source",
    accessorKey: "source",
    size: 80,
    Cell: ({ cell }) => {
      const value = cell.getValue<string | null | undefined>() ?? "";

      if (!value) {
        return <span className="text-gray-400">—</span>;
      }

      return (
        <FilterByCellValue
          paramKey="source"
          filterValue={value}
          paramsToReset={paramsToReset}
        >
          <span className="overflow-hidden text-ellipsis">{value}</span>
        </FilterByCellValue>
      );
    }
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
