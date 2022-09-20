import clsx from "clsx";
import { BsSortDown, BsSortUp } from "react-icons/bs";

import { defaultSortLabels } from "./utils";

export const TopologySort = ({
  title = "Sort By",
  sortLabels,
  searchParams,
  currentPopover,
  setCurrentPopover,
  onSelectSortOption
}: {
  title?: string;
  currentPopover: string;
  searchParams: URLSearchParams;
  sortLabels: typeof defaultSortLabels;
  setCurrentPopover: (val: any) => void;
  onSelectSortOption: (currentSortBy?: string, newSortByType?: string) => void;
}) => {
  const sortBy = searchParams.get("sortBy") ?? "status";
  const sortByDirection = searchParams.get("sortOrder") ?? "desc";

  return (
    <>
      <div className="mt-1 ml-2 cursor-pointer md:mt-0 md:items-center md:flex ">
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
          className="hidden ml-2 text-base text-gray-700 capitalize bold md:flex hover:text-gray-900"
          onClick={() =>
            setCurrentPopover((val: string) => (val === "" ? "sort" : ""))
          }
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
          currentPopover === "sort" ? "display-block" : "hidden"
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
