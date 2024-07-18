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
          className="flex flex-col space-x-1"
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
    return <p className="py-1 text-sm text-gray-500">{hint}</p>;
  }
}
