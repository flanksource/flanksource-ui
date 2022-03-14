import React from "react";
import { orderBy, reduce, debounce, throttle, isEmpty } from "lodash";
import history from "history/browser";
import dayjs from "dayjs";
import { AiFillSetting } from "react-icons/ai";
import { encodeObjectToUrlSearchParams } from "./url";
import { FilterForm } from "./FilterForm/index";
import { getLabels, filterChecksByLabels, getLabelFilters } from "./labels";

import { readCanaryState, getDefaultForm } from "./state";

import { filterChecks, filterChecksByText, isHealthy } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { CanarySorter } from "./data";
import { version as appVersion } from "../../../package.json";

import { StatCard } from "../StatCard";
import { CanaryTabs, filterChecksByTabSelection } from "./tabs";
import { CanarySearchBar } from "./CanarySearchBar";
import { Sidebar } from "../Sidebar";
import { Toggle } from "../Toggle";
import { SidebarSubPanel } from "./SidebarSubPanel";
import { RefreshIntervalDropdown } from "../Dropdown/RefreshIntervalDropdown";
import { getLocalItem, setLocalItem } from "../../utils/storage";
import { Modal } from "../Modal";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CheckDetails } from "./CanaryPopup/CheckDetails";

import mixins from "../../utils/mixins.module.css";

