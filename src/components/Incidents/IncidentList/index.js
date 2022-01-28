import { useNavigate } from "react-router-dom";
import cx from "clsx";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { Icon } from "../../Icon";
import responders from "../../../data/responders.json";
import { severityData } from "../../../data/severityData";

export function IncidentList({ list, ...rest }) {
  return (
    <div className="border border-border-color rounded-md flex flex-col">
      <table
        className="table-fixed table-auto w-full relative"
        aria-label="table"
        {...rest}
      >
        <thead className="rounded-md sticky top-16 z-20">
          <tr className="border-b border-border-color uppercase bg-column-background rounded-t-md  items-center">
            <th
              className="px-6 py-3 text-medium-gray font-medium text-xs col-span-2 sticky top-0 text-left"
              colSpan={2}
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
            <th
              className="py-3 text-medium-gray font-medium text-xs col-span-2 sticky top-0 text-left"
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
  const { title, id, created_at: createdAt, severity, status } = incident;
  const age = dayjs(createdAt).fromNow();
  const navigate = useNavigate();
  const navigateToIncidentDetails = (id) => {
    navigate(`/incidents/${id}`);
  };
  const getSeverity = () => {
    let data;
    switch (severity) {
      case 0:
        data = severityData.low;
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        data = severityData.high;
        break;
      default:
        data = severityData.high;
    }
    return data;
  };
  return (
    <tr
      className=" items-center last:border-b-0 border-b cursor-pointer"
      onClick={() => navigateToIncidentDetails(id)}
    >
      <td
        colSpan={2}
        className="px-6 py-4 text-darker-black col-span-2 text-sm leading-5 font-medium"
      >
        {title}
      </td>
      <td className="flex flex-row items-center py-3">
        <Icon name={getSeverity().icon} />
        <p className="text-darker-black text-sm leading-5 font-normal ml-2.5">
          {getSeverity().text}
        </p>
      </td>
      <td className="py-4">
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
      <td className="text-medium-gray text-sm py-4">{age}</td>
      <td className="text-sm py-4" colSpan={2}>
        <div className="flex">
          {responders.map(({ image, name }) => (
            <div
              className="flex flex-row mr-4 items-center justify-between"
              key={name}
            >
              <img
                className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                src={image}
                alt=""
              />
              <p className="ml-1 text-sm text-dark-gray font-normal">{name}</p>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}
