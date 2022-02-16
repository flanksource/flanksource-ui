import React, { useEffect, useState } from "react";
import history from "history/browser";
import { orderBy } from "lodash";
import { CanaryTabs, filterChecksByTabSelection } from "../Canary/tabs";
import { MinimalCanary } from "../Canary/minimal";
import {
  filterChecksByLabels,
  getLabelFilters,
  getLabels
} from "../Canary/labels";
import { getParamsFromURL } from "../Canary/utils";
import { filterChecks, filterChecksByText } from "../Canary/filter";
import { CanarySorter } from "../Canary/data";
import { updateParams } from "../Canary/url";

export function CanaryInterface({ checks = [] }) {
  const [searchParams, setSearchParams] = useState(
    getParamsFromURL(window.location.search)
  );
  useEffect(() => {
    history.listen(({ location }) => {
      setSearchParams(getParamsFromURL(location.search));
    });
  }, []);

  const [selectedTab, setSelectedTab] = useState(null);
  const [labels, setLabels] = useState(getLabels(checks));
  const [filteredChecks, setFilteredChecks] = useState(checks);
  const [checksForTabGeneration, setChecksForTabGeneration] = useState(checks);

  const { labels: labelStates, tabBy, groupBy, query } = searchParams;
  const [labelFilters, setLabelFilters] = useState(
    getLabelFilters(labelStates, labels)
  );
  const hidePassing = JSON.parse(searchParams.hidePassing ?? null);

  // get labels from checks
  useEffect(() => {
    setLabels(getLabels(checks));
  }, [checks]);

  // group by name by default
  useEffect(() => {
    if (!groupBy) {
      updateParams({ groupBy: "name" });
    }
  }, [groupBy]);

  // update label filters state
  useEffect(() => {
    const decoded = decodeURIComponent(labelStates ?? null);
    const stateful = JSON.parse(decoded !== "null" && decoded);
    setLabelFilters(getLabelFilters(stateful, labels));
  }, [labels, labelStates]);

  useEffect(() => {
    setLabels(getLabels(checks));
  }, [checks]);

  const handleFetch = () => {};

  useEffect(() => {
    let filtered = filterChecks(checks, hidePassing, []); // first filter for pass/fail
    filtered = filterChecksByText(filtered, query || ""); // filter by name, description, endpoint
    filtered = Object.values(filterChecksByLabels(filtered, labelFilters)); // filters checks by its 'include/exclude' filters
    filtered = orderBy(filtered, CanarySorter); // do sorting
    setChecksForTabGeneration(filtered);
    filtered = filterChecksByTabSelection(tabBy, selectedTab, filtered); // filter based on selected tab
    setFilteredChecks(filtered);
  }, [checks, tabBy, groupBy, hidePassing, query, labelFilters, selectedTab]);

  return (
    <>
      <CanaryTabs
        className=""
        style={{}}
        checks={checksForTabGeneration}
        tabBy={tabBy}
        setTabSelection={setSelectedTab}
      />
      <MinimalCanary checks={filteredChecks} selectedTab={selectedTab} />
    </>
  );
}
