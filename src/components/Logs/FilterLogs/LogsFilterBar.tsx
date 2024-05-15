import FilterLogsByComponent from "./FilterLogsByComponent";
import LogsSearchInput from "./LogsSearchInput";
import LogsSelectorDropdown from "./LogsSelector";

type Props = {
  refetch: () => void;
};

export default function LogsFilterBar({ refetch }: Props) {
  return (
    <div className="flex flex-row items-center space-x-2 w-full">
      <FilterLogsByComponent />
      <LogsSelectorDropdown />
      <LogsSearchInput refetch={refetch} />
    </div>
  );
}
