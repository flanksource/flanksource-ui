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
import { CanarySorter, GetName } from "./data";
import { CanaryDescription } from "./description";
import { version as appVersion } from "../../../package.json";

import { StatCard } from "../StatCard";
import { Modal } from "../Modal";
import { Title } from "./renderers";
import { CanaryTabs, filterChecksByTabSelection } from "./tabs";
import { CanarySearchBar } from "./CanarySearchBar";
import { Sidebar } from "../Sidebar";
import { Toggle } from "../Toggle";
import { SidebarSubPanel } from "./SidebarSubPanel";

export class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.url = props.url;
    this.modal = React.createRef();
    this.fetch = this.fetch.bind(this);
    this.select = this.select.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchClear = this.handleSearchClear.bind(this);
    this.handleDisableRefreshChange =
      this.handleDisableRefreshChange.bind(this);
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
      disableRefresh: false,
      refreshInterval: 10, // @TODO: default refresh interval is always 10. might want to memoize this to local state. - john
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

  handleRefreshIntervalChange(e) {
    if (!Number.isNaN(e.target.value) && e.target.value >= 1) {
      this.setState({
        refreshInterval: e.target.value
      });
      this.startRefreshTimer(e.target.value);
    }
  }

  handleDisableRefreshChange(disabled) {
    clearInterval(this.timer);
    this.setState({
      disableRefresh: disabled
    });
    if (!disabled) {
      const { refreshInterval } = this.state;
      this.startRefreshTimer(refreshInterval);
    }
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

  select(check) {
    this.setState({
      selected: check
    });
    if (this.modal.current != null) {
      this.modal.current.show();
    }
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
      disableRefresh,
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
        <div className="w-full px-4 mb-4 relative">
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
            <CanaryCards checks={checks} onClick={this.select} />
          )}
          {layout === "table" && (
            <CanaryTable
              checks={checks}
              labels={labels}
              history={history}
              onCheckClick={this.select}
              showNamespaceTags={
                tabBy !== "namespace" ? true : selectedTab === "all"
              }
              hideNamespacePrefix
              groupSingleItems={false}
              theadStyle={{ position: "sticky", top: "96px" }}
            />
          )}

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
                      label="Disable auto-refresh"
                      className="mb-3"
                      value={disableRefresh}
                      onChange={this.handleDisableRefreshChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="canary-refresh-interval"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Refresh interval (seconds)
                    </label>
                    <div className="flex rounded-md shadow-sm relative">
                      <input
                        disabled={disableRefresh}
                        type="number"
                        name="canary-refresh-interval"
                        className="focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        value={refreshInterval}
                        onChange={this.handleRefreshIntervalChange}
                      />
                    </div>
                  </div>
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
        {selected != null && (
          <Modal
            ref={this.modal}
            submitText=""
            title={
              <Title
                title={GetName(selected)}
                icon={selected.icon || selected.type}
              />
            }
            body={<CanaryDescription check={selected} />}
            open
          />
        )}
      </div>
    );
  }
}
