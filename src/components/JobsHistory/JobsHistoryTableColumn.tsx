import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatJobName } from "../../utils/common";
import JobHistoryStatusColumn from "./JobHistoryStatusColumn";
import { JobHistory } from "./JobsHistoryTable";
import { DateCell } from "../../ui/table";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const JobsHistoryTableColumn: ColumnDef<JobHistory, any>[] = [
  {
    header: "Timestamp",
    id: "time_start",
    accessorKey: "time_start",
    size: 150,
    cell: DateCell
  },
  {
    header: "Job Name",
    id: "name",
    accessorKey: "name",
    size: 200,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue<JobHistory["name"]>();
      const formattedName = formatJobName(value);
      return <span>{formattedName}</span>;
    }
  },
  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 100,
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
    size: 100,
    cell: ({ getValue }) => {
      const value = getValue<JobHistory["duration_millis"]>();
      const readableTime = dayjs.duration(value, "milliseconds").humanize();
      return <span>{readableTime}</span>;
    }
  },
  {
    header: "Statistics",
    id: "statistics",
    columns: [
      {
        header: "Success",
        id: "success_count",
        accessorKey: "success_count",
        size: 100,
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
        size: 100,
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
    size: 100
  },
  {
    header: "Resource ID",
    id: "resource_id",
    accessorKey: "resource_id",
    size: 150,
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
