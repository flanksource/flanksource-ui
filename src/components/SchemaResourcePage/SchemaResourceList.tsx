import clsx from "clsx";
import { useMemo, useState } from "react";
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
    <div className="mx-auto space-y-6 flex flex-col flex-1 overflow-y-auto justify-center">
      <div className="flex flex-col overflow-y-auto flex-1 w-full">
        <table
          className="table-auto table-fixed relative w-full border border-gray-200 rounded-md"
          aria-label="table"
        >
          <thead className={`rounded-md sticky top-0 z-01`}>
            <tr className="border-b border-gray-200 uppercase bg-column-background rounded-t-md items-center">
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
          <div className="flex items-center justify-center px-2 border-b border-gray-300 text-center text-gray-400">
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
      className={clsx("px-3 py-3 text-sm border-b", className)}
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
  const navigate = useNavigate();
  const navigateToDetails = (id: string) => navigate(`${baseUrl}/${id}`);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);

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
      className="last:border-b-0 border-b cursor-pointer"
      onClick={() => navigateToDetails(id)}
    >
      <Cell
        colSpan={2}
        className="leading-5 text-gray-900 font-medium overflow-hidden truncate"
      >
        <div className="flex flex-row w-full gap-2 items-center truncate">
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
        className="shrink-0 text-nowrap text-ellipsis overflow-hidden"
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
          className="flex flex-row gap-2 items-center"
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
                className="inline text-blue-500 text-nowrap"
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
                <div className="flex-shrink overflow-x-hidden cursor-pointer">
                  <TagItem tag={tags[0]!} />
                </div>
                {tags.length > 1 && (
                  <div className="flex-shrink whitespace-nowrap space-x-2 underline decoration-solid justify-left text-xs cursor-pointer">
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
              <div className="flex flex-col items-stretch max-h-64 overflow-y-auto">
                <TagList
                  className="flex flex-col flex-1"
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
