import {
  PlaybookRun,
  PlaybookRunStatus
} from "@flanksource-ui/api/types/playbooks";
import { User } from "@flanksource-ui/api/types/users";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { DataTable, PaginationOptions } from "@flanksource-ui/ui/DataTable";
import { DateCell } from "@flanksource-ui/ui/DataTable/Cells/DateCells";
import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
      const configId = row.original.config_id;
      const config = row.original.config;
      const checkId = row.original.check_id;
      const check = row.original.check;

      return (
        <div className="flex flex-row items-center gap-1">
          {componentId && component && (
            <>
              <Icon name={component?.icon} className="h-auto w-5" />
              <span> {component.name}</span>
            </>
          )}
          {configId && config && (
            <>
              <ConfigIcon className="h-auto w-5" config={config} />
              <span className="overflow-hidden text-ellipsis text-sm">
                {config.name}
              </span>
            </>
          )}
          {checkId && check && (
            <>
              <Icon name={check.type} className="h-auto w-5" />
              <span className="flex-1 overflow-hidden text-ellipsis">
                {check.name}
              </span>
            </>
          )}
        </div>
      );
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
    <div className="flex flex-1 flex-col overflow-y-hidden" {...rest}>
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
