import { useNavigate } from "react-router-dom";
import cx from "clsx";
import dayjs from "dayjs";
import { Icon } from "../../Icon";
import responders from "../../../data/responders.json";

export function IncidentList({ list, ...rest }) {
  return (
    <div className="border border-border-color rounded-md flex flex-col">
      <table
        className="table-fixed table-auto w-full relative"
        aria-label="table"
        {...rest}
      >
        <thead className="rounded-md sticky top-16 z-20">
          <tr className="grid grid-cols-7 gap-0 border-b border-border-color uppercase bg-column-background rounded-t-md  items-center">
            <th
              className="px-6 py-3 text-medium-gray font-medium text-xs col-span-2 sticky top-0 text-left"
              scope="row"
            >
              Name
            </th>
            <th className="py-3 text-medium-gray font-medium text-xs sticky top-0 text-left">
              Severity
            </th>
            <th className="py-3 text-medium-gray font-medium text-xs sticky top-0 text-left">
              Status
            </th>
            <th className="py-3 text-medium-gray font-medium text-xs sticky top-0 text-left">
              Age
            </th>
            <th className="py-3 text-medium-gray font-medium text-xs col-span-2 sticky top-0 text-left">
              Responders
            </th>
          </tr>
        </thead>
        <tbody className="flex-1 overflow-y-auto">
          {list.map((incident) => (
            <IncidentItem incident={incident} key={incident.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IncidentItem({ incident }) {
  const { title, id, created_at: createdAt, severity, status } = incident;
  const age = dayjs(createdAt).fromNow();
  const navigate = useNavigate();
  const goToIncidentsDetailById = (id) => {
    navigate(`/incidents/${id}`);
  };
  return (
    <tr
      className="grid grid-cols-7 items-center last:border-b-0 border-b cursor-pointer"
      onClick={() => goToIncidentsDetailById(id)}
    >
      <td className="px-6 py-3 text-gray-900 col-span-2 text-sm leading-5 font-medium">
        {title}
      </td>
      <td className="flex flex-row items-center py-3">
        <Icon name="chevron-double-up" />
        <p className="text-gray-900 text-sm leading-5 font-normal ml-2.5">
          {severity === 2 ? "High" : "Low"}
        </p>
      </td>
      <td className="py-3">
        <button
          className={cx(
            "text-light-black text-xs leading-4 font-medium py-0.5 px-2.5 rounded-10px",
            status === "open" ? "bg-light-green" : "bg-gray-100"
          )}
          type="button"
        >
          {status === "open" ? "Active" : "Resolved"}
        </button>
      </td>
      <td className="text-gray-400 text-sm py-3">{age}</td>
      <td className="text-gray-400 text-sm col-span-2 flex flex-row py-3">
        {responders.map(({ image, name }) => (
          <div className="flex flex-row mr-4 items-center" key={name}>
            <img
              className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
              src={image}
              alt=""
            />
            <p className="ml-1 text-sm text-dark-gray font-normal">{name}</p>
          </div>
        ))}
      </td>
    </tr>
  );
}
