import { SchemaResourceWithJobStatus } from "@flanksource-ui/api/schemaResources";
import { User } from "@flanksource-ui/api/types/users";
import AgentBadge from "@flanksource-ui/components/Agents/AgentBadge";
import JobHistoryStatusColumn from "@flanksource-ui/components/JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "@flanksource-ui/components/JobsHistory/JobsHistoryDetails";
import { JobHistoryStatus } from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { LogsIcon } from "@flanksource-ui/ui/Icons/LogsIcon";
import { SearchInListIcon } from "@flanksource-ui/ui/Icons/SearchInListIcon";
import { TopologyIcon } from "@flanksource-ui/ui/Icons/TopologyIcon";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";

function IntegrationListNameCell({
  row
}: MRTCellProps<SchemaResourceWithJobStatus>) {
  const name = row.original.name;

  const icon = useMemo(() => {
    const type = row.original.integration_type;
    if (type === "scrapers") {
      return <SearchInListIcon className={"h-5 w-5"} />;
    }
    if (type === "topologies") {
      return <TopologyIcon className={"h-5 w-5"} />;
    }
    return <LogsIcon className={"h-5 w-5"} />;
  }, [row.original.integration_type]);

  const agent = row.original.agent;

  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="truncate">{name}</span>
      <AgentBadge agent={agent} />
    </div>
  );
}

function IntegrationListTypeCell({
  row
}: MRTCellProps<SchemaResourceWithJobStatus>) {
  const name = row.original.integration_type;

  const icon = useMemo(() => {
    const type = row.original.integration_type;
    if (type === "scrapers") {
      return <SearchInListIcon className={"h-5 w-5"} />;
    }
    if (type === "topologies") {
      return <TopologyIcon className={"h-5 w-5"} />;
    }
    return <LogsIcon className={"h-5 w-5"} />;
  }, [row.original.integration_type]);

  return (
    <div className="flex items-center gap-2 capitalize">
      {icon}
      <span className="truncate">{name}</span>
    </div>
  );
}

export const integrationsTableColumns: MRT_ColumnDef<SchemaResourceWithJobStatus>[] =
  [
    // {
    //   id: "integration_type",
    //   header: "Type",
    //   accessorKey: "integration_type",
    //   Cell: IntegrationListTypeCell,
    //   size: 350,
    //   enableHiding: true
    // },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      size: 250,
      Cell: IntegrationListNameCell
    },
    {
      id: "namespace",
      header: "Namespace",
      accessorKey: "namespace"
    },
    {
      id: "source",
      header: "Source",
      accessorKey: "source"
    },
    {
      id: "job_status",
      accessorKey: "job_status",
      header: "Job Status",
      Cell: ({ column, row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isModalOpen, setIsModalOpen] = useState(false);

        const { job_details, job_name, name } = row.original;

        const isJobDetailsEmpty =
          !job_details || Object.keys(job_details).length === 0;

        const status = row.getValue<JobHistoryStatus>(column.id);

        return (
          <div
            className="flex flex-row items-center gap-1 lowercase"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsModalOpen(true);
            }}
          >
            <JobHistoryStatusColumn
              onClick={() => setIsModalOpen(true)}
              status={status}
            />
            {!isJobDetailsEmpty && (
              <>
                <button
                  className="inline text-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  (View details)
                </button>

                <JobsHistoryDetails
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  job={{
                    details: job_details,
                    name: job_name ?? name
                  }}
                />
              </>
            )}
          </div>
        );
      }
    },
    {
      id: "last_run",
      header: "Last Run",
      Cell: ({ row }) => {
        const startTime = row.original.job_time_start;
        return <Age from={startTime} suffix={true} />;
      }
    },
    // {
    //   id: "last_failed",
    //   header: "Last Failed",
    //   accessorKey: "job_last_failed",
    //   cell: ({ row }) => {
    //     const startTime = row.original.job_last_failed;
    //     return <Age from={startTime} suffix={true} />;
    //   }
    // },
    {
      id: "created_by",
      header: "Created By",
      accessorFn: (row) => row.created_by,
      Cell: ({ row, column }) => {
        const user = row.getValue<User>(column.id);
        return user ? <Avatar user={user} circular /> : null;
      }
    },
    {
      id: "Created At",
      header: "Created At",
      accessorFn: (row) => row.created_at,
      Cell: MRTDateCell
    },
    {
      id: "Updated At",
      header: "Updated At",
      accessorFn: (row) => row.updated_at,
      Cell: MRTDateCell
    }
  ];
