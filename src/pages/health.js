import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { debounce } from "lodash";

import { Canary } from "../components/Canary";
import { SearchLayout } from "../components/Layout";
import { RefreshButton } from "../components/RefreshButton";
import { CanarySearchBar } from "../components/Canary/CanarySearchBar";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";

import { useUpdateParams } from "../components/Canary/url";
import { getParamsFromURL } from "../components/Canary/utils";

const getSearchParams = () => getParamsFromURL(window.location.search);

export function HealthPage({ url }) {
  const updateParams = useUpdateParams();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const handleSearch = debounce((query) => {
    updateParams({ query });
  }, 400);

  return (
    <SearchLayout
      title={<h1 className="text-xl font-semibold">Health</h1>}
      extra={
        <>
          <RefreshButton
            onClick={() => handleSearch(getSearchParams()?.query || "")}
            animate={loading}
          />
          <DropdownStandaloneWrapper
            paramKey="timeRange"
            className="w-40 mr-2"
            dropdownElem={<TimeRange />}
            defaultValue={searchParams.get("timeRange") ?? timeRanges[0].value}
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
      <Canary url={url} hideSearch hideTimeRange onLoading={setLoading} />
    </SearchLayout>
  );
}
