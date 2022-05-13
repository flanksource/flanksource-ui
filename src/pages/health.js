import React from "react";
import { debounce } from "lodash";
import { SearchLayout } from "../components/Layout";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";
import { CanarySearchBar } from "../components/Canary/CanarySearchBar";
import { Canary } from "../components/Canary";
import { updateParams } from "../components/Canary/url";
import { getParamsFromURL } from "../components/Canary/utils";

const getSearchParams = () => getParamsFromURL(window.location.search);

export function HealthPage({ url }) {
  const handleSearch = debounce((value) => {
    updateParams({ query: value });
  }, 400);

  return (
    <SearchLayout
      title={<h1 className="text-xl font-semibold">Health</h1>}
      extra={
        <>
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
      <Canary url={url} hideSearch hideTimeRange />
    </SearchLayout>
  );
}
