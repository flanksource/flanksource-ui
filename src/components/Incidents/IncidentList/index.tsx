import { useNavigate } from "react-router-dom";
import { Dayjs } from "dayjs";
import { v4 as uuid } from "uuid";
import { AvatarGroup } from "../../AvatarGroup";
import { IncidentStatusTag } from "../../IncidentStatusTag";
import { IncidentSeverityTag } from "../../IncidentSeverityTag";
import { IncidentTypeTag } from "../../incidentTypeTag";
import { formatDate } from "../../../utils/date";

export function IncidentList({ list, ...rest }) {
  return (
    <div className="border border-gray-200 rounded-md w-full">
      <table className="table-auto w-full" aria-label="table" {...rest}>
        <thead className="rounded-md">
          <tr className="border-b border-gray-200 uppercase bg-column-background rounded-t-md items-center">
            <th className="px-3 py-3 text-gray-500 font-medium text-xs text-left w-40">
              Type
            </th>
            <th className="px-3 py-3 text-gray-500 font-medium text-xs text-left w-32">
              Severity
            </th>
            <th className="px-3 py-3 text-gray-500 font-medium text-xs text-left w-32">
              Status
            </th>
            <th
              className="px-6 py-3 text-gray-500 font-medium text-xs col-span-2 text-left"
              colSpan={2}
            >
              Name
            </th>
            <th className="px-3 py-3 text-gray-500 font-medium text-xs text-left">
              Age
            </th>
            <th
              className="px-3 py-3 text-gray-500 font-medium text-xs col-span-2 text-left"
              colSpan={2}
            >
              Responders
            </th>
          </tr>
        </thead>
        <tbody className="flex-1 overflow-y-auto">
          {list.map((incident) => (
            <IncidentItem incident={incident} key={uuid()} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IncidentItem({ incident }) {
  const {
    title,
    id,
    created_at: createdAt
    // status
  } = incident;
  const age = (formatDate(createdAt) as Dayjs).fromNow();
  const navigate = useNavigate();
  const navigateToIncidentDetails = (id) => {
    navigate(`/incidents/${id}`);
  };

  return (
    <tr
      className="last:border-b-0 border-b cursor-pointer"
      onClick={() => navigateToIncidentDetails(id)}
    >
      <td className="py-4 px-3">
        <div className="flex flex-row items-center">
          <IncidentTypeTag type={incident.type} />
        </div>
      </td>
      <td className="py-4 px-3">
        <div className="flex flex-row items-center">
          <IncidentSeverityTag severity={incident.severity} />
        </div>
      </td>
      <td className="px-3 py-4 shrink-0">
        <IncidentStatusTag status={incident.status} />
      </td>
      <td
        colSpan={2}
        className="px-6 py-4 text-gray-900 col-span-2 text-sm leading-5 font-medium"
      >
        {title}
      </td>
      <td className="px-3 text-gray-500 text-sm py-4">{age}</td>
      <td className="px-3 text-sm py-4" colSpan={2}>
        <div className="flex">
          {incident?.involved?.length && (
            <AvatarGroup maxCount={5} users={incident.involved} />
          )}
        </div>
      </td>
    </tr>
  );
}
