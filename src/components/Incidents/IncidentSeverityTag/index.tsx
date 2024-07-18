import { IncidentSeverity } from "../../../api/types/incident";
import { severityItems } from "../data";

const getSeverity = (severity: IncidentSeverity | string) => {
  switch (severity) {
    case "Critical":
    case "4":
      return severityItems.Critical;
    case "Blocker":
    case "3":
      return severityItems.Blocker;
    case "High":
    case "2":
      return severityItems.High;
    case "Medium":
    case "1":
      return severityItems.Medium;
    default:
      return severityItems.Low;
  }
};

interface IProps {
  severity: IncidentSeverity;
  iconOnly?: boolean;
}

export function IncidentSeverityTag({ severity, iconOnly }: IProps) {
  const { icon, value } = getSeverity(severity);
  return (
    <>
      <div className="my-auto">{icon}</div>
      {!iconOnly && <p className="ml-1.5 leading-5">{value}</p>}
    </>
  );
}
