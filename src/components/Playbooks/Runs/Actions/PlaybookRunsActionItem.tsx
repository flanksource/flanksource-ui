import { relativeDateTime } from "../../../../utils/date";
import { PlaybookRunAction } from "../PlaybookRunTypes";
import PlaybookRunsStatus from "../PlaybookRunsStatus";

type PlaybookRunsActionItemProps = {
  action: PlaybookRunAction;
  onClick?: () => void;
  isSelected?: boolean;
};

export default function PlaybookRunsActionItem({
  action,
  onClick = () => {},
  isSelected = false
}: PlaybookRunsActionItemProps) {
  return (
    <div
      role="button"
      onClick={onClick}
      key={action.id}
      className={`flex flex-row items-center justify-between px-4 py-2 bg-white border border-gray-200 hover:bg-gray-200 rounded cursor-pointer ${
        isSelected ? "bg-gray-200" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 text-sm font-medium text-gray-600">
          <PlaybookRunsStatus status={action.status} hideStatusLabel />
          {action.name}
        </div>
        <div className={`text-xs flex flex-row gap-1 items-center`}></div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-600">
          {relativeDateTime(action.start_time!, action.end_time)}
        </div>
      </div>
    </div>
  );
}