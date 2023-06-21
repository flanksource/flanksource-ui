import { FaComment } from "react-icons/fa";
import { IncidentStatus } from "../../api/services/incident";
import {
  IncidentHistory,
  IncidentHistoryType
} from "../../api/services/IncidentsHistory";
import { hypothesisStatusIconMap } from "../../constants/hypothesisStatusOptions";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { incidentStatusItems } from "../Incidents/data";
import EvidenceChangelogContent from "./EvidenceChangelogContent";

type IncidentHistoryItemTypeContentProps = {
  incidentHistory: IncidentHistory;
};

const IncidentHistoryTypeToComponentMap = new Map<
  `${IncidentHistoryType}`,
  React.FC<IncidentHistoryItemTypeContentProps>
>([
  [
    "incident.created",
    ({ incidentHistory }) => {
      return <>created Incident</>;
    }
  ],
  [
    "incident.status_updated",
    ({ incidentHistory }) => {
      const status = incidentHistory.description as IncidentStatus;
      const { icon } = incidentStatusItems[status];

      return (
        <>
          marked as:{" "}
          <Badge
            text={
              <>
                <span className="mr-1"> {icon}</span>
                {incidentHistory.description?.toLocaleLowerCase()}
              </>
            }
          />
        </>
      );
    }
  ],
  [
    "responder.created",
    ({ incidentHistory }) => {
      const responder = incidentHistory.responder;
      return (
        <>
          Added responder <Avatar user={responder?.person!} />{" "}
          {responder?.person?.name}{" "}
        </>
      );
    }
  ],
  [
    "evidence.created",
    ({ incidentHistory }) => {
      const evidence = incidentHistory.evidence;

      return (
        <>
          added{" "}
          <Badge text={<EvidenceChangelogContent evidence={evidence} />} />
        </>
      );
    }
  ],
  [
    "responder.commented",
    ({ incidentHistory }) => {
      const responder = incidentHistory.responder;
      const comment = incidentHistory.comment;

      return (
        <>
          <FaComment /> {comment?.comment} -{" "}
          <Avatar
            containerProps={{ className: "inline" }}
            user={responder?.person}
          />{" "}
          {responder?.person?.name}{" "}
        </>
      );
    }
  ],
  [
    "hypothesis.created",
    ({ incidentHistory }) => {
      const hypothesis = incidentHistory.hypothesis;

      const status =
        incidentHistory.description as keyof typeof hypothesisStatusIconMap;
      const icon = hypothesisStatusIconMap[status];

      return (
        <>
          added <Badge text={hypothesis?.title} />, status is {icon}
          {incidentHistory.description}
        </>
      );
    }
  ],
  [
    "hypothesis.status_updated",
    ({ incidentHistory }) => {
      const hypothesis = incidentHistory.hypothesis;

      const status =
        incidentHistory.description as keyof typeof hypothesisStatusIconMap;

      const { Icon, className } = hypothesisStatusIconMap[status];

      return (
        <>
          marked <Badge text={hypothesis?.title} /> as:
          <Icon className={`h-5 mx-1 inline-block ${className}`} />
          {incidentHistory.description}
        </>
      );
    }
  ]
]);

export default function IncidentHistoryItemTypeContent({
  incidentHistory
}: IncidentHistoryItemTypeContentProps) {
  const { type } = incidentHistory;
  console.log(incidentHistory);

  const Component = IncidentHistoryTypeToComponentMap.get(type);
  if (Component) {
    return <Component incidentHistory={incidentHistory} />;
  }

  return null;
}
