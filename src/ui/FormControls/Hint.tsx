import { IoInformationCircleOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

export type HintPosition = "top" | "bottom" | "tooltip";
export default function Hint({
  hint,
  id,
  type = "bottom"
}: {
  id: string;
  hint?: string;
  type?: HintPosition;
}) {
  if (!hint) {
    return null;
  }

  if (type === "tooltip") {
    return (
      <>
        <div
          className="space-x-1 flex flex-col"
          data-tooltip-id={id}
          data-tooltip-place="top"
          data-tooltip-content={hint}
        >
          <IoInformationCircleOutline className="h-5 w-auto" />
        </div>
        <Tooltip id={id} />
      </>
    );
  } else {
    return <p className="text-sm text-gray-500 py-1">{hint}</p>;
  }
}
