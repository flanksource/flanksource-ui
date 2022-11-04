import { useEffect, useState } from "react";
import { NavigateOptions, URLSearchParamsInit } from "react-router-dom";

import { TopologyPreference } from "./topologyPreference";
import { defaultSortLabels, getSortLabels, TopologySort } from "./topologySort";

export type SetURLSearchParams = (
  nextInit?:
    | URLSearchParamsInit
    | ((prev: URLSearchParams) => URLSearchParamsInit),
  navigateOpts?: NavigateOptions
) => void;

export const TopologyPopOver = ({
  size,
  setSize,
  topology,
  searchParams,
  setSearchParams
}: {
  size: string;
  topology: any[];
  setSize: (v: string) => void;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}) => {
  const [sortLabels, setSortLabels] = useState<typeof defaultSortLabels>([]);

  useEffect(() => {
    setSortLabels(getSortLabels(topology));
  }, [searchParams, topology]);

  const setCardWidth = (width: string) => {
    setSize(`${width}px`);
    localStorage.setItem("topology_card_width", `${width}px`);
  };

  return (
    <div className="relative pt-5 sm:flex md:self-center md:pt-0">
      <TopologySort
        sortLabels={sortLabels}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <TopologyPreference cardSize={size} setCardWidth={setCardWidth} />
    </div>
  );
};

export default TopologyPopOver;
