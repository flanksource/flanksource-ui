import {
  PlaybookRun,
  PlaybookRunStatus
} from "@flanksource-ui/api/types/playbooks";
import { User } from "@flanksource-ui/api/types/users";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PlaybookSpecIcon from "../Settings/PlaybookSpecIcon";
import { PlaybookStatusDescription } from "./PlaybookRunsStatus";
import { Tooltip } from "react-tooltip";
import { FaReply } from "react-icons/fa";

const playbookRunsTableColumns: MRT_ColumnDef<PlaybookRun>[] = [
  {
    header: "Name",
    accessorKey: "name",
    Cell: ({ row }) => {
      return <PlaybookSpecIcon playbook={row.original.playbooks!} showLabel />;
    },
    size: 400
  },
  {
    header: "Resource",
    Cell: ({ row }) => {
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
    Cell: ({ cell, row }) => {
      const { parent_id: parentID } = row.original;
      const status = cell.getValue<PlaybookRunStatus>();
      if (parentID) {
        return (
          <div className="flex items-center gap-1">
            <PlaybookSpecIcon playbook={row.original.playbooks!} showLabel />
            {parentID && (
              <>
                <FaReply
                  className="h-3 w-3 text-gray-400"
                  data-tooltip-id="retry-tooltip"
                />
                <Tooltip
                  id="retry-tooltip"
                  content="Child run"
                  className="z-[9999]"
                />
              </>
            )}
          </div>
        );
      }

      return <PlaybookStatusDescription status={status} />;
    }
  },
  {
    header: "Date",
    accessorKey: "start_time",
    Cell: MRTDateCell,
    sortingFn: "datetime"
  },
  {
    header: "Duration",
    accessorKey: "duration",
    Cell: ({ row }) => {
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
    Cell: MRTDateCell,
    sortingFn: "datetime"
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    Cell: ({ cell }) => {
      const user = cell.getValue<User>();
      return <Avatar user={user} circular />;
    }
  }
];

type Props = {
  data: PlaybookRun[];
  isLoading?: boolean;
  numberOfPages?: number;
  totalRecords?: number;
};

export default function PlaybookRunsTable({
  data,
  isLoading,
  numberOfPages,
  totalRecords
}: Props) {
  const navigate = useNavigate();

  const onRowClick = useCallback(
    (row: PlaybookRun) => {
      navigate(`/playbooks/runs/${row.id}`);
    },
    [navigate]
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-hidden">
      <MRTDataTable
        columns={playbookRunsTableColumns}
        data={data}
        isLoading={isLoading}
        onRowClick={(row) => onRowClick(row)}
        manualPageCount={numberOfPages}
        totalRowCount={totalRecords}
        enableServerSidePagination
        enableServerSideSorting
        disableHiding
      />
    </div>
  );
}
