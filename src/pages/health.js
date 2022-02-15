import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { CanaryInterface } from "../components/CanaryInterface";
import { SearchLayout } from "../components/Layout";

export function HealthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleSearch = debounce((e) => {
    setSearchParams({ query: e.target.value });
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
          query:
          <input className="border mr-2" onChange={handleSearch} />
          hidePassing:
          <input
            type="checkbox"
            value={searchParams.get("hidePassing")}
            onChange={(e) => setSearchParams({ hidePassing: e.target.checked })}
          />
        </>
      }
    >
      <CanaryInterface />
    </SearchLayout>
  );
}
