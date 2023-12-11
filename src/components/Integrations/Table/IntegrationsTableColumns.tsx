import { SchemaResourceWithJobStatus } from "@flanksource-ui/api/schemaResources";
import { User } from "@flanksource-ui/api/types/users";
import { LogsIcon } from "@flanksource-ui/components/Icons/LogsIcon";
import { SearchInListIcon } from "@flanksource-ui/components/Icons/SearchInListIcon";
import { TopologyIcon } from "@flanksource-ui/components/Icons/TopologyIcon";
import JobHistoryStatusColumn from "@flanksource-ui/components/JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "@flanksource-ui/components/JobsHistory/JobsHistoryDetails";
import { JobHistoryStatus } from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { DateCell } from "@flanksource-ui/ui/table";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

function IntegrationListNameCell({
  row
}: CellContext<SchemaResourceWithJobStatus, any>) {
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

  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="truncate">{name}</span>
    </div>
  );
}

function IntegrationListTypeCell({
  row
}: CellContext<SchemaResourceWithJobStatus, any>) {
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

export const integrationsTableColumns: ColumnDef<SchemaResourceWithJobStatus>[] =
  [
    {
      id: "integration_type",
      header: "Type",
      accessorKey: "integration_type",
      cell: IntegrationListTypeCell,
      size: 350
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      size: 250,
      cell: IntegrationListNameCell
    },
    {
      id: "source",
      header: "Source",
      accessorKey: "source"
    },
    {
      id: "Created At",
      header: "Created At",
      accessorFn: (row) => row.created_at,
      cell: DateCell
    },
    {
      id: "Updated At",
      header: "Updated At",
      accessorFn: (row) => row.updated_at,
      cell: DateCell
    },
    {
      id: "job_status",
      accessorKey: "job_status",
      header: "Job Status",
      cell: ({ getValue, row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isModalOpen, setIsModalOpen] = useState(false);

        const { job_details, job_name, name } = row.original;

        const status = getValue<JobHistoryStatus>();
        return (
          <>
            <JobHistoryStatusColumn
              onClick={() => setIsModalOpen(true)}
              status={status}
            />
            <JobsHistoryDetails
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              job={{
                details: job_details,
                name: job_name ?? name
              }}
            />
          </>
        );
      }
    },
    {
      id: "last_run",
      header: "Last Run",
      cell: ({ row }) => {
        const startTime = row.original.job_time_start;
        return <Age from={startTime} suffix={true} />;
      }
    },
    {
      id: "created_by",
      header: "Created By",
      accessorFn: (row) => row.created_by,
      cell: ({ getValue }) => {
        const user = getValue<User>();
        return user ? <Avatar user={user} circular /> : null;
      }
    }
  ];
