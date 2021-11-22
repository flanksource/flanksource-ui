import React from "react";
import { orderBy, reduce, debounce } from "lodash";
import history from "history/browser";
import dayjs from "dayjs";

import { AiFillSetting } from "react-icons/ai";

import { FilterForm } from "./FilterForm/index";
import { getLabels, filterChecksByLabels, getLabelFilters } from "./labels";

import { readCanaryState, getDefaultForm } from "./state";

import { filterChecks, filterChecksByText, isHealthy } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { CanarySorter } from "./data";
import { version as appVersion } from "../../../package.json";
import { CanaryDescription, Title } from "./renderers";

import { StatCard } from "../StatCard";
import { CanaryTabs, filterChecksByTabSelection } from "./tabs";
import { CanarySearchBar } from "./CanarySearchBar";
import { Sidebar } from "../Sidebar";
import { Toggle } from "../Toggle";
import { SidebarSubPanel } from "./SidebarSubPanel";
import { RefreshIntervalDropdown } from "../Dropdown/RefreshIntervalDropdown";
import { getLocalItem, setLocalItem } from "../../utils/storage";
import { CanaryModal } from "./CanaryModal";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { usePrevious } from "../../utils/hooks";

export class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.url = props.url;
    this.fetch = this.fetch.bind(this);
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
    this.unhistory = () => {};

    const labels = getLabels(props.checks);

    this.state = {
      apiVersion: null,
      urlState: getDefaultForm(labels),
      selected: null,
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
    this.setState({
      selected: check
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
    if (checks.checks) {
      // FIXME unify pipeline for demo and remote
      checks = checks.checks;
    }
    const labels = getLabels(checks);
    this.setState({
      checks,
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
  }

  fetch() {
    if (this.url == null) {
      return;
    }
    fetch(this.url)
      .then((result) => result.json())
      .then((e) => {
        this.setChecks(e);
        this.setLastUpdated(new Date());
      });
  }

  render() {
    const { state } = this;
    const {
      selected,
      labelFilters,
      urlState,
      checks: stateChecks,
      lastUpdated,
      labels,
      selectedTab,
      autoRefresh,
      refreshInterval,
      searchQuery,
      apiVersion
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
              {lastUpdated && (
                <>
                  Checks last updated at{" "}
                  {dayjs(lastUpdated).format("h:mm:ss A, DD[th] MMMM YYYY")}
                </>
              )}
            </div>
          </div>
        </div>

        {/* sidebar panel */}
        <div className="mr-6">
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
        <CanaryModal
          closeButtonPadding={8}
          onClose={this.handleModalClose}
          open={selected != null}
          title={<CheckTitle check={selected} />}
          body={<CheckDetails check={selected} />}
          cardClass="px-7 py-6"
          cardStyle={{ width: "100%", maxWidth: "730px" }}
        />
      </div>
    );
  }
}

function CheckTitle({ check, ...rest }) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  return (
    <div className="mb-6">
      <div className="flex flex-row items-center pr-10">
        <Icon
          name={validCheck?.icon || validCheck?.type}
          className="mr-3"
          size="2xl"
        />
        <span
          style={{ fontSize: "26px" }}
          title={validCheck?.name}
          className="text-gray-800 font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden pr-4"
        >
          {validCheck?.name}
        </span>
        <span style={{ paddingTop: "1px" }}>
          <Badge text={validCheck?.namespace} />
        </span>
      </div>
      {true && (
        <div className="text-sm text-gray-400">{validCheck?.endpoint}</div>
      )}
    </div>
  );
}

function CheckDetails({ check, ...rest }) {
  console.log("check >", check);
  return <div>WIP</div>;
}
