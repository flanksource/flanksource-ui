import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSearchParams } from "react-router-dom";
import { DateCell } from "../../ui/table";
import { formatJobName } from "../../utils/common";
import { formatDuration } from "../../utils/date";
import JobHistoryStatusColumn from "./JobHistoryStatusColumn";
import { JobHistory } from "./JobsHistoryTable";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const JobsHistoryTableColumn: ColumnDef<JobHistory, any>[] = [
  {
    header: "Timestamp",
    id: "time_start",
    accessorKey: "time_start",
    size: 50,
    cell: DateCell
  },
  {
    header: "Job Name",
    id: "name",
    accessorKey: "name",
    size: 120,
    enableSorting: false,
    cell: ({ getValue }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [params, setParams] = useSearchParams();

      const value = getValue<JobHistory["name"]>();
      const formattedName = formatJobName(value);
      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            params.set("name", value);
            setParams(params);
          }}
        >
          {formattedName}
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
  },
  {
    header: "Resource Type",
    id: "resource_type",
    accessorKey: "resource_type",
    size: 75
  },
  {
    header: "Resource ID",
    id: "resource_id",
    accessorKey: "resource_id",
    minSize: 150,
    maxSize: 400,
    cell: ({ getValue }) => {
      const value = getValue<JobHistory["resource_id"]>();

      return (
        <div
          className={`w-full max-w-full overflow-x-hidden overflow-ellipsis`}
        >
          {value}
        </div>
      );
    }
  }
];
