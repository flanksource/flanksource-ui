import { useEffect, useRef, useState } from "react";
import { NavigateOptions, URLSearchParamsInit } from "react-router-dom";

import { TopologyPreference } from "./topologyPreference";
import { defaultSortLabels, getSortLabels, TopologySort } from "./topologySort";

import { searchParamsToObj } from "../../utils/common";

type SetURLSearchParams = (
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
  topologyLabels,
  setSearchParams
}: {
  size: string;
  topology: any[];
  topologyLabels: any[];
  setSize: (v: string) => void;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}) => {
  const currentIconRef = useRef();

  const [currentPopover, setCurrentPopover] = useState("");
  const [sortLabels, setSortLabels] = useState<typeof defaultSortLabels>([]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (currentIconRef.current?.contains(event.target)) {
        return;
      }
      setCurrentPopover("");
    };
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  useEffect(() => {
    setSortLabels(getSortLabels(topology));
  }, [searchParams, topologyLabels]);

  function onSelectSortOption(currentSortBy?: string, newSortByType?: string) {
    currentSortBy = currentSortBy ?? "status";
    newSortByType = newSortByType ?? "desc";

    const newSearchParams = {
      ...searchParamsToObj(searchParams),
      sortBy: currentSortBy,
      sortOrder: newSortByType
    };

    if (currentSortBy === "status" && newSortByType === "desc") {
      const { sortBy, sortOrder, ...removedSearchParams } = newSearchParams;
      setSearchParams(removedSearchParams);
    } else {
      setSearchParams(newSearchParams);
    }
    setCurrentPopover("");
  }

  const setCardWidth = (width: string) => {
    setSize(`${width}px`);
    localStorage.setItem("topology_card_width", `${width}px`);
  };

  return (
    <div
      ref={currentIconRef}
      className="relative flex pt-5 md:self-center md:pt-0"
    >
      <TopologySort
        sortLabels={sortLabels}
        searchParams={searchParams}
        currentPopover={currentPopover}
        setCurrentPopover={setCurrentPopover}
        onSelectSortOption={onSelectSortOption}
      />
      <TopologyPreference
        cardSize={size}
        setCardWidth={setCardWidth}
        currentPopover={currentPopover}
        setCurrentPopover={setCurrentPopover}
      />
    </div>
  );
};

export default TopologyPopOver;
