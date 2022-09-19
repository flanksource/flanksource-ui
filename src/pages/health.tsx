import { useState } from "react";
import { debounce } from "lodash";
import { SearchLayout } from "../components/Layout";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";
import { CanarySearchBar } from "../components/Canary/CanarySearchBar";
import { Canary } from "../components/Canary";
import RefreshDropdown from "../components/RefreshDropdown";
import { useSearchParams } from "react-router-dom";

type Props = {
  url: string;
};

export function HealthPage({ url }: Props) {
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useSearchParams();

  const handleSearch = debounce((query) => {
    setQueryParams({ query });
  }, 400);

  const query = queryParams.get("query");

  return (
    <SearchLayout
      title={<h1 className="text-xl font-semibold">Health</h1>}
      extra={
        <>
          <RefreshDropdown
            onClick={() => handleSearch(query || "")}
            isLoading={loading}
          />
          <DropdownStandaloneWrapper
            dropdownElem={<TimeRange />}
            defaultValue={timeRanges[0].value}
            paramKey="timeRange"
            className="w-40 mr-2"
          />
          <CanarySearchBar
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
            onSubmit={(value: string) => handleSearch(value)}
            onClear={() => handleSearch("")}
            className=""
            inputClassName="w-full py-2 mb-px"
            inputOuterClassName="w-80"
            placeholder="Search by name, description, or endpoint"
            defaultValue={query}
          />
        </>
      }
      contentClass="p-0"
    >
      <Canary url={url} hideSearch hideTimeRange onLoading={setLoading} />
    </SearchLayout>
  );
}
