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
    <div>
      <table className="table-auto w-full" aria-label="table">
        <thead className="rounded-md">
          <tr className="border-b border-gray-200 uppercase bg-column-background rounded-t-md items-center">
            <th
              className="px-6 py-3 text-gray-500 font-medium text-xs col-span-2 text-left"
              colSpan={2}
            >
              Name
            </th>
            <th className="px-3 py-3 text-gray-500 font-medium text-xs text-left">
              Editable
            </th>
            <th className="px-3 py-3 text-gray-500 font-medium text-xs text-left">
              Created At
            </th>
            <th className="px-3 py-3 text-gray-500 font-medium text-xs text-left">
              Updated At
            </th>
            <th className="px-3 py-3 text-gray-500 font-medium text-xs text-left">
              Created By
            </th>
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
      <td
        colSpan={2}
        className="px-6 py-4 text-gray-900 col-span-2 text-sm leading-5 font-medium"
      >
        {name}
      </td>
      <td className="px-3 py-4 shrink-0">{source ? "yes" : "no"}</td>
      <td className="px-3 text-gray-500 text-sm py-4">
        {dayjs(created_at).fromNow()}
      </td>
      <td className="px-3 text-gray-500 text-sm py-4">
        {dayjs(updated_at).fromNow()}
      </td>
      {created_by && (
        <td className="px-3 text-gray-500 text-sm py-4">
          {<Avatar user={created_by} />}
        </td>
      )}
    </tr>
  );
}
