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
import { useSearchParams } from "react-router-dom";
import { HealthCheck } from "../../types/healthChecks";
import { decodeUrlSearchParams } from "../Canary/url";

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
  const [searchParams] = useSearchParams();

  const [filteredChecks, setFilteredChecks] = useState(checks);
  const [checksForTabGeneration, setChecksForTabGeneration] = useState(checks);
  const [selectedTab, setSelectedTab] = useState<string>();

  const hidePassing = searchParams.get("hidePassing") === "true";

  // check filtering on checks/tab/params change.
  useEffect(() => {
    const {
      labels: urlLabels,
      tabBy,
      query
    } = decodeUrlSearchParams(window.location.search);

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
    hidePassing
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
