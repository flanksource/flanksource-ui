import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../../api/services/users";
import { Avatar } from "../../Avatar";
import { DateCell } from "../../ConfigViewer/columns";
import { AgentSummary } from "../AgentPage";

export const agentsTableColumns: ColumnDef<AgentSummary>[] = [
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
    header: "Created At",
    enableSorting: true,
    accessorKey: "created_at",
    cell: DateCell
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    enableSorting: true,
    cell: DateCell
  },
  {
    header: "Created By",
    minSize: 80,
    accessorKey: "created_by",
    cell: ({ row }) => {
      const createdBy = row?.getValue<User>("created_by");
      return <Avatar user={createdBy} />;
    }
  }
];
