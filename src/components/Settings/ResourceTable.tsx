import { SchemaResourceWithJobStatus } from "@flanksource-ui/api/schemaResources";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import Popover from "@flanksource-ui/ui/Popover/Popover";
import { TagItem, TagList } from "@flanksource-ui/ui/Tags/TagList";
import { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AgentBadge from "../Agents/AgentBadge";
import JobHistoryStatusColumn from "../JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "../JobsHistory/JobsHistoryDetails";
import ConfigScrapperIcon from "../SchemaResourcePage/ConfigScrapperIcon";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";

function MRTJobHistoryStatusColumn({
  row
}: {
  row: MRT_Row<
    SchemaResourceWithJobStatus & {
      table: SchemaResourceType["table"];
    }
  >;
}) {
  const { job_details, job_status, name, job_name } = row.original;

  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);

  const isJobDetailsEmpty =
    !job_details || Object.keys(job_details).length === 0;

  return (
    <div
      className="flex flex-row items-center gap-2"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <JobHistoryStatusColumn
        status={job_status}
        onClick={() => {
          setIsJobDetailsModalOpen(true);
        }}
      />
      {!isJobDetailsEmpty && (
        <>
          <JobsHistoryDetails
            isModalOpen={isJobDetailsModalOpen}
            setIsModalOpen={setIsJobDetailsModalOpen}
            job={{
              details: job_details,
              name: job_name ?? name
            }}
          />

          <button
            className="inline text-nowrap text-blue-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsJobDetailsModalOpen(true);
            }}
          >
            (View details)
          </button>
        </>
      )}
    </div>
  );
}

function DataTableTagsColumn({
  row
}: {
  row: MRT_Row<
    SchemaResourceWithJobStatus & {
      table: SchemaResourceType["table"];
    }
  >;
}) {
  const { labels } = row.original;

  const tags = useMemo(() => {
    return Object.entries(labels ?? {}).map(([key, value]) => ({
      key,
      value
    }));
  }, [labels]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {tags.length > 0 && (
        <Popover
          toggle={
            <div className="flex flex-row items-center">
              <div className="flex-shrink cursor-pointer overflow-x-hidden">
                <TagItem tag={tags[0]!} />
              </div>
              {tags.length > 1 && (
                <div className="justify-left flex-shrink cursor-pointer space-x-2 whitespace-nowrap text-xs underline decoration-solid">
                  +{tags.length - 1} more
                </div>
              )}
            </div>
          }
          title="Tags"
          placement="left"
          menuClass="top-8"
        >
          <div className="flex flex-col p-3">
            <div className="flex max-h-64 flex-col items-stretch overflow-y-auto">
              <TagList
                className="flex flex-1 flex-col"
                tags={tags}
                minimumItemsToShow={tags.length}
              />
            </div>
          </div>
        </Popover>
      )}
    </>
  );
}

const columns: MRT_ColumnDef<
  SchemaResourceWithJobStatus & {
    table: SchemaResourceType["table"];
  }
>[] = [
  {
    accessorKey: "name",
    enableResizing: true,
    header: "Name",
    minSize: 100,
    Cell: ({ row }) => {
      const { agent, name, spec, table } = row.original;

      return (
        <div className="flex w-full flex-row items-center gap-2 truncate">
          {table === tables.config_scrapers && (
            <div className="min-w-max">
              <ConfigScrapperIcon spec={spec} />
            </div>
          )}
          <div data-tip={name} className="block truncate">
            <span className="mr-1"> {name}</span>
            <AgentBadge agent={agent} />
          </div>
        </div>
      );
    }
  },
  {
    header: "Source",
    accessorKey: "sourceConfig",
    enableResizing: true,
    minSize: 100,
    Cell: ({ row }) => {
      const { source, id, name, namespace } = row.original;

      return source && source === "KubernetesCRD" ? (
        <Link
          to={`/catalog/${id}`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="text-gray-500">
            {namespace ? <>{namespace}/</> : ""}
            {name}
          </span>
        </Link>
      ) : (
        <a href={`${source}`}>Link</a>
      );
    }
  },
  {
    header: "Agent",
    accessorKey: "agent",
    enableResizing: true,
    Cell: ({ row }) => {
      return row.original.name;
    }
  },
  {
    header: "Schedule",
    accessorKey: "schedule",
    enableResizing: false,
    size: 100
  },
  {
    header: "Namespace",
    accessorKey: "namespace",
    enableResizing: true,
    size: 150
  },
  {
    accessorKey: "jobStatus",
    header: "Job Status",
    enableResizing: true,
    Cell: ({ row }) => <MRTJobHistoryStatusColumn row={row} />
  },
  {
    accessorKey: "last_runtime",
    header: "Last Run",
    enableResizing: false,
    Cell: MRTDateCell,
    size: 120
  },
  {
    accessorKey: "job_last_failed",
    header: "Last Failed",
    enableResizing: false,
    Cell: MRTDateCell,
    size: 140
  },
  {
    header: "Tags",
    accessorKey: "tags",
    enableResizing: true,
    enableSorting: false,
    Cell: ({ row }) => <DataTableTagsColumn row={row} />,
    minSize: 250
  },
  {
    header: "Created",
    accessorKey: "created_at",
    enableResizing: false,
    Cell: MRTDateCell,
    size: 120
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    enableResizing: false,
    Cell: MRTDateCell,
    size: 120
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    enableResizing: false,
    enableSorting: false,
    size: 120,
    Cell: ({ row, column }) => {
      const { created_by } = row.original;
      if (!created_by) {
        return null;
      }
      return <Avatar user={created_by} />;
    }
  }
];

/**
 *
 * Columns that are permanently hidden for each table, regardless of user
 * settings or preferences, and cannot be shown for that table.
 *
 */
const permanentlyHiddenColumnsForTableMap: Record<
  SchemaResourceType["table"],
  string[]
> = {
  topologies: ["schedule"],
  connections: ["schedule", "namespace"],
  logging_backends: ["schedule", "namespace"],
  notifications: ["schedule", "namespace"],
  properties: ["schedule", "namespace"],
  canaries: ["namespace"],
  config_scrapers: ["schedule", "namespace"],
  incident_rules: ["schedule", "namespace"],
  teams: ["schedule", "namespace"]
};

type ResourceTableProps = {
  data: SchemaResourceWithJobStatus[];
  onRowClick: (row: SchemaResourceWithJobStatus) => void;
  table: SchemaResourceType["table"];
  isLoading?: boolean;
  enableServerSidePagination?: boolean;
};

export default function ResourceTable({
  data,
  onRowClick,
  table: sqlTable,
  isLoading = false
}: ResourceTableProps) {
  const columnsDerived = useMemo(() => {
    return columns.filter(
      (column) =>
        !permanentlyHiddenColumnsForTableMap[sqlTable].includes(
          column.accessorKey!
        )
    );
  }, [sqlTable]);

  const dataWithTable = useMemo(
    () => data.map((row) => ({ ...row, table: sqlTable })),
    [data, sqlTable]
  );

  return (
    <MRTDataTable
      data={dataWithTable}
      columns={columnsDerived}
      onRowClick={onRowClick}
      isLoading={isLoading}
    />
  );
}
