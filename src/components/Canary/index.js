import React, { useEffect, useState } from "react";
import { findIndex, orderBy, reduce } from "lodash";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";

import { getLabels } from "./labels";

import {
  defaultGroupSelections,
  getGroupSelections,
  getGroupedChecks
} from "./grouping";
import { filterChecks, isHealthy, labelIndex } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { CanarySorter } from "./data";
import { CanaryDescription } from "./description";

import { StatCard } from "../StatCard";
import { Dropdown } from "../Dropdown";
import { Modal } from "../Modal";
import { Toggle } from "../Toggle";
import { Title } from "./renderers";

import { TristateToggle } from "../TristateToggle";

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
    this.setStyle = this.setStyle.bind(this);
    this.setGroupBy = this.setGroupBy.bind(this);
    this.setChecks = this.setChecks.bind(this);
    this.togglePassing = this.togglePassing.bind(this);
    this.state = {
      style: layoutSelections[0],
      groupBy: defaultGroupSelections[0],
      selected: null,
      // eslint-disable-next-line react/no-unused-state
      lastFetched: null,
      hidePassing: true,
      // eslint-disable-next-line react/no-unused-state
      labels: getLabels(props.checks),
      selectedLabels: getLabels(props.checks),
      checks: props.checks ? props.checks : []
    };
  }

  componentDidMount() {
    if (this.url == null) {
      return;
    }
    this.fetch();
    this.timer = setInterval(() => this.fetch(), this.interval * 1000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  setChecks(checks) {
    if (checks.checks) {
      // FIXME unify pipeline for demo and remote
      checks = checks.checks;
    }
    this.setState({
      checks,
      // eslint-disable-next-line react/no-unused-state
      labels: getLabels(checks),
      // eslint-disable-next-line react/no-unused-state
      lastFetched: new Date()
    });
    console.log("checks", checks);
  }

  setStyle(style) {
    this.setState({
      style
    });
  }

  setGroupBy(group) {
    this.setState({
      groupBy: group
    });
  }

  setSelectedLabels(selectedLabels) {
    this.setState({
      selectedLabels
    });
  }

  togglePassing() {
    this.setState((state) => ({
      hidePassing: !state.hidePassing
    }));
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
    fetch(this.url)
      .then((result) => result.json())
      .then(this.setChecks);
  }

  render() {
    const { state } = this;
    const {
      checks: stateChecks,
      hidePassing,
      selectedLabels,
      style,
      selected,
      groupBy
    } = state;

    // first filter for pass/fail
    let checks = filterChecks(stateChecks, hidePassing, []);
    // get labels for the new subset
    const labels = getLabels(checks);
    // filter the subset down
    checks = filterChecks(checks, this.stateHidePassing, selectedLabels);
    checks = orderBy(checks, CanarySorter);
    const passed = reduce(
      checks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );
    const passedAll = reduce(
      checks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );

    // generate available grouping selections for dropdown menu
    const groupSelections = getGroupSelections(checks);

    // reset grouping if currently selected groupBy isn't available anymore
    if (groupSelections.findIndex((o) => o.label === groupBy.label) === -1) {
      this.setGroupBy(groupSelections[0]);
    }

    // if a grouping is selected, create a grouped version of the checks array
    let hasGrouping = false;
    let groupedChecks = [];
    if (groupBy.name !== "no-group") {
      hasGrouping = true;
      groupedChecks = getGroupedChecks(checks, groupBy);
    }

    return (
      <div className="w-full flex flex-col-reverse lg:flex-row">
        {/* middle panel */}
        <div className="w-full">
          {style.name === "card" && (
            <div className="m-6">
              <CanaryCards checks={checks} onClick={this.select} />
            </div>
          )}
          {style.name === "table" && (
            <div className="m-6 mt-0 relative">
              <div className="sticky top-0 h-6 bg-white z-10" />
              <CanaryTable
                theadClass="sticky top-6 z-10"
                checks={hasGrouping ? groupedChecks : checks}
                hasGrouping={hasGrouping}
                groupingLabel={groupBy.label}
                onClick={this.select}
              />
            </div>
          )}
        </div>

        {/* right panel */}
        <div className="bg-gray-50">
          <div className="p-6 space-y-6 sticky top-0">
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
            <div className="h-full relative lg:w-80">
              <div className="mb-8">
                <Dropdown
                  items={layoutSelections}
                  selected={style}
                  setSelected={this.setStyle}
                  className="mb-4"
                  label="Layout"
                />

                {style.name === "table" && (
                  <Dropdown
                    items={groupSelections}
                    selected={groupBy}
                    setSelected={this.setGroupBy}
                    className="mb-4"
                    label="Group By"
                  />
                )}
              </div>

              <div className="uppercase font-semibold text-sm mb-3 text-indigo-700">
                Filter By Health
              </div>
              <Toggle
                label="Hide Passing"
                enabled={hidePassing}
                setEnabled={this.togglePassing}
                className="mb-3"
              />

              <div className="mt-8">
                <div className="uppercase font-semibold text-sm mb-3 text-indigo-700">
                  Filter By Label
                </div>
                <TristateToggles
                  labels={labels}
                  setSelectedLabels={this.setSelectedLabels}
                />
              </div>
            </div>
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

function TristateToggles({ labels, setSelectedLabels }) {
  const [labelState, setLabelState] = useState([...labels]);

  return (
    <>
      {labelState.map((label) => (
        <TristateToggle
          key={label.key}
          className="mb-2"
          onChange={(val) => {}}
          label={label.label}
        />
      ))}
    </>
  );
}
