import React from "react";
import clsx from "clsx";
import { capitalize } from "lodash";

export const IncidentStatus = React.memo(({ incident }) => {
  const statusColorClass = clsx({
    "bg-light-green": incident.status === "open",
    "bg-gray-100": incident.status === "closed"
  });
  return (
    <button
      type="button"
      className={clsx(
        "text-light-black text-xs leading-4 font-medium py-0.5 px-2.5 rounded-10px shrink cursor-default",
        statusColorClass || "bg-blue-100"
      )}
    >
      {capitalize(incident.status)}
    </button>
  );
});

IncidentStatus.displayName = "IncidentStatus";
