import { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../../api/services/users";
import { relativeDateTime } from "../../../utils/date";
import { Avatar } from "../../Avatar";
import { DateCell } from "../../ConfigViewer/columns";
import { DataTable, PaginationOptions } from "../../DataTable";
import { Icon } from "../../Icon";
import { PlaybookRun, PlaybookRunStatus } from "./PlaybookRunTypes";
import PlaybookRunsStatus from "./PlaybookRunsStatus";

const playbookRunsTableColumns: ColumnDef<PlaybookRun>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return row.original.playbooks?.name;
    },
    size: 400
  },
  {
    header: "Resource",
    cell: ({ row }) => {
      const component = row.original.component;
      const componentId = row.original.component_id;

      if (componentId) {
        return (
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="block"
            to={`/topology/${componentId}`}
          >
            <Icon name={component?.icon} className="mr-2 h-5" />
            <span>{component?.name}</span>
          </Link>
        );
      }
    }
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue<PlaybookRunStatus>();
      return <PlaybookRunsStatus status={status} className="capitalize" />;
    }
  },
  {
    header: "Date",
    accessorKey: "start_time",
    cell: DateCell,
    sortingFn: "datetime"
  },
  {
    header: "Duration",
    accessorKey: "duration",
    cell: ({ row }) => {
      const startTime = row.original.start_time;
      const endTime = row.original.end_time;

      return (
        <span>
          {startTime && endTime && relativeDateTime(startTime, endTime)}
        </span>
      );
    }
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: DateCell,
    sortingFn: "datetime"
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    cell: ({ getValue }) => {
      const user = getValue<User>();
      return <Avatar user={user} circular />;
    }
  }
];

type Props = {
  data: PlaybookRun[];
  isLoading?: boolean;
  pagination?: PaginationOptions;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

export default function PlaybookRunsTable({
  data,
  isLoading,
  className,
  ...rest
}: Props) {
  const navigate = useNavigate();

  const onRowClick = useCallback(
    (row: PlaybookRun) => {
      navigate(`/playbooks/runs/${row.id}`);
    },
    [navigate]
  );

  return (
    <div className="flex flex-col h-full overflow-y-hidden" {...rest}>
      <DataTable
        stickyHead
        columns={playbookRunsTableColumns}
        data={data}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
        preferencesKey="connections-list"
        savePreferences={false}
        handleRowClick={(row) => onRowClick(row.original)}
        className="overflow-x-hidden"
      />
    </div>
  );
}
