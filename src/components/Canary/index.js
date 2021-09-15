import React from "react";
import { orderBy, reduce } from "lodash";

import history from "history/browser";

import { FilterForm } from "./FilterForm/index";
import { getLabels, filterChecksByLabels, getLabelFilters } from "./labels";

import { readCanaryState, getDefaultForm } from "./state";

import { filterChecks, isHealthy } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { CanarySorter } from "./data";
import { CanaryDescription } from "./description";

import { StatCard } from "../StatCard";
import { Modal } from "../Modal";
import { Title } from "./renderers";

import { TristateToggle } from "../TristateToggle";
import { NewCanaryTable } from "./newTable";

const layoutSelections = [
  {
    id: "dropdown-table",
    name: "table",
    icon: <BsTable />,
    label: "Table"
  },
  {
    id: "dropdown-card",
    name: "card",
    icon: <RiLayoutGridLine />,
    label: "Card"
  }
];

export class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.url = props.url;
    this.interval = 10;
    this.modal = React.createRef();
    this.fetch = this.fetch.bind(this);
    this.select = this.select.bind(this);
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
      labels
    } = state;
    const { hidePassing, groupBy, layout } = urlState;

    // first filter for pass/fail
    let checks = filterChecks(stateChecks, hidePassing, []);

    const passedAll = reduce(
      stateChecks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );
    // filter the subset down
    checks = Object.values(filterChecksByLabels(checks, labelFilters)); // filters checks by its 'include/exclude' filters
    checks = orderBy(checks, CanarySorter);
    const passed = reduce(
      checks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );

    const hasGrouping = groupBy !== "no-group";

    const filterProps = {
      labels,
      checks: stateChecks,
      history: this.history
    };

    return (
      <div className="w-full flex flex-col-reverse lg:flex-row">
        {/* middle panel */}
        <div className="w-full">
          {layout === "card" && (
            <div className="m-6">
              <CanaryCards checks={checks} onClick={this.select} />
            </div>
          )}
          {layout === "table" && (
            <div className="m-6 mt-0 relative">
              <div
                className="sticky top-0 h-6 bg-white z-10"
                style={{ marginLeft: "-1px", width: "calc(100% + 2px)" }}
              />
              <CanaryTable
                checks={checks}
                labels={labels}
                history={history}
                hasGrouping={hasGrouping}
              />
            </div>
          )}
        </div>

        {/* right panel */}
        <div className="bg-gray-50">
          <div className="p-6 space-y-6 sticky top-0 lg:h-screen lg:min-h-screen overflow-y-auto">
            <StatCard
              title="All Checks"
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

            {/* second card */}
            {checks.length !== stateChecks.length && (
              <StatCard
                title="Filtered Checks"
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
          </div>
        </div>
        {selected != null && (
          <Modal
            ref={this.modal}
            submitText=""
            title={<Title check={selected} />}
            body={<CanaryDescription check={selected} />}
            open
          />
        )}
      </div>
    );
  }
}
