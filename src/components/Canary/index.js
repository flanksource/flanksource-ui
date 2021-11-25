import React from "react";
import { orderBy, reduce, debounce } from "lodash";
import history from "history/browser";

import { FilterForm } from "./FilterForm/index";
import { getLabels, filterChecksByLabels, getLabelFilters } from "./labels";

import { readCanaryState, getDefaultForm } from "./state";

import { filterChecks, filterChecksByText, isHealthy } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { CanarySorter, GetName } from "./data";
import { CanaryDescription, Title } from "./renderers";

import { StatCard } from "../StatCard";
import { Modal } from "../Modal";
import { CanaryTabs, filterChecksByTabSelection } from "./tabs";
import { CanarySearchBar } from "./CanarySearchBar";
import { Sidebar } from "../Sidebar";

export class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.url = props.url;
    this.interval = 10;
    this.modal = React.createRef();
    this.fetch = this.fetch.bind(this);
    this.select = this.select.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchClear = this.handleSearchClear.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.setChecks = this.setChecks.bind(this);
    this.history = history;
    this.unhistory = () => {};

    const labels = getLabels(props.checks);

    this.state = {
      urlState: getDefaultForm(labels),
      selected: null,
      // eslint-disable-next-line react/no-unused-state
      lastFetched: null,
      // eslint-disable-next-line react/no-unused-state
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
    const { labels } = this.state;
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
    this.timer = setInterval(() => this.fetch(), this.interval * 1000);
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

  setChecks(checks) {
    if (checks.checks) {
      // FIXME unify pipeline for demo and remote
      checks = checks.checks;
    }
    const labels = getLabels(checks);
    this.setState({
      checks,
      // eslint-disable-next-line react/no-unused-state
      labels,
      // eslint-disable-next-line react/no-unused-state
      lastFetched: new Date()
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

  fetch() {
    if (this.url == null) {
      return;
    }
    fetch(this.url)
      .then((result) => result.json())
      .then(this.setChecks);
  }

  render() {
    const { state } = this;
    const {
      selected,
      labelFilters,
      urlState,
      checks: stateChecks,
      labels,
      selectedTab,
      searchQuery
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
        </div>
        <div className="mr-6">
          <Sidebar animated>
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
