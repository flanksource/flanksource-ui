import { IncidentHistory } from "../../api/services/IncidentsHistory";
import { relativeDateTime } from "../../utils/date";
import { Avatar } from "../Avatar";
import IncidentHistoryItemTypeContent from "./IncidentHistoryItemTypeContent";

type IncidentChangelogItemProps = {
  history: IncidentHistory;
};

export default function IncidentChangelogItem({
  history
}: IncidentChangelogItemProps) {
  return (
    <li className="mb-6 ml-2" key={history.id}>
      <div className="absolute flex items-center justify-center bg-blue-200 rounded-full -left-3 ring-8 ring-white">
        <Avatar user={history.created_by} circular size="sm" />
      </div>
      <div className="min-w-0 flex-1 flex items-center justify-between">
        <div className="text-sm block flex-1 normal-case justify-center text-gray-500">
          <span className="text-gray-500">{history.created_by?.name}</span>{" "}
          <IncidentHistoryItemTypeContent incidentHistory={history} />{" "}
          <span className="text-gray-500 font-medium">
            {relativeDateTime(history.created_at)}
          </span>
        </div>
      </div>
    </li>
  );
}
