import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { FaCog } from "react-icons/fa";
import { BsSortDown, BsSortUp } from "react-icons/bs";

import { TopologySort } from "./topologySort";
import { searchParamsToObj } from "../../utils/common";
import { TopologyPreference } from "./topologyPreference";
import { NavigateOptions, URLSearchParamsInit } from "react-router-dom";

const defaultSortTypes = [
  { id: 1, value: "status", label: "Health" },
  { id: 2, value: "name", label: "Name" },
  { id: 3, value: "type", label: "Type" },
  { id: 4, value: "updated_at", label: "Last Updated" }
];

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

  const [currentIcon, setCurrentIcon] = useState("");

  const [sortTypes, setSortTypes] = useState<typeof defaultSortTypes>([]);

  useEffect(() => {
    setSortValues();
  }, [searchParams, topologyLabels]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (currentIconRef.current?.contains(event.target)) {
        return;
      }
      setCurrentIcon("");
    };
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  function setSortValues() {
    const currentSortTypes: typeof defaultSortTypes = [];

    topology?.forEach((t) => {
      t?.properties?.forEach((h, index) => {
        if (h.headline && !currentSortTypes.find((t) => t.value === h.name)) {
          currentSortTypes.push({
            id: defaultSortTypes.length + index,
            value: h.name.toLowerCase(),
            label: h.name
          });
        }
      });
    });

    const newSortTypes = [...defaultSortTypes, ...currentSortTypes];

    setSortTypes(newSortTypes);
  }

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
    setCurrentIcon("");
  }

  const setCardWidth = (width: string) => {
    setSize(`${width}px`);
    localStorage.setItem("topology_card_width", `${width}px`);
  };

  const sortBy = searchParams.get("sortBy") ?? "status";
  const sortByType = searchParams.get("sortOrder") ?? "desc";

  return (
    <div
      ref={currentIconRef}
      className="relative flex pt-5 md:self-center md:pt-0"
    >
      <div className="mt-1 ml-2 cursor-pointer md:mt-0 md:items-center md:flex ">
        {sortByType === "asc" && (
          <BsSortUp
            className="w-6 h-6 text-gray-700 hover:text-gray-900"
            onClick={() => onSelectSortOption(sortBy, "desc")}
          />
        )}
        {sortByType === "desc" && (
          <BsSortDown
            className="w-6 h-6 text-gray-700 hover:text-gray-900"
            onClick={() => onSelectSortOption(sortBy, "asc")}
          />
        )}
        <span
          className="hidden ml-2 text-base text-gray-700 capitalize bold md:flex hover:text-gray-900"
          onClick={() => setCurrentIcon((val) => (val === "" ? "sort" : ""))}
        >
          {sortTypes.find((s) => s.value === sortBy)?.label}
        </span>
      </div>
      <FaCog
        className="content-center w-6 h-6 mt-1 ml-4 cursor-pointer md:mt-0"
        onClick={() =>
          setCurrentIcon((val) => (val === "" ? "preference" : ""))
        }
      />
      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        className={clsx(
          "origin-top-right absolute right-0 mt-10 w-96 z-50 divide-y divide-gray-100 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none capitalize",
          currentIcon === "" ? "hidden" : "display-block",
          currentIcon === "sort" ? "w-48" : "w-96"
        )}
      >
        {currentIcon === "sort" && (
          <TopologySort
            sortBy={sortBy}
            sortTypes={sortTypes}
            sortByType={sortByType}
            onSelectSortOption={onSelectSortOption}
          />
        )}
        {currentIcon === "preference" && (
          <TopologyPreference cardSize={size} setCardWidth={setCardWidth} />
        )}
      </div>
    </div>
  );
};

export default TopologyPopOver;
