import { NavigateOptions, URLSearchParamsInit } from "react-router-dom";
import { TopologyPreference } from "./topologyPreference";

export type SetURLSearchParams = (
  nextInit?:
    | URLSearchParamsInit
    | ((prev: URLSearchParams) => URLSearchParamsInit),
  navigateOpts?: NavigateOptions
) => void;

type TopologyPopOverProps = {
  size: string;
  setSize: (v: string) => void;
};

export default function TopologyPopOver({
  size,
  setSize
}: TopologyPopOverProps) {
  const setCardWidth = (width: string) => {
    setSize(`${width}px`);
    localStorage.setItem("topology_card_width", `${width}px`);
  };

  return (
    <div className="relative flex items-center pt-5 sm:flex md:self-center md:pt-0">
      <TopologyPreference cardSize={size} setCardWidth={setCardWidth} />
    </div>
  );
}
