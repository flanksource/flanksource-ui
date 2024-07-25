import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FaBezierCurve } from "react-icons/fa";
import { GoGraph } from "react-icons/go";

type GraphToggleEdgeType = "smoothstep" | "bezier";

export const graphEdgeTypeToggle = atomWithStorage<GraphToggleEdgeType>(
  "graphDirection",
  "bezier",
  undefined,
  {
    getOnInit: true
  }
);

export function useGraphEdgeTypeToggleValue() {
  const [direction] = useAtom(graphEdgeTypeToggle);
  return direction;
}

export default function GraphEdgeTypeToggle() {
  const [toggleValue, setToggleValue] = useAtom(graphEdgeTypeToggle);

  return (
    <div
      onClick={() =>
        setToggleValue((prev) =>
          prev === "smoothstep" ? "bezier" : "smoothstep"
        )
      }
      role="button"
      className="flex-column flex cursor-pointer items-center gap-2 border-b border-solid border-gray-200 p-1 hover:bg-gray-100"
    >
      {toggleValue === "smoothstep" ? <GoGraph /> : <FaBezierCurve />}
    </div>
  );
}
