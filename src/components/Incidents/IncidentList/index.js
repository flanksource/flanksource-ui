import { useNavigate } from "react-router-dom";
import cx from "clsx";
import dayjs from "dayjs";
import { Icon } from "../../Icon";

export function IncidentList({ list, ...rest }) {
  return (
    <div className="border border-gray-300 rounded-md flex flex-col">
      <table
        className="table-fixed table-auto w-full relative"
        aria-label="table"
        {...rest}
      >
        <thead className="rounded-md sticky top-16 z-20">
          <tr className="px-6 py-3 grid grid-cols-7 gap-0 border-b border-gray-300 uppercase bg-lightest-gray rounded-t-md  items-center">
            <th
              className="text-gray-800 text-xs col-span-2 sticky top-0 text-left"
              scope="row"
            >
              Name
            </th>
            <th className="text-gray-400 text-xs sticky top-0 text-left">
              Severity
            </th>
            <th className="text-gray-400 text-xs sticky top-0 text-left">
              Status
            </th>
            <th className="text-gray-400 text-xs sticky top-0 text-left">
              Age
            </th>
            <th className="text-gray-400 text-xs col-span-2 sticky top-0 text-left">
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

  const getAge = () => {
    const now = dayjs();
    let date;
    const create = dayjs(createdAt);
    if (now.diff(create, "day") <= 31) {
      date = `${now.diff(create, "day")} days`;
    } else if (now.diff(create, "month") <= 12) {
      date = `${now.diff(create, "month")} month`;
    } else if (now.diff(create, "month" > 12)) {
      date = `${now.diff(create, "year")} year`;
    }
    return date;
  };
  const navigate = useNavigate();
  const goToIncidentsDetailById = (id) => {
    navigate(`/incidents/${id}`);
  };
  return (
    <tr
      className="px-6 py-3 grid grid-cols-7 items-center last:border-b-0 border-b cursor-pointer"
      onClick={() => goToIncidentsDetailById(id)}
    >
      <td className="text-gray-900 col-span-2 text-sm leading-5 font-medium">
        {title}
      </td>
      <td className="flex flex-row items-center">
        <Icon name="caretDoubleUp" />
        <p className="text-gray-900 text-sm leading-5 font-normal ml-3">
          {severity === 2 ? "High" : "Low"}
        </p>
      </td>
      <td>
        <button
          className={cx(
            "text-gray-800 text-xs leading-4 font-medium py-0.5 px-2.5 rounded-10px",
            status === "open" ? "bg-light-green" : "bg-gray-100"
          )}
          type="button"
        >
          {status === "open" ? "Active" : "Resolved"}
        </button>
      </td>
      <td className="text-gray-400 text-sm">{getAge()}</td>
      <td className="text-gray-400 text-sm col-span-2 flex flex-row">
        {[
          {
            image:
              "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
            name: "John Ower"
          },
          {
            image:
              "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
            name: "John Werker"
          }
        ].map(({ image, name }) => (
          <div className="flex flex-row mr-4 items-center" key={name}>
            <img
              className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
              src={image}
              alt=""
            />
            <p className="ml-1 text-sm">{name}</p>
          </div>
        ))}
      </td>
    </tr>
  );
}
