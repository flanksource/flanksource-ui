import clsx from "clsx";
import { capitalize } from "lodash";
import { IncidentStatus } from "../../../api/types/incident";
import { Tag } from "../../Tag/Tag";

interface IProps {
  status: IncidentStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusClsMap: Record<IncidentStatus, string> = {
  [IncidentStatus.Open]: "bg-light-green",
  [IncidentStatus.Closed]: "bg-gray-100",
  [IncidentStatus.Investigating]: "bg-blue-100",
  [IncidentStatus.Mitigated]: "bg-blue-100",
  [IncidentStatus.New]: "bg-blue-100",
  [IncidentStatus.Resolved]: "bg-blue-100"
};

export function IncidentStatusTag({ status, className }: IProps) {
  return (
    <Tag className={clsx(className, statusClsMap[status])}>
      {capitalize(status)}
    </Tag>
  );
}
