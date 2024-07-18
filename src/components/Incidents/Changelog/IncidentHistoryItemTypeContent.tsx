import {
  IncidentHistory,
  IncidentHistoryType,
  IncidentStatus
} from "@flanksource-ui/api/types/incident";
import { hypothesisStatusIconMap } from "@flanksource-ui/constants/hypothesisStatusOptions";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { FaComment } from "react-icons/fa";
import { incidentStatusItems } from "../data";
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
          added responder{" "}
          <Avatar inline={true} user={responder?.team || responder?.person} />{" "}
          {responder?.team?.name || responder?.person?.name}{" "}
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
          added {evidence?.type}{" "}
          <Badge text={<EvidenceChangelogContent evidence={evidence} />} />
        </>
      );
    }
  ],
  [
    "evidence.done_definition_added",
    ({ incidentHistory }) => {
      const evidence = incidentHistory.evidence;
      return (
        <>
          added DoD for {evidence?.type}{" "}
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
            inline={true}
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
          <Icon className={`mx-1 inline-block h-5 ${className}`} />
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

  const Component = IncidentHistoryTypeToComponentMap.get(type);
  if (Component) {
    return <Component incidentHistory={incidentHistory} />;
  }

  return null;
}
