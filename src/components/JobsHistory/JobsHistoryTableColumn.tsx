import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FaDotCircle } from "react-icons/fa";
import { JobHistory, JobHistoryStatus } from "./JobsHistoryTable";
import { formatDateToSeconds, formatMStoReadable } from "../../utils/date";
import { formatJobName } from "../../utils/common";

function JobsTableDateCell({ getValue }: CellContext<JobHistory, any>) {
  const value = getValue();
  return <span>{formatDateToSeconds(value)}</span>;
}

export const JobsHistoryTableColumn: ColumnDef<JobHistory, any>[] = [
  {
    header: "Timestamp",
    id: "time_start",
    accessorKey: "time_start",
    size: 150,
    cell: JobsTableDateCell
  },
  {
    header: "Job Name",
    id: "name",
    accessorKey: "name",
    size: 200,
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
      const classNameMaps = new Map<JobHistoryStatus, string>([
        ["FINISHED", "text-green-500"],
        ["RUNNING", "text-yellow-500"]
      ]);
      const className = classNameMaps.get(value) ?? "";
      return (
        <span className={`lowercase`}>
          <FaDotCircle className={`inline ${className}`} /> {value}
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
      const readableTime = formatMStoReadable(value);
      return <span>{readableTime}</span>;
    }
  },
  // {
  //   header: "Host Name",
  //   id: "hostname",
  //   accessorKey: "hostname",
  //   size: 100
  // },

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
  // {
  //   header: "Time End",
  //   id: "time_end",
  //   accessorKey: "time_end",
  //   size: 100,
  //   cell: JobsTableDateCell
  // }
];
