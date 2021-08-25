import React from "react";
import { orderBy, reduce } from "lodash";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";

import { getLabels } from "./labels";
import { filterChecks, isHealthy, labelIndex } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { CanarySorter, Title } from "./data";
import { CanaryDescription } from "./description";

import { StatCard } from "../StatCard";
import { Dropdown } from "../Dropdown";
import { Modal } from "../Modal";
import { Toggle } from "../Toggle";

const table = {
  id: "dropdown-table",
  name: "table",
  icon: <BsTable />,
  label: "Table"
};
const card = {
  id: "dropdown-card",
  name: "card",
  icon: <RiLayoutGridLine />,
  label: "Card"
};

function toggleLabel(selectedLabels, label) {
  const index = labelIndex(selectedLabels, label);
  if (index >= 0) {
    return selectedLabels.filter((i) => i.id !== label.id);
  }
  selectedLabels.push(label);

  return selectedLabels;
}

export class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.url = props.url;
    this.interval = 10;
    this.modal = React.createRef();
    this.fetch = this.fetch.bind(this);
    this.select = this.select.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.setChecks = this.setChecks.bind(this);
    this.toggleLabel = this.toggleLabel.bind(this);
    this.togglePassing = this.togglePassing.bind(this);
    this.state = {
      style: table,
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
  }

  setStyle(style) {
    this.setState({
      style
    });
  }

  toggleLabel(label) {
    this.setState((state) => ({
      selectedLabels: toggleLabel(state.selectedLabels, label)
    }));
  }

  fetch() {
    fetch(this.url)
      .then((result) => result.json())
      .then(this.setChecks);
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

  render() {
    const { state } = this;
    const {
      checks: stateChecks,
      hidePassing,
      selectedLabels,
      style,
      selected
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
      stateChecks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );

    return (
      <div className="w-full flex flex-col-reverse lg:flex-row">
        {/* middle panel */}
        <div className="w-full p-6">
          {style.name === "card" && (
            <CanaryCards checks={checks} onClick={this.select} />
          )}
          {style.name === "table" && (
            <CanaryTable checks={checks} onClick={this.select} />
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
              <Dropdown
                items={[card, table]}
                selected={style}
                setSelected={this.setStyle}
                className="mb-6"
              />

              <Toggle
                label="Hide Passing"
                enabled={hidePassing}
                setEnabled={this.togglePassing}
                className="mb-3"
              />

              {labels.map((label) => (
                <Toggle
                  key={label.label}
                  label={label.label}
                  enabled={labelIndex(selectedLabels, label) >= 0}
                  setEnabled={() => this.toggleLabel(label)}
                  className="mb-3"
                />
              ))}
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
