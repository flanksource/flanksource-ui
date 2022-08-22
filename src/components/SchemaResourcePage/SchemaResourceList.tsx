import clsx from "clsx";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { SchemaResourceI } from "src/api/schemaResources";
import { Avatar } from "../Avatar";

interface Props {
  items: SchemaResourceI[];
  baseUrl: string;
}

export function SchemaResourceList({ items, baseUrl }: Props) {
  return (
    <div className="w-full">
      <table className="table-auto w-full" aria-label="table">
        <thead>
          <tr>
            <HCell colSpan={2}>Name</HCell>
            <HCell>Source Config</HCell>
            <HCell>Created At</HCell>
            <HCell>Updated At</HCell>
            <HCell>Created By</HCell>
          </tr>
        </thead>
        <tbody className="flex-1 overflow-y-auto">
          {items.map((item) => (
            <SchemaResourceListItem key={item.id} {...item} baseUrl={baseUrl} />
          ))}
        </tbody>
      </table>
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
  created_by
}: SchemaResourceI & {
  baseUrl: string;
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
      <Cell className="text-gray-500">{dayjs(created_at).fromNow()}</Cell>
      <Cell className="text-gray-500">{dayjs(updated_at).fromNow()}</Cell>
      {created_by && (
        <Cell className="text-gray-500">{<Avatar user={created_by} />}</Cell>
      )}
    </tr>
  );
}
