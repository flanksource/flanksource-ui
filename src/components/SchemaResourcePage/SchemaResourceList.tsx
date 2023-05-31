import clsx from "clsx";
import { FaDotCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SchemaResourceWithJobStatus } from "../../api/schemaResources";
import { relativeDateTime } from "../../utils/date";
import { Avatar } from "../Avatar";
import { JobHistoryStatus } from "../JobsHistory/JobsHistoryTable";
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";
import { InfoMessage } from "../InfoMessage";

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
    <div className="max-w-screen-xl mx-auto space-y-6 flex flex-col justify-center">
      <div
        className="flex flex-col overflow-y-auto flex-1 w-full"
        style={{ maxHeight: "calc(100vh - 8rem)" }}
      >
        <table
          className="table-auto table-fixed relative w-full border border-gray-200 rounded-md"
          aria-label="table"
        >
          <thead className={`rounded-md sticky top-0 z-01`}>
            <tr className="border-b border-gray-200 uppercase bg-column-background rounded-t-md items-center">
              <HCell colSpan={2}>Name</HCell>
              <HCell>Source Config</HCell>
              {table === "canaries" && <HCell>Schedule</HCell>}
              <HCell>Created At</HCell>
              <HCell>Updated At</HCell>
              <HCell>Job Status</HCell>
              <HCell>Last Run</HCell>
              <HCell>Created By</HCell>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <SchemaResourceListItem
                table={table}
                key={item.id}
                {...item}
                schedule={item.spec?.schedule}
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
  job_time_start
}: SchemaResourceWithJobStatus & {
  baseUrl: string;
  table: string;
}) {
  const navigate = useNavigate();
  const navigateToDetails = (id: string) => navigate(`${baseUrl}/${id}`);

  const classNameMaps = new Map<JobHistoryStatus, string>([
    ["FINISHED", "text-green-500"],
    ["RUNNING", "text-yellow-500"]
  ]);
  const className = job_status ? classNameMaps.get(job_status) ?? "" : "";

  return (
    <tr
      className="last:border-b-0 border-b cursor-pointer"
      onClick={() => navigateToDetails(id)}
    >
      <Cell colSpan={2} className="leading-5 text-gray-900 font-medium">
        {name}
      </Cell>
      <Cell className="shrink-0">
        {!!source && <a href={`${source}`}>Link</a>}
      </Cell>
      {table === "canaries" && <Cell>{schedule}</Cell>}
      <Cell className="text-gray-500">
        {created_at && relativeDateTime(created_at)}
      </Cell>
      <Cell className="text-gray-500">
        {updated_at && relativeDateTime(updated_at)}
      </Cell>
      <Cell className="text-gray-500 lowercase space-x-2">
        {job_status && (
          <>
            <FaDotCircle className={`inline ${className}`} />
            <span>{job_status}</span>
          </>
        )}
      </Cell>
      <Cell className="text-gray-500">
        {job_time_start ? relativeDateTime(job_time_start) : ""}
      </Cell>
      <Cell className="text-gray-500">
        {created_by && <Avatar user={created_by} circular />}
      </Cell>
    </tr>
  );
}
