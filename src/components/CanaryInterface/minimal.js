import React, { useEffect, useState } from "react";
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
import { decodeUrlSearchParams } from "../Canary/url";

export function CanaryInterfaceMinimal({
  checks = [],
  searchParams,
  onFilterCallback,
  onLabelFiltersCallback
}) {

  const [filteredChecks, setFilteredChecks] = useState(checks);
  const [checksForTabGeneration, setChecksForTabGeneration] = useState(checks);
  const [selectedTab, setSelectedTab] = useState(null);

  // check filtering on checks/tab/params change.
  useEffect(() => {
    const {
      labels: urlLabels,
      tabBy,
      query,
      hidePassing
    } = decodeUrlSearchParams(searchParams);

    if (checks?.length > 0) {
      let filtered = filterChecks(checks, hidePassing, []); // first filter for pass/fail
      filtered = filterChecksByText(filtered, query || ""); // filter by name, description, endpoint
      if (onLabelFiltersCallback) {
        onLabelFiltersCallback(getLabels(filtered));
      }
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
    searchParams
  ]);

  return (
    <>
      <CanaryTabs
        className=""
        // style={tabsStyle}
        checks={checksForTabGeneration}
        tabBy={decodeUrlSearchParams(searchParams)?.tabBy}
        setTabSelection={setSelectedTab}
      />
      <MinimalCanary
        // tableHeadStyle={tableHeadStyle}
        checks={filteredChecks}
        selectedTab={selectedTab}
      />
    </>
  );
}
