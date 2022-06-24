import clsx from "clsx";
import { capitalize } from "lodash";
import { IncidentStatus } from "../../api/services/incident";

interface IProps {
  status: IncidentStatus;
}

const statusClsMap = {
  [IncidentStatus.Open]: "bg-light-green",
  [IncidentStatus.Closed]: "bg-gray-100"
};

export function IncidentStatusTag({ status }: IProps) {
  return (
    <button
      type="button"
      className={clsx(
        "text-light-black text-xs leading-4 font-medium py-0.5 px-2.5 rounded-10px shrink cursor-default",
        statusClsMap[status] || "bg-blue-100"
      )}
    >
      {capitalize(status)}
    </button>
  );
}
