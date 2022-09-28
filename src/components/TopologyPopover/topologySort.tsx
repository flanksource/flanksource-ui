import clsx from "clsx";
import { BsSortDown, BsSortUp } from "react-icons/bs";

import { SetURLSearchParams } from "../TopologyPopover";

import { isDate } from "../../utils/date";
import { searchParamsToObj } from "../../utils/common";
import { useOnMouseActivity } from "../../hooks/useMouseActivity";

import type { Topology, ValueType } from "../../context/TopologyPageContext";
import { uniq } from "lodash";

const STATUS = {
  info: 0,
  healthy: 1,
  warning: 2,
  unhealthy: 3
};

export const defaultSortLabels = [
  { id: 1, value: "status", label: "Health" },
  { id: 2, value: "name", label: "Name" },
  { id: 3, value: "type", label: "Type" },
  { id: 4, value: "updated_at", label: "Last Updated" }
];

export function getSortLabels(topology: Topology[]) {
  const currentSortLabels: typeof defaultSortLabels = [];
  let labels: { string: boolean } = {};
  topology?.forEach((t) => {
    t?.properties?.forEach((h, index) => {
      if (!h.name) {
        return;
      }
      if (h.headline && h.name && !labels[h.name]) {
        labels[h.name] = true;
        currentSortLabels.push({
          id: defaultSortLabels.length + index,
          value: (h.name ?? "").toLowerCase(),
          label: h.name ?? ""
        });
      }
    });
  });
  return [...defaultSortLabels, ...uniq(currentSortLabels)];
}

function getTopologyValue(t: Topology, sortBy: string) {
  if (Boolean(t[sortBy])) {
    return t[sortBy] as ValueType;
  }

  const property = t?.properties?.find((p) => p.name === sortBy);
  if (property) {
    return property.value as ValueType;
  }

  return undefined;
}

export function getSortedTopology(
  topology: Topology[] = [],
  sortBy: string,
  sortByType: string
) {
  const topologyMap = new Map(topology.map((p) => [p.id, p]));

  let updatedTopology = [...topologyMap.values()].sort((t1, t2) => {
    let t1Value = getTopologyValue(t1, sortBy);
    let t2Value = getTopologyValue(t2, sortBy);

    if (t1Value && (!t2Value || t2Value === null)) {
      return 1;
    }
    if (t2Value && (!t1Value || t1Value === null)) {
      return -1;
    }

    if (isDate(t1Value) && isDate(t2Value)) {
      return (
        new Date(t1Value as string).getDate() -
        new Date(t2Value as string).getDate()
      );
    }

    if (sortBy === "status") {
      t1Value = STATUS[t1Value];
      t2Value = STATUS[t2Value];
    }

    if (t1Value && t2Value) {
      return +(t1Value > t2Value) || -(t1Value < t2Value);
    }

    return 0;
  });

  if (sortByType === "desc") {
    return updatedTopology.reverse();
  }

  return updatedTopology;
}

export const TopologySort = ({
  title = "Sort By",
  sortLabels,
  searchParams,
  setSearchParams
}: {
  title?: string;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  sortLabels: typeof defaultSortLabels;
}) => {
  const {
    ref: popoverRef,
    isActive: isPopoverActive,
    setIsActive: setIsPopoverActive
  } = useOnMouseActivity();

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
    setIsPopoverActive(false);
  }

  const sortBy = searchParams.get("sortBy") ?? "status";
  const sortByDirection = searchParams.get("sortOrder") ?? "desc";

  return (
    <>
      <div
        ref={popoverRef}
        className="flex mt-1 ml-2 cursor-pointer md:mt-0 md:items-center"
      >
        {sortByDirection === "asc" && (
          <BsSortUp
            className="w-6 h-6 text-gray-700 hover:text-gray-900"
            onClick={() => onSelectSortOption(sortBy, "desc")}
          />
        )}
        {sortByDirection === "desc" && (
          <BsSortDown
            className="w-6 h-6 text-gray-700 hover:text-gray-900"
            onClick={() => onSelectSortOption(sortBy, "asc")}
          />
        )}
        <span
          className="flex ml-2 text-base text-gray-700 capitalize bold hover:text-gray-900"
          onClick={() => setIsPopoverActive((val) => !val)}
        >
          {sortLabels.find((s) => s.value === sortBy)?.label}
        </span>
      </div>
      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        className={clsx(
          "origin-top-right absolute right-0 mt-10 z-50 divide-y divide-gray-100 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none capitalize w-48",
          isPopoverActive ? "display-block" : "hidden"
        )}
      >
        <div className="py-1">
          <div className="flex items-center justify-between px-4 py-2 text-base">
            <span className="font-bold text-gray-700">{title}</span>
            <div
              onClick={() =>
                onSelectSortOption(
                  sortBy,
                  sortByDirection === "asc" ? "desc" : "asc"
                )
              }
              className="flex mx-1 text-gray-600 cursor-pointer hover:text-gray-900"
            >
              {sortByDirection === "asc" && <BsSortUp className="w-5 h-5" />}
              {sortByDirection === "desc" && <BsSortDown className="w-5 h-5" />}
            </div>
          </div>
        </div>
        <div className="py-1" role="none">
          <div className="flex flex-col">
            {sortLabels.map((s) => (
              <span
                onClick={() =>
                  onSelectSortOption(
                    s.value,
                    sortBy !== s.value
                      ? sortByDirection
                      : sortByDirection === "asc"
                      ? "desc"
                      : "asc"
                  )
                }
                className="flex px-4 py-1 text-base cursor-pointer hover:bg-blue-100"
                style={{
                  fontWeight: sortBy === s.value ? "bold" : "inherit"
                }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
