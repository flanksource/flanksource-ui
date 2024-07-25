import { IncidentHistory } from "../../../api/types/incident";
import { Age } from "../../../ui/Age";
import { Avatar } from "../../../ui/Avatar";
import IncidentHistoryItemTypeContent from "./IncidentHistoryItemTypeContent";

type IncidentChangelogItemProps = {
  history: IncidentHistory;
};

export default function IncidentChangelogItem({
  history
}: IncidentChangelogItemProps) {
  return (
    <li className="mb-6 ml-2" key={history.id}>
      <div className="absolute -left-3 flex items-center justify-center rounded-full bg-blue-200 ring-8 ring-white">
        <Avatar user={history.created_by} circular size="sm" />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between">
        <div className="block flex-1 justify-center text-sm normal-case text-gray-500">
          <span className="text-gray-500">{history.created_by?.name}</span>{" "}
          <IncidentHistoryItemTypeContent incidentHistory={history} />{" "}
          <span className="font-medium text-gray-500">
            <Age from={history.created_at} />
          </span>
        </div>
      </div>
    </li>
  );
}
