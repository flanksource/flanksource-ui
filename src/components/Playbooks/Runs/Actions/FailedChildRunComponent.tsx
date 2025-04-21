import { PlaybookRun } from "@flanksource-ui/api/types/playbooks";
import { BiError } from "react-icons/bi";
import { TbCornerDownRight } from "react-icons/tb";
import { Tooltip } from "react-tooltip";

type FailedChildRunComponentProps = {
  run: PlaybookRun;
  isSelected: boolean;
  onClick: () => void;
  stepNumber: number;
};

export default function FailedChildRunComponent({
  run,
  isSelected,
  onClick,
  stepNumber
}: FailedChildRunComponentProps) {
  return (
    <div
      className={`flex cursor-pointer flex-col gap-1 rounded-md border border-gray-200 p-2 hover:bg-gray-50 ${
        isSelected ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TbCornerDownRight
            data-tooltip-id="child-run-tooltip"
            data-tooltip-content="Child Run"
            className="mr-1 flex-shrink-0 text-gray-500"
            size={16}
          />
          <Tooltip id="child-run-tooltip" />
          <BiError className="text-red-500" size={16} />
          <span className="font-medium text-gray-700">
            {run.playbooks?.name || `Run ${stepNumber}`}
          </span>
        </div>
      </div>
    </div>
  );
}
