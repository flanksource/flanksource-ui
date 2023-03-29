import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { SchemaResourceI } from "../../api/schemaResources";
import { relativeDateTime } from "../../utils/date";
import { Avatar } from "../Avatar";

interface Props {
  items: SchemaResourceI[];
  baseUrl: string;
  table: string;
}

export function SchemaResourceList({ items, baseUrl, table }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto space-y-6 flex flex-col justify-center">
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 8rem)" }}
      >
        <table
          className="table-auto table-fixed w-full relative"
          aria-label="table"
        >
          <thead className={`bg-white sticky top-0 z-01`}>
            <tr>
              <HCell colSpan={2}>Name</HCell>
              <HCell>Source Config</HCell>
              {table === "canaries" && <HCell>Schedule</HCell>}
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
      </div>
    </div>
  );
}

interface CellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

function HCell({ children, className, colSpan }: CellProps) {
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
  schedule
}: SchemaResourceI & {
  baseUrl: string;
  table: string;
}) {
  const navigate = useNavigate();
  const navigateToDetails = (id: string) => navigate(`${baseUrl}/${id}`);

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
      <Cell className="text-gray-500">{relativeDateTime(created_at)}</Cell>
      <Cell className="text-gray-500">{relativeDateTime(updated_at)}</Cell>
      <Cell className="text-gray-500">
        {created_by && <Avatar user={created_by} circular />}
      </Cell>
    </tr>
  );
}
