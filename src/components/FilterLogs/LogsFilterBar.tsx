import FilterLogsByComponent from "./FilterLogsByComponent";
import LogsSearchInput from "./LogsSearchInput";

type Props = {
  refetch: () => void;
};

export default function LogsFilterBar({ refetch }: Props) {
  return (
    <div className="flex flex-row items-center w-full">
      <FilterLogsByComponent />
      <LogsSearchInput refetch={refetch} />
    </div>
  );
}
