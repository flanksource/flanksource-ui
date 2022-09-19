import { BsSortDown, BsSortUp } from "react-icons/bs";

export const TopologySort = ({
  title = "Sort By",
  sortBy,
  sortTypes,
  sortByType,
  onSelectSortOption
}: {
  title?: string;
  sortBy: string;
  sortByType: string;
  onSelectSortOption: (currentSortBy?: string, newSortByType?: string) => void;
  sortTypes: {
    id: number;
    value: string;
    label: string;
  }[];
}) => {
  return (
    <>
      <div className="py-1">
        <div className="flex items-center justify-between px-4 py-2 text-base">
          <span className="font-bold text-gray-700">{title}</span>
          <div
            onClick={() =>
              onSelectSortOption(sortBy, sortByType === "asc" ? "desc" : "asc")
            }
            className="flex mx-1 text-gray-600 cursor-pointer hover:text-gray-900"
          >
            {sortByType === "asc" && <BsSortUp className="w-5 h-5" />}
            {sortByType === "desc" && <BsSortDown className="w-5 h-5" />}
          </div>
        </div>
      </div>
      <div className="py-1" role="none">
        <div className="flex flex-col">
          {sortTypes.map((s) => (
            <span
              onClick={() =>
                onSelectSortOption(
                  s.value,
                  sortBy !== s.value
                    ? sortByType
                    : sortByType === "asc"
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
    </>
  );
};
