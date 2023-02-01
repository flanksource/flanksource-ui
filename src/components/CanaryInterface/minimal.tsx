import React, { useEffect, useMemo, useState } from "react";
import { orderBy } from "lodash";
import { CanaryTabs, filterChecksByTabSelection } from "../Canary/tabs";
import { MinimalCanary } from "../Canary/minimal";
import { filterChecks, filterChecksByText } from "../Canary/filter";
import {
  filterChecksByLabels,
  getLabelFilters,
  getLabels
} from "../Canary/labels";
import { CanarySorter } from "../Canary/data";
import { useSearchParams } from "react-router-dom";
import { HealthCheck } from "../../types/healthChecks";

type Props = {
  checks?: HealthCheck[];
  onFilterCallback?: (checks: HealthCheck[]) => void;
  onLabelFiltersCallback?: (labels: Record<string, any>) => void;
};

const CanaryInterfaceMinimalFC = ({
  checks = [],
  onFilterCallback,
  onLabelFiltersCallback
}: Props) => {
  const [searchParams] = useSearchParams({
    tabBy: "namespace",
    groupBy: "canary_name",
    hidePassing: "true"
  });

  const [filteredChecks, setFilteredChecks] = useState(checks);
  const [checksForTabGeneration, setChecksForTabGeneration] = useState(checks);
  const [selectedTab, setSelectedTab] = useState<string>();

  const hidePassing = searchParams.get("hidePassing") === "true";
  const tabBy = searchParams.get("tabBy");
  const labels = searchParams.get("labels");
  const query = searchParams.get("query");

  const urlLabels = useMemo(() => {
    if (labels) {
      try {
        return JSON.parse(decodeURIComponent(labels));
      } catch (e) {
        console.error("Error parsing labels", e);
        return undefined;
      }
    }
  }, [labels]);

  // check filtering on checks/tab/params change.
  useEffect(() => {
    if (checks?.length > 0) {
      let filtered = filterChecks(checks, hidePassing, []); // first filter for pass/fail
      filtered = filterChecksByText(filtered, query || ""); // filter by name, description, endpoint
      if (onLabelFiltersCallback) {
        onLabelFiltersCallback(getLabels(filtered));
      }
      /* @ts-expect-error */
      const labelFilters = getLabelFilters(urlLabels, getLabels(checks)); // get include/exclude filters from url state
      filtered = Object.values(filterChecksByLabels(filtered, labelFilters)); // filters checks by its 'include/exclude' filters
      setChecksForTabGeneration(filtered);
      filtered = filterChecksByTabSelection(tabBy, selectedTab, filtered); // filter based on selected tab
      filtered = orderBy(filtered, CanarySorter); // do sorting
      setFilteredChecks(filtered);
      if (onFilterCallback) {
        onFilterCallback(filtered);
      }
    }
  }, [
    checks,
    selectedTab,
    onFilterCallback,
    onLabelFiltersCallback,
    searchParams,
    hidePassing,
    query,
    urlLabels,
    tabBy
  ]);

  return (
    <>
      <CanaryTabs
        className=""
        // style={tabsStyle}
        checks={checksForTabGeneration}
        tabBy={searchParams.get("tabBy")}
        setTabSelection={setSelectedTab}
      />
      <MinimalCanary
        // tableHeadStyle={tableHeadStyle}
        checks={filteredChecks}
        selectedTab={selectedTab}
      />
    </>
  );
};

export const CanaryInterfaceMinimal = React.memo(CanaryInterfaceMinimalFC);
