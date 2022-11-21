import clsx from "clsx";
import { capitalize } from "lodash";
import { IncidentStatus } from "../../api/services/incident";

interface IProps {
  status: IncidentStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusClsMap = {
  [IncidentStatus.Open]: "bg-light-green",
  [IncidentStatus.Closed]: "bg-gray-100"
};

export function IncidentStatusTag({ status, size = "md", className }: IProps) {
  return (
    <button
      type="button"
      className={clsx(
        className,
        "shrink cursor-default text-light-black font-light text-xs",
        size === "sm" && "pl-1 pr-1 rounded-4px",
        size === "md" && " leading-4 py-0.5 px-2.5 rounded-10px",
        size === "lg" && " leading-4 py-0.5 px-2.5 rounded-10px",

        statusClsMap[status] || "bg-blue-100"
      )}
    >
      {capitalize(status)}
    </button>
  );
}
