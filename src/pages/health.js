import React, { useEffect, useMemo, useState } from "react";
import { debounce, isEmpty, reduce, throttle } from "lodash";
import { useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import { CgSmileSad } from "react-icons/cg";

import { CanaryInterface } from "../components/CanaryInterface";
import { SearchLayout } from "../components/Layout";
import {
  encodeObjectToUrlSearchParams,
  updateParams
} from "../components/Canary/url";
import { StatCard } from "../components/StatCard";
import { isHealthy } from "../components/Canary/filter";
import { CanarySearchBar } from "../components/Canary/CanarySearchBar";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import { getParamsFromURL } from "../components/Canary/utils";
import { BannerMessage } from "../components/BannerMessage";

const getPassedChecks = (checks) =>
  reduce(checks, (sum, c) => (isHealthy(c) ? sum + 1 : sum), 0);

const getSearchParams = () => getParamsFromURL(window.location.search);

export function HealthPage({ url }) {
  const { control, watch } = useForm({
    defaultValues: {
      timeRange:
        timeRanges.find((o) => o.value === getSearchParams()?.timeRange)
          ?.value || timeRanges[0].value
    }
  });
  const watchTimeRange = watch("timeRange");
  useEffect(() => {
    updateParams({ timeRange: watchTimeRange });
  }, [watchTimeRange]);

  const [checks, setChecks] = useState([]);
  const [filteredChecks, setFilteredChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const handleSearch = debounce((value) => {
    updateParams({ query: value });
  }, 400);

  const handleFetch = useMemo(
    () =>
      throttle(() => {
        if (url == null) {
          return;
        }
        const timeRange = getParamsFromURL(window.location.search)?.timeRange;
        const params = encodeObjectToUrlSearchParams({
          start:
            isEmpty(timeRange) || timeRange === "undefined" ? "1h" : timeRange
        });
        setIsLoading(true);
        fetch(`${url}?${params}`)
          .then((result) => result.json())
          .then((e) => {
            if (!isEmpty(e.error)) {
              // eslint-disable-next-line no-console
              console.error(e.error);
            } else {
              setChecks(e.checks);
              setLastUpdated(new Date());
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 1000),
    []
  );

  return (
    <SearchLayout
      title={
        <div>
          <h1 className="text-xl font-semibold">Health</h1>
        </div>
      }
      onRefresh={() => {}}
      extra={
        <>
          <span className="text-sm font-medium text-gray-700 mr-3">
            Time Range
          </span>
          <TimeRange
            disabled={isLoading}
            control={control}
            name="timeRange"
            className="mr-4 w-40"
          />
          <CanarySearchBar
            onChange={(e) => handleSearch(e.target.value)}
            onSubmit={(value) => handleSearch(value)}
            onClear={() => handleSearch("")}
            className=""
            inputClassName="w-full py-2 mb-px"
            inputOuterClassName="w-80"
            placeholder="Search by name, description, or endpoint"
          />
        </>
      }
    >
      <div className="flex mb-8">
        {checks && (
          <StatCard
            title={isLoading ? "Loading Checks.." : "All Checks"}
            className="mr-4 w-64"
            customValue={
              <>
                {isLoading ? (
                  <>
                    <BiLoaderAlt className="animate-spin w-6 h-6 text-gray-400 mt-4" />
                  </>
                ) : (
                  <>
                    {checks?.length}
                    <span className="text-xl font-light">
                      {" "}
                      (
                      <span className="text-green-500">
                        {getPassedChecks(checks)}
                      </span>
                      /
                      <span className="text-red-500">
                        {checks?.length - getPassedChecks(checks)}
                      </span>
                      )
                    </span>
                  </>
                )}
              </>
            }
          />
        )}
        {!isLoading && checks?.length > filteredChecks?.length && (
          <StatCard
            title="Filtered Checks"
            className="mr-4 w-64"
            customValue={
              <>
                {filteredChecks.length}
                <span className="text-xl  font-light">
                  {" "}
                  (
                  <span className="text-green-500">
                    {getPassedChecks(filteredChecks)}
                  </span>
                  /
                  <span className="text-red-500">
                    {filteredChecks.length - getPassedChecks(filteredChecks)}
                  </span>
                  )
                </span>
              </>
            }
          />
        )}
      </div>

      <CanaryInterface
        checks={checks}
        hideFilters={isLoading || !checks || checks?.length <= 0}
        hideTable={isLoading || !checks}
        onFilterCallback={setFilteredChecks}
        handleFetch={handleFetch}
        tabsStyle={{
          position: "sticky",
          top: "84px",
          background: "white",
          zIndex: 1
        }}
        tableHeadStyle={{
          position: "sticky",
          top: "122px",
          background: "white",
          zIndex: 1
        }}
        beforeTabs={
          <div
            style={{
              position: "sticky",
              marginTop: "-20px",
              top: "64px",
              border: "",
              width: "100%",
              height: "20px",
              background: "white",
              zIndex: 1
            }}
          />
        }
        afterTable={
          isLoading && (
            <div className="flex items-center justify-center w-full h-48">
              <BiLoaderAlt className="animate-spin w-12 h-12 text-gray-400" />
            </div>
          )
        }
      />

      {!isLoading && (!checks || checks.length <= 0) && (
        <BannerMessage
          prepend={
            <div className="mb-4">
              <CgSmileSad className="h-24 w-24 text-indigo-600" />
            </div>
          }
          title="No checks found"
          subtitle="Please try again"
          append={
            <button
              className="mt-4 font-semibold text-gray-50 bg-indigo-600 rounded-md py-2 px-4"
              type="button"
              onClick={handleFetch}
            >
              Refetch checks
            </button>
          }
        />
      )}
    </SearchLayout>
  );
}
