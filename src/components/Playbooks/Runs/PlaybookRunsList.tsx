import {
  PlaybookRun,
  PlaybookRunStatus
} from "@flanksource-ui/api/types/playbooks";
import { User } from "@flanksource-ui/api/types/users";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { DataTable, PaginationOptions } from "@flanksource-ui/ui/DataTable";
import { DateCell } from "@flanksource-ui/ui/DataTable/Cells/DateCells";
import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../../Icon";
import PlaybookSpecIcon from "../Settings/PlaybookSpecIcon";
import { PlaybookStatusDescription } from "./PlaybookRunsStatus";

const playbookRunsTableColumns: ColumnDef<PlaybookRun>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return <PlaybookSpecIcon playbook={row.original.playbooks!} showLabel />;
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
      return <PlaybookStatusDescription status={status} />;
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
      return (
        <FormatDuration
          startTime={row.original.start_time}
          endTime={row.original.end_time}
        />
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
