import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { BsDistributeHorizontal, BsDistributeVertical } from "react-icons/bs";

type GraphDirection = "LR" | "TB";

export const configGraphDirectionToggle = atomWithStorage<GraphDirection>(
  "graphDirection",
  "LR",
  undefined,
  {
    getOnInit: true
  }
);

export function useConfigGraphDirectionToggleValue() {
  const [direction] = useAtom(configGraphDirectionToggle);
  return direction;
}

export default function ConfigGraphDirectionToggle() {
  const [toggleValue, setToggleValue] = useAtom(configGraphDirectionToggle);

  return (
    <div
      onClick={() => {
        setToggleValue(toggleValue === "LR" ? "TB" : "LR");
      }}
      role="button"
      title={
        toggleValue === "TB"
          ? "Switch to horizontal layout"
          : "Switch to vertical layout"
      }
      className="flex-column flex cursor-pointer items-center gap-2 border-b border-solid border-gray-200 p-1 hover:bg-gray-100"
    >
      {toggleValue === "TB" ? (
        <BsDistributeHorizontal />
      ) : (
        <BsDistributeVertical />
      )}
    </div>
  );
}
