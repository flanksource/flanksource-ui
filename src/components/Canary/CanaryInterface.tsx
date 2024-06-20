import { HealthCheck } from "@flanksource-ui/api/types/health";
import { orderBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CanaryTabs, filterChecksByTabSelection } from "./CanaryTabs";
import { ChecksListing } from "./ChecksListing";
import { CanarySorter } from "./data";
import { filterChecks, filterChecksByText } from "./filter";
import { filterChecksByLabels, getLabelFilters, getLabels } from "./labels";
import { useHealthUserSettings } from "./useHealthUserSettings";

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
  const [selectedTab, setSelectedTab] = useState<string>("all");

  const { hidePassing, tabBy = "namespace" } = useHealthUserSettings();

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
      let filtered = filterChecks(checks, hidePassing === "true", []); // first filter for pass/fail
      filtered = filterChecksByText(filtered, query || ""); // filter by name, description, endpoint
      if (onLabelFiltersCallback) {
        onLabelFiltersCallback(getLabels(filtered));
      }
      /* @ts-expect-error */
      const labelFilters = getLabelFilters(urlLabels, getLabels(checks)); // get include/exclude filters from url state
      filtered = Object.values(filterChecksByLabels(filtered, labelFilters)); // filters checks by its 'include/exclude' filters
      setChecksForTabGeneration(filtered);
      filtered = filterChecksByTabSelection(tabBy!, selectedTab!, filtered); // filter based on selected tab
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
    <CanaryTabs
      // style={tabsStyle}
      checks={checksForTabGeneration}
      tabBy={tabBy}
      setTabSelection={setSelectedTab}
    >
      <ChecksListing
        // tableHeadStyle={tableHeadStyle}
        checks={filteredChecks}
        selectedTab={selectedTab}
      />
    </CanaryTabs>
  );
};

export const CanaryInterfaceMinimal = React.memo(CanaryInterfaceMinimalFC);
