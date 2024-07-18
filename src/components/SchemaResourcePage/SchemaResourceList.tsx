import { useUserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import clsx from "clsx";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { SchemaResourceWithJobStatus } from "../../api/schemaResources";
import { tables } from "../../context/UserAccessContext/permissions";
import { Age } from "../../ui/Age";
import { Avatar } from "../../ui/Avatar";
import Popover from "../../ui/Popover/Popover";
import TableSkeletonLoader from "../../ui/SkeletonLoader/TableSkeletonLoader";
import { TagItem, TagList } from "../../ui/Tags/TagList";
import AgentBadge from "../Agents/AgentBadge";
import { InfoMessage } from "../InfoMessage";
import JobHistoryStatusColumn from "../JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "../JobsHistory/JobsHistoryDetails";
import ConfigScrapperIcon from "./ConfigScrapperIcon";

interface Props {
  items: SchemaResourceWithJobStatus[];
  baseUrl: string;
  table: string;
  isLoading?: boolean;
}

export function SchemaResourceList({
  items,
  baseUrl,
  table,
  isLoading
}: Props) {
  return (
    <div className="mx-auto flex flex-1 flex-col justify-center space-y-6 overflow-y-auto">
      <div className="flex w-full flex-1 flex-col overflow-y-auto">
        <table
          className="relative w-full table-auto table-fixed rounded-md border border-gray-200"
          aria-label="table"
        >
          <thead className={`sticky top-0 z-01 rounded-md`}>
            <tr className="items-center rounded-t-md border-b border-gray-200 bg-column-background uppercase">
              <HCell colSpan={2}>Name</HCell>
              <HCell colSpan={2}>Source Config</HCell>
              <HCell>Agent</HCell>
              {table === "canaries" && <HCell>Schedule</HCell>}
              {table === "topologies" && <HCell colSpan={2}>namespace</HCell>}
              <HCell colSpan={2}>Job Status</HCell>
              <HCell>Last Run</HCell>
              <HCell>Last Failed</HCell>
              <HCell colSpan={2}>Tags</HCell>
              <HCell>Created At</HCell>
              <HCell>Updated At</HCell>
              <HCell>Created By</HCell>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <SchemaResourceListItem
                table={table}
                key={item.id}
                {...item}
                baseUrl={baseUrl}
              />
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="flex items-center justify-center border-b border-gray-300 px-2 text-center text-gray-400">
            {isLoading ? (
              <TableSkeletonLoader className="mt-2" />
            ) : (
              <InfoMessage className="my-8 py-20" message="No data available" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface CellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

function HCell({
  children,
  className = "px-3 py-3 text-gray-500 font-medium text-xs text-left",
  colSpan
}: CellProps) {
  return (
    <th colSpan={colSpan ?? 1} className={className}>
      {children}
    </th>
  );
}

function Cell({ children, className, colSpan }: CellProps) {
  return (
    <td
      colSpan={colSpan ?? 1}
      className={clsx("border-b px-3 py-3 text-sm", className)}
    >
      {children}
    </td>
  );
}

function SchemaResourceListItem({
  name,
  created_at,
  updated_at,
  id,
  source,
  baseUrl,
  created_by,
  table,
  schedule,
  job_status,
  namespace,
  agent,
  spec,
  job_details,
  job_name,
  last_runtime,
  job_last_failed,
  labels
}: SchemaResourceWithJobStatus & {
  baseUrl: string;
  table: string;
}) {
  const { hasResourceAccess } = useUserAccessStateContext();

  const navigate = useNavigate();
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const navigateToDetails = async (id: string) => {
    const hasAccess = await hasResourceAccess(table, "write");
    if (!hasAccess) {
      toast.error("You do not have access to this resource");
      return;
    }
    return navigate(`${baseUrl}/${id}`);
  };

  const tags = useMemo(() => {
    return Object.entries(labels ?? {}).map(([key, value]) => ({
      key,
      value
    }));
  }, [labels]);

  const isJobDetailsEmpty =
    !job_details || Object.keys(job_details).length === 0;

  return (
    <tr
      className="cursor-pointer border-b last:border-b-0"
      onClick={() => navigateToDetails(id)}
    >
      <Cell
        colSpan={2}
        className="overflow-hidden truncate font-medium leading-5 text-gray-900"
      >
        <div className="flex w-full flex-row items-center gap-2 truncate">
          {table === tables.config_scrapers && (
            <ConfigScrapperIcon spec={spec} />
          )}
          <div data-tip={name} className="block truncate">
            <span className="mr-1"> {name}</span>
            <AgentBadge agent={agent} />
          </div>
        </div>
      </Cell>
      <Cell
        colSpan={2}
        className="shrink-0 overflow-hidden text-ellipsis text-nowrap"
      >
        {source && source === "KubernetesCRD" ? (
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
        )}
      </Cell>
      <Cell>{agent?.name}</Cell>
      {table === "canaries" && <Cell>{schedule}</Cell>}
      {table === "topologies" && <Cell colSpan={2}>{namespace}</Cell>}

      <Cell colSpan={2}>
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
      </Cell>
      <Cell className="text-gray-500">
        <Age from={last_runtime} suffix={true} />
      </Cell>
      <Cell className="text-gray-500">
        <Age from={job_last_failed} suffix={true} />
      </Cell>
      <Cell colSpan={2} className="text-gray-500">
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
      </Cell>
      <Cell className="text-gray-500">
        <Age from={created_at} suffix={true} />
      </Cell>
      <Cell className="text-gray-500">
        <Age from={updated_at} suffix={true} />
      </Cell>
      <Cell className="text-gray-500">
        {created_by && <Avatar user={created_by} circular />}
      </Cell>
    </tr>
  );
}
