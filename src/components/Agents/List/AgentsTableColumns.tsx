import { User } from "@flanksource-ui/api/types/users";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import clsx from "clsx";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { FaDotCircle } from "react-icons/fa";
import { AgentSummary } from "../AgentPage";

export const agentsTableColumns: MRT_ColumnDef<AgentSummary>[] = [
  {
    header: "Name",
    accessorKey: "name",
    minSize: 150,
    enableSorting: true
  },
  {
    header: "Configs",
    accessorKey: "config_count"
  },
  {
    header: "Checks",
    accessorKey: "checks_count"
  },
  {
    header: "Scrapers",
    accessorKey: "config_scrapper_count"
  },
  {
    header: "Playbook Runs",
    accessorKey: "playbook_runs_count"
  },
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    Cell: ({ row }) => {
      const lastSeen = row.original.last_seen;
      if (!lastSeen) {
        return null;
      }

      const lastSeenDate = dayjs(lastSeen);
      const now = dayjs().utc();

      // If the agent was seen in the last minute, consider it online
      const isOnline = now.diff(lastSeenDate, "seconds") < 61;

      return (
        <div className="flex flex-row items-center gap-1">
          <FaDotCircle
            className={clsx(isOnline ? "text-green-500" : "text-red-500")}
          />
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>
      );
    }
  },
  {
    header: "Last Pushed",
    enableSorting: true,
    accessorKey: "last_received",
    Cell: MRTDateCell
  },
  {
    header: "Created At",
    enableSorting: true,
    accessorKey: "created_at",
    Cell: MRTDateCell
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    enableSorting: true,
    Cell: MRTDateCell
  },
  {
    header: "Created By",
    minSize: 80,
    accessorKey: "created_by",
    Cell: ({ row }) => {
      const createdBy = row?.getValue<User>("created_by");
      return <Avatar user={createdBy} />;
    }
  }
];
