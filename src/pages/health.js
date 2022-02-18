import React, { useEffect, useState } from "react";
import { debounce, reduce } from "lodash";
import { CanaryInterface } from "../components/CanaryInterface";
import { SearchLayout } from "../components/Layout";
import { updateParams } from "../components/Canary/url";
import mockChecksData from "../data/14-2-2022.canary.checks.real.json";
import { StatCard } from "../components/StatCard";
import { isHealthy } from "../components/Canary/filter";
import { CanarySearchBar } from "../components/Canary/CanarySearchBar";

const getPassedChecks = (checks) =>
  reduce(checks, (sum, c) => (isHealthy(c) ? sum + 1 : sum), 0);

export function HealthPage() {
  const [checks, setChecks] = useState([]);
  const [filteredChecks, setFilteredChecks] = useState([]);
  useEffect(() => {
    setChecks(mockChecksData.checks);
  }, []);

  const handleSearch = debounce((value) => {
    updateParams({ query: value });
  }, 400);

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
          <CanarySearchBar
            onChange={(e) => handleSearch(e.target.value)}
            onSubmit={(value) => handleSearch(value)}
            onClear={() => handleSearch("")}
            className=""
            inputClassName="w-full"
            inputOuterClassName="w-72"
            placeholder="Search by name, description, or endpoint"
          />
        </>
      }
    >
      <div className="flex mb-8">
        <StatCard
          title="All Checks"
          className="mr-4 w-64"
          customValue={
            <>
              {checks.length}
              <span className="text-xl font-light">
                {" "}
                (
                <span className="text-green-500">
                  {getPassedChecks(checks)}
                </span>
                /
                <span className="text-red-500">
                  {checks.length - getPassedChecks(checks)}
                </span>
                )
              </span>
            </>
          }
        />
        {checks.length > filteredChecks.length && (
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
      <CanaryInterface checks={checks} onFilterCallback={setFilteredChecks} />
    </SearchLayout>
  );
}
