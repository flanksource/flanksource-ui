import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FaDotCircle } from "react-icons/fa";
import { relativeDateTime } from "../../utils/date";
import { JobHistory, JobHistoryStatus } from "./JobsHistoryTable";

function JobsTableDateCell({ getValue }: CellContext<JobHistory, any>) {
  const value = getValue();
  return <span>{relativeDateTime(value)}</span>;
}

export const JobsHistoryTableColumn: ColumnDef<JobHistory, any>[] = [
  {
    header: "Timestamp",
    id: "time_start",
    accessorKey: "time_start",
    size: 100,
    cell: JobsTableDateCell
  },
  {
    header: "Job Name",
    id: "name",
    accessorKey: "name",
    size: 250
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
    header: "Duration (Millis)",
    id: "duration_millis",
    accessorKey: "duration_millis",
    size: 100
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
    size: 100
  }
  // {
  //   header: "Time End",
  //   id: "time_end",
  //   accessorKey: "time_end",
  //   size: 100,
  //   cell: JobsTableDateCell
  // }
];
