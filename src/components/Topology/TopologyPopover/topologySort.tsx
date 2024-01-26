import clsx from "clsx";
import { uniq } from "lodash";
import { LegacyRef } from "react";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { ValueType } from "../../../api/types/common";
import { Topology } from "../../../api/types/topology";
import { useOnMouseActivity } from "../../../hooks/useMouseActivity";
import { saveSortBy, saveSortOrder } from "../../../pages/TopologyPage";
import { isDate } from "../../../utils/date";

const STATUS = {
  info: 4,
  healthy: 3,
  warning: 2,
  unhealthy: 1
};

export const defaultSortLabels = [
  { id: 1, value: "status", label: "Health", standard: true },
  { id: 2, value: "name", label: "Name", standard: true },
  { id: 3, value: "type", label: "Type", standard: true },
  { id: 4, value: "updated_at", label: "Last Updated", standard: true }
];

export function getSortLabels(topology: Topology[]) {
  const currentSortLabels: typeof defaultSortLabels = [];
  let labels: Record<string, boolean> = {};
  topology?.forEach((t) => {
    t?.properties?.forEach((h, index) => {
      if (!h.name) {
        return;
      }
      if (h.headline && h.name && !labels[h.name]) {
        labels[h.name] = true;
        currentSortLabels.push({
          id: defaultSortLabels.length + index,
          value: `field:${(h.name ?? "").toLowerCase()}`,
          label: h.name ?? "",
          standard: false
        });
      }
    });
  });
  return [...defaultSortLabels, ...uniq(currentSortLabels)];
}

function getTopologyValue(t: Topology, sortBy: string) {
  if (Boolean(t[sortBy as keyof Topology])) {
    return t[sortBy as keyof Topology] as ValueType;
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
  const updatedTopology = topology.sort((t1, t2) => {
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
      t1Value = STATUS[t1Value as keyof typeof STATUS];
      t2Value = STATUS[t2Value as keyof typeof STATUS];
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

type SortLabel = typeof defaultSortLabels;

export const TopologySort = ({
  title = "Sort By",
  sortLabels
}: {
  title?: string;
  sortLabels: SortLabel;
}) => {
  const [searchParams, setSearchParams] = useSearchParams({
    sortBy: "status",
    sortOrder: "desc"
  });

  const {
    ref: popoverRef,
    isActive: isPopoverActive,
    setIsActive: setIsPopoverActive
  } = useOnMouseActivity();

  function onSelectSortOption(currentSortBy?: string, newSortByType?: string) {
    currentSortBy = currentSortBy ?? "status";
    newSortByType = newSortByType ?? "desc";

    if (currentSortBy === "status" && newSortByType === "desc") {
      searchParams.delete("sortBy");
      searchParams.delete("sortOrder");
    } else {
      searchParams.set("sortBy", currentSortBy);
      searchParams.set("sortOrder", newSortByType);
    }
    setSearchParams(searchParams, {
      replace: true
    });

    saveSortBy(currentSortBy, sortLabels);
    saveSortOrder(newSortByType);
    setIsPopoverActive(false);
  }

  const sortBy = searchParams.get("sortBy") ?? "status";
  const sortByDirection = searchParams.get("sortOrder") ?? "desc";

  return (
    <>
      <div
        ref={popoverRef as LegacyRef<HTMLDivElement>}
        className="flex cursor-pointer p-0 items-center border border-gray-300 bg-white rounded-md shadow-sm"
      >
        <div
          onClick={() =>
            onSelectSortOption(
              sortBy,
              sortByDirection === "asc" ? "desc" : "asc"
            )
          }
          className="flex items-center justify-center text-gray-700 hover:text-gray-900 px-3 py-1 pr-1 rounded-l-md h-full"
        >
          {sortByDirection === "asc" && (
            <BsSortUp className="w-5 h-5 text-gray-700 hover:text-gray-900" />
          )}
          {sortByDirection === "desc" && (
            <BsSortDown className="w-5 h-5 text-gray-700 hover:text-gray-900" />
          )}
        </div>
        <div
          className="flex ml-2 text-sm text-gray-700 capitalize bold hover:text-gray-900 px-3 py-1 pl-0 rounded-r-md h-full items-center"
          onClick={() => setIsPopoverActive((val) => !val)}
        >
          {sortLabels.find((s) => s.value === sortBy)?.label}
        </div>
      </div>
      <div className="relative">
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
                {sortByDirection === "desc" && (
                  <BsSortDown className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>
          <div className="py-1" role="none">
            <div className="flex flex-col">
              {sortLabels.map((s) => (
                <span
                  key={s.value}
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
      </div>
    </>
  );
};
