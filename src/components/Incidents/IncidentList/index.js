import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import cx from "clsx";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { BsChevronDoubleDown, BsChevronDoubleUp } from "react-icons/all";
import responders from "../../../data/responders.json";

const IncidentStatus = {
  Open: "open",
  Closed: "closed"
};

const IncidentStatusLabel = {
  [IncidentStatus.Open]: "Open",
  [IncidentStatus.Closed]: "Closed"
};

const severityData = {
  low: { icon: <BsChevronDoubleDown color="#EB391E" />, text: "Low" },
  high: { icon: <BsChevronDoubleUp color="#EB391E" />, text: "High" }
};
export function IncidentList({ list, ...rest }) {
  return (
    <div className="border border-border-color rounded-md">
      <table
        className="table-fixed table-auto w-full"
        aria-label="table"
        {...rest}
      >
        <thead className="rounded-md">
          <tr className="border-b border-border-color uppercase bg-column-background rounded-t-md items-center">
            <th
              className="px-6 py-3 text-medium-gray font-medium text-xs col-span-2 text-left"
              colSpan={2}
            >
              Name
            </th>
            <th className="px-3 py-3 text-medium-gray font-medium text-xs text-left">
              Severity
            </th>
            <th className="px-3 py-3 text-medium-gray font-medium text-xs text-left">
              Status
            </th>
            <th className="px-3 py-3 text-medium-gray font-medium text-xs text-left">
              Age
            </th>
            <th
              className="px-3 py-3 text-medium-gray font-medium text-xs col-span-2 text-left"
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

  const severityInfo = useMemo(() => {
    switch (severity) {
      case 0:
        return severityData.low;
      case 1:
        return severityData.high;
      default:
        return severityData.low;
    }
  }, [severity]);

  const statusLabel = useMemo(
    () => IncidentStatusLabel[status] ?? status,
    [status]
  );

  const statusColorClass = cx({
    "bg-light-green": status === IncidentStatus.Open,
    "bg-gray-100": status === IncidentStatus.Closed
  });

  return (
    <tr
      className="last:border-b-0 border-b cursor-pointer"
      onClick={() => navigateToIncidentDetails(id)}
    >
      <td
        colSpan={2}
        className="px-6 py-4 text-darker-black col-span-2 text-sm leading-5 font-medium"
      >
        {title}
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-row items-center">
          {severityInfo.icon}
          <p className="text-darker-black text-sm leading-5 font-normal ml-2.5">
            {severityInfo.text}
          </p>
        </div>
      </td>
      <td className="px-3 py-4">
        <button
          className={cx(
            "text-light-black text-xs leading-4 font-medium py-0.5 px-2.5 rounded-10px",
            statusColorClass || "bg-blue-100"
          )}
          type="button"
        >
          {statusLabel}
        </button>
      </td>
      <td className="px-3 text-medium-gray text-sm py-4">{age}</td>
      <td className="px-3 text-sm py-4" colSpan={2}>
        <div className="flex">
          {responders.map(({ image, name }) => (
            <div
              className="flex flex-row mr-4 items-center justify-between"
              key={name}
            >
              <img
                className="h-6 w-6 rounded-full bg-gray-400"
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
