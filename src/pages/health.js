import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { CanaryInterface } from "../components/CanaryInterface";
import { SearchLayout } from "../components/Layout";
import { updateParams } from "../components/Canary/url";
import { GroupByDropdown } from "../components/Dropdown/GroupByDropdown";
import mockChecksData from "../data/checks.json";

export function HealthPage() {
  const [searchParams] = useSearchParams();

  const { control, watch } = useForm({
    defaultValues: {
      groupBy: searchParams.get("groupBy") || "name"
    }
  });

  const formState = watch();
  useEffect(() => {
    updateParams(formState);
  }, [formState]);

  const [checks, setChecks] = useState([]);
  useEffect(() => {
    setChecks(mockChecksData.checks);
  }, []);

  const handleSearch = debounce((e) => {
    updateParams({ query: e.target.value });
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
          <GroupByDropdown
            name="groupBy"
            control={control}
            className="mr-4"
            label="Group By"
            checks={checks}
          />
          query:
          <input className="border mr-2" onChange={handleSearch} />
          hidePassing:
          <input
            type="checkbox"
            value={searchParams.get("hidePassing")}
            onChange={(e) => updateParams({ hidePassing: e.target.checked })}
          />
        </>
      }
    >
      <CanaryInterface checks={checks} />
    </SearchLayout>
  );
}
