import { SearchIcon } from "@heroicons/react/solid";
import { useSearchParams } from "react-router-dom";
import { TextInput } from "../../../ui/FormControls/TextInput";

type Props = {
  refetch: () => void;
};

export default function LogsSearchInput({ refetch }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div className="relative mx-2 w-80 rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <button type="button" onClick={() => refetch()} className="hover">
          <SearchIcon
            className="h-5 w-5 text-gray-400 hover:text-gray-600"
            aria-hidden="true"
          />
        </button>
      </div>
      <TextInput
        placeholder="Search"
        className="w-full flex-shrink-0 pb-2.5 pl-10"
        style={{ height: "38px" }}
        id="searchQuery"
        onChange={(e) => {
          if (e.target.value !== "") {
            setSearchParams({
              ...Object.fromEntries(searchParams),
              query: e.target.value
            });
          } else {
            searchParams.delete("query");
            setSearchParams(searchParams);
          }
        }}
        defaultValue={query ?? undefined}
      />
    </div>
  );
}
