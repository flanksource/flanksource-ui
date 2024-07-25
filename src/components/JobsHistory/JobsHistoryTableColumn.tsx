import { DateCell } from "@flanksource-ui/ui/DataTable/Cells/DateCells";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { GoCopy, GoLinkExternal } from "react-icons/go";
import { Link, useSearchParams } from "react-router-dom";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { formatJobName } from "../../utils/common";
import { formatDuration } from "../../utils/date";
import JobHistoryStatusColumn from "./JobHistoryStatusColumn";
import { JobHistory } from "./JobsHistoryTable";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const jobsHistoryResourceTypeMap: Record<string, string> = {
  canary: "/settings/canaries",
  config_scraper: "/settings/config_scrapers",
  catalog_scraper: "/settings/config_scrapers",
  topology: "/settings/topologies",
  config: "/catalog",
  playbook: "/playbooks"
};

export const JobsHistoryTableColumn: ColumnDef<JobHistory, any>[] = [
  {
    header: "Timestamp",
    id: "time_start",
    accessorKey: "time_start",
    minSize: 10,
    maxSize: 50,
    cell: DateCell
  },
  {
    header: "Job Name",
    id: "name",
    accessorKey: "name",
    minSize: 120,
    maxSize: 600,
    enableSorting: false,
    cell: ({ getValue, row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [params, setParams] = useSearchParams();

      const value = getValue<JobHistory["name"]>();
      const formattedName = formatJobName(value);

      return (
        <div className="flex cursor-pointer flex-row items-center gap-1">
          <span
            onClick={(e) => {
              e.stopPropagation();
              params.set("name", value);
              setParams(params);
            }}
          >
            {formattedName}
          </span>
        </div>
      );
    }
  },
  {
    header: "Agent",
    accessorKey: "agent",
    enableSorting: false,
    cell: ({ getValue }) => {
      const agent = getValue<JobHistory["agent"]>();

      if (!agent) {
        return null;
      }

      return (
        <Link to={`/settings/agents?id=${agent.id}`} className="text-blue-500">
          {agent.name}
        </Link>
      );
    },
    id: "agent",
    minSize: 20,
    maxSize: 60
  },
  {
    header: "Resource",
    id: "resource_name",
    minSize: 150,
    maxSize: 600,
    cell: ({ row }) => {
      const resourceName = row.original.resource_name;
      const resourceId = row.original.resource_id;

      const resourceType = row.original.resource_type;
      const resourcePath = jobsHistoryResourceTypeMap[resourceType as any];
      const link = `${resourcePath}/${resourceId}`;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const copyFn = useCopyToClipboard(`Copied ${resourceId} to clipboard`);

      return (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`group flex w-full flex-row items-center gap-1`}
        >
          <span className="overflow-x-hidden text-ellipsis">
            {resourcePath ? (
              <Link to={link} className="text-blue-500">
                {resourceName} <GoLinkExternal className="inline h-3 w-3" />
              </Link>
            ) : (
              resourceName
            )}
          </span>
          <span
            role="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              copyFn(resourceId);
            }}
            className="hidden group-hover:inline"
          >
            <GoCopy title="Copy resource id" className="h-4 w-5" />
          </span>
        </div>
      );
    }
  },
  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 70,
    cell: ({ getValue }) => {
      const value = getValue<JobHistory["status"]>();
      return (
        <span className={`lowercase`}>
          <JobHistoryStatusColumn status={value} />
        </span>
      );
    }
  },
  {
    header: "Duration",
    id: "duration_millis",
    accessorKey: "duration_millis",
    size: 50,
    cell: ({ getValue }) => {
      const value = getValue<JobHistory["duration_millis"]>();
      const readableTime = formatDuration(value);
      return <span>{readableTime}</span>;
    }
  },
  {
    header: "Statistics",
    id: "statistics",
    size: 75,
    columns: [
      {
        header: "Success",
        id: "success_count",
        accessorKey: "success_count",
        size: 50,
        cell: ({ getValue }) => {
          const value = getValue<JobHistory["success_count"]>();
          if (value === 0) {
            return null;
          }
          return <span>{value}</span>;
        }
      },
      {
        header: "Error",
        id: "error_count",
        accessorKey: "error_count",
        size: 50,
        cell: ({ getValue }) => {
          const value = getValue<JobHistory["error_count"]>();
          if (value === 0) {
            return null;
          }
          return <span className={`text-red-500`}>{value}</span>;
        }
      }
    ]
  }
];
