import { useState } from "react";
import { debounce } from "lodash";
import { SearchLayout } from "../components/Layout";
import { Canary } from "../components/Canary";
import { useUpdateParams } from "../components/Canary/url";
import { getParamsFromURL } from "../components/Canary/utils";
import RefreshDropdown from "../components/RefreshDropdown";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import { CanarySearchBar } from "../components/Canary/CanarySearchBar";

const getSearchParams = () => getParamsFromURL(window.location.search);

export function HealthPage({ url }) {
  const [loading, setLoading] = useState(true);
  const updateParams = useUpdateParams();
  const handleSearch = debounce((query) => {
    updateParams({ query });
  }, 400);

  return (
    <SearchLayout
      title={<h1 className="text-xl font-semibold">Health</h1>}
      extra={
        <>
          <RefreshDropdown
            onClick={() => handleSearch(getSearchParams()?.query || "")}
            isLoading={loading}
          />
          <DropdownStandaloneWrapper
            dropdownElem={<TimeRange />}
            defaultValue={timeRanges[0].value}
            paramKey="timeRange"
            className="w-40 mr-2"
          />
          <CanarySearchBar
            onChange={(e) => handleSearch(e.target.value)}
            onSubmit={(value) => handleSearch(value)}
            onClear={() => handleSearch("")}
            className=""
            inputClassName="w-full py-2 mb-px"
            inputOuterClassName="w-80"
            placeholder="Search by name, description, or endpoint"
            defaultValue={getSearchParams()?.query}
          />
        </>
      }
      contentClass="p-0"
    >
      <Canary url={url} onLoading={setLoading} />
    </SearchLayout>
  );
}