export class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.ticker = null;
    this.url = props.url;
    this.fetch = throttle(this.fetch.bind(this), 1000);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchClear = this.handleSearchClear.bind(this);
    this.handleAutoRefreshChange = this.handleAutoRefreshChange.bind(this);
    this.handleRefreshIntervalChange =
      this.handleRefreshIntervalChange.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.setChecks = this.setChecks.bind(this);
    this.setLastUpdated = this.setLastUpdated.bind(this);
    this.history = history;
    // eslint-disable-next-line prettier/prettier
    this.unhistory = () => { };

    const labels = getLabels(props.checks);

    this.state = {
      apiVersion: null,
      requestDuration: null,
      urlState: getDefaultForm(labels),
      selected: null,
      graphData: null,
      autoRefresh: JSON.parse(getLocalItem("canaryAutoRefreshState")) ?? true,
      // @TODO: default refresh interval is always 10. might want to memoize this to local state. - john
      refreshInterval: getLocalItem("canaryRefreshIntervalState") || 10,
      lastUpdated: null,
      labels,
      labelFilters: {
        exclude: [],
        include: []
      },
      selectedTab: null,
      searchQuery: "",
      checks: props.checks ? props.checks : []
    };
  }

  componentDidMount() {
    const { canaryState: urlState } = readCanaryState(window.location.search);
    const { labels, refreshInterval } = this.state;
    const { labels: labelStates } = urlState;
    const labelFilters = getLabelFilters(labelStates, labels);
    this.setState({ urlState, labelFilters });

    this.unhistory = this.history.listen(({ location }) => {
      // See https://github.com/remix-run/history/blob/main/docs/getting-started.md
      const { canaryState: urlState } = readCanaryState(location.search);
      const { labels } = this.state;
      const { labels: labelStates } = urlState;
      const labelFilters = getLabelFilters(labelStates, labels);
      this.setState({ urlState, labelFilters });
    });

    this.fetch();
    if (this.url == null) {
      return;
    }
    this.startRefreshTimer(refreshInterval);
  }

  componentWillUnmount() {
    this.unhistory();
    clearInterval(this.timer);
    clearInterval(this.ticker);
    this.ticker = null;
    this.timer = null;
  }

  handleTabSelect(tabSelection) {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      selectedTab: tabSelection
    });
  }

  handleSearch(value) {
    this.setState({
      searchQuery: value
    });
  }

  handleSearchClear() {
    this.setState({
      searchQuery: ""
    });
  }

  handleRefreshIntervalChange(value) {
    const { refreshInterval: prevValue } = this.state;
    if (prevValue !== value && !Number.isNaN(value) && value >= 1) {
      this.setState({
        refreshInterval: value
      });
      this.startRefreshTimer(value);
      setLocalItem("canaryRefreshIntervalState", value);
    }
  }

  handleAutoRefreshChange(enableRefresh) {
    clearInterval(this.timer);
    this.setState({
      autoRefresh: enableRefresh
    });
    setLocalItem("canaryAutoRefreshState", enableRefresh);
    if (enableRefresh) {
      const { refreshInterval } = this.state;
      this.startRefreshTimer(refreshInterval);
    }
  }

  handleSelect(check) {
    const params = encodeObjectToUrlSearchParams({
      check: check.key,
      start: "7d",
      count: 300
    });
    this.setState({
      selected: check,
      graphData: null
    });

    fetch(`${this.url}/graph?${params}`)
      .then((result) => result.json())
      .then((e) => {
        if (!isEmpty(e.error)) {
          // eslint-disable-next-line no-console
          console.error(e.error);
        } else {
          this.setState({
            graphData: e.status
          });
        }
      });
  }

  handleModalClose() {
    this.setState({
      selected: null
    });
  }

  setChecks(checks) {
    // set api Version from response (yet to be provided by API)
    let apiVersion;
    if (checks.apiVersion) {
      apiVersion = checks.apiVersion;
    }
    let duration;
    if (checks.duration) {
      duration = checks.duration;
    }
    if (checks.checks) {
      // FIXME unify pipeline for demo and remote
      checks = checks.checks;
    }
    if (checks == null) {
      checks = [];
    }
    const labels = getLabels(checks);
    this.setState({
      checks,
      requestDuration: duration,
      apiVersion,
      // eslint-disable-next-line react/no-unused-state
      labels
    });
  }

  setLastUpdated(date) {
    this.setState({
      lastUpdated: date
    });
  }

  startRefreshTimer(interval) {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.fetch(), interval * 1000);
    clearInterval(this.ticker);
    this.ticker = setInterval(() => {
      const { lastUpdated } = this.state;
      const age = dayjs(lastUpdated).fromNow();
      this.setState({
        lastUpdatedAge: age
      });
    }, 3000);
  }

  fetch() {
    if (this.url == null) {
      return;
    }
    const { urlState } = this.state;
    const { timeRange } = urlState;
    const params = encodeObjectToUrlSearchParams({
      start: isEmpty(timeRange) || timeRange === "undefined" ? "1h" : timeRange
    });

    fetch(`${this.url}?${params}`)
      .then((result) => result.json())
      .then((e) => {
        if (!isEmpty(e.error)) {
          // eslint-disable-next-line no-console
          console.error(e.error);
        } else {
          this.setChecks(e);
          this.setLastUpdated(new Date());
        }
      });
  }

  render() {
    const { state } = this;
    const {
      selected,
      graphData,
      labelFilters,
      urlState,
      checks: stateChecks,
      lastUpdatedAge,
      labels,
      selectedTab,
      autoRefresh,
      refreshInterval,
      searchQuery,
      apiVersion,
      requestDuration
    } = state;
    const { hidePassing, layout, tabBy } = urlState;

    // first filter for pass/fail
    let checks = filterChecks(stateChecks, hidePassing, []);

    const passedAll = reduce(
      stateChecks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );

    // filter by name, description, endpoint
    checks = filterChecksByText(checks, searchQuery);

    // filter the subset down
    checks = Object.values(filterChecksByLabels(checks, labelFilters)); // filters checks by its 'include/exclude' filters
    checks = orderBy(checks, CanarySorter);

    const tabChecks = [...checks]; // list of checks used to generate tabs

    checks = filterChecksByTabSelection(tabBy, selectedTab, checks);
    const passed = reduce(
      checks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );

    const filterProps = {
      onServerSideFilterChange: this.fetch,
      labels,
      checks: stateChecks,
      currentTabChecks: filterChecksByTabSelection(
        tabBy,
        selectedTab,
        stateChecks
      ),
      history: this.history
    };

    return (
      <div className="w-full flex flex-row">
        {/* middle panel */}
        <div className="w-full flex flex-col justify-between px-4 mb-4">
          <div className="relative">
            <CanarySearchBar
              onChange={debounce((e) => this.handleSearch(e.target.value), 500)}
              onSubmit={(value) => this.handleSearch(value)}
              onClear={this.handleSearchClear}
              className="pt-4 pb-2 sticky top-0 z-10 bg-white"
              inputClassName="w-full"
              inputOuterClassName="z-10 w-full md:w-1/2"
              placeholder="Search by name, description, or endpoint"
            />

            <CanaryTabs
              className="sticky top-0 z-20 bg-white w-full"
              style={{ top: "58px" }}
              checks={tabChecks}
              tabBy={tabBy}
              setTabSelection={this.handleTabSelect}
            />
            {layout === "card" && (
              <CanaryCards checks={checks} onClick={this.handleSelect} />
            )}
            {layout === "table" && (
              <CanaryTable
                checks={checks}
                labels={labels}
                history={history}
                onCheckClick={this.handleSelect}
                showNamespaceTags={
                  tabBy !== "namespace" ? true : selectedTab === "all"
                }
                hideNamespacePrefix
                groupSingleItems={false}
                theadStyle={{ position: "sticky", top: "96px" }}
              />
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500 flex flex-col-reverse md:flex-row justify-between">
            <div>
              {appVersion && <div>UI version: {appVersion}</div>}
              {apiVersion && <div>API version: {apiVersion}</div>}
            </div>
            <div>
              {lastUpdatedAge && <>Last updated {lastUpdatedAge}</>}
              {requestDuration && ` in ${requestDuration}ms`}
            </div>
          </div>
        </div>

        {/* sidebar panel */}
        <div className="mr-6 flex-grow">
          <Sidebar animated>
            <SidebarSubPanel
              icon={
                <AiFillSetting
                  title="Show settings panel"
                  className="text-gray-600 h-6 w-6"
                />
              }
              subpanelContent={
                <>
                  <div className="uppercase font-semibold text-sm mb-4 text-gray-700">
                    More Settings
                  </div>
                  <div className="mb-4">
                    <Toggle
                      label="Auto-refresh"
                      className="mb-3"
                      value={autoRefresh}
                      onChange={this.handleAutoRefreshChange}
                    />
                  </div>

                  {autoRefresh && (
                    <div className="mb-4">
                      <RefreshIntervalDropdown
                        className="w-full"
                        defaultValue={refreshInterval}
                        onChange={this.handleRefreshIntervalChange}
                      />
                    </div>
                  )}
                </>
              }
            >
              <StatCard
                title="All Checks"
                className="mb-4"
                customValue={
                  <>
                    {stateChecks.length}
                    <span className="text-xl font-light">
                      {" "}
                      (<span className="text-green-500">{passedAll}</span>/
                      <span className="text-red-500">
                        {stateChecks.length - passedAll}
                      </span>
                      )
                    </span>
                  </>
                }
              />

              {checks.length !== stateChecks.length && (
                <StatCard
                  title="Filtered Checks"
                  className="mb-4"
                  customValue={
                    <>
                      {checks.length}
                      <span className="text-xl  font-light">
                        {" "}
                        (<span className="text-green-500">{passed}</span>/
                        <span className="text-red-500">
                          {checks.length - passed}
                        </span>
                        )
                      </span>
                    </>
                  }
                />
              )}

              {/* filtering tools */}
              <FilterForm {...filterProps} />
            </SidebarSubPanel>
          </Sidebar>
        </div>
        <Modal
          open={selected != null}
          onClose={this.handleModalClose}
          size="full"
        >
          <div
            className="flex flex-col h-full py-8"
            style={{ maxHeight: "calc(100vh - 4rem)" }}
          >
            <CheckTitle check={selected} className="pb-4" />
            <CheckDetails
              check={selected}
              graphData={graphData}
              className={`flex flex-col overflow-y-hidden ${mixins.appleScrollbar}`}
            />
          </div>
        </Modal>
      </div>
    );
  }
}
