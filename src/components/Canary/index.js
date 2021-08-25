import React from "react";
import { orderBy, reduce } from "lodash";
import { ImUngroup } from "react-icons/im";
import { BiLabel } from "react-icons/bi";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { AiOutlineAlignLeft } from "react-icons/ai";

import { getLabels, getNonBooleanLabels } from "./labels";
import { filterChecks, isHealthy, labelIndex } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { CanarySorter, Title } from "./data";
import { CanaryDescription } from "./description";

import { StatCard } from "../StatCard";
import { Dropdown } from "../Dropdown";
import { Modal } from "../Modal";
import { Toggle } from "../Toggle";

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

const groupSelectionsTemplate = [
  {
    id: "dropdown-no-group",
    name: "no-group",
    icon: <ImUngroup />,
    label: "No Grouping"
  },
  {
    id: "dropdown-name",
    name: "name",
    icon: <TiSortAlphabeticallyOutline />,
    label: "Name"
  },
  {
    id: "dropdown-description",
    name: "description",
    icon: <AiOutlineAlignLeft />,
    label: "Description"
  }
];

function toggleLabel(selectedLabels, label) {
  const index = labelIndex(selectedLabels, label);
  if (index >= 0) {
    return selectedLabels.filter((i) => i.id !== label.id);
  }
  selectedLabels.push(label);

  return selectedLabels;
}

function getNewGroupSelections(checks) {
  const nonBooleanLabels = getNonBooleanLabels(checks);
  const newGroupSelections = [...groupSelectionsTemplate];
  nonBooleanLabels.forEach((label) => {
    const onlyAlphabets = label.replace(/[^a-zA-Z]/g, "");
    newGroupSelections.push({
      id: `dropdown-label-${onlyAlphabets}`,
      name: onlyAlphabets,
      icon: <BiLabel />,
      label,
      groupKey: label
    });
  });
  return newGroupSelections;
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
    this.setGroupBy = this.setGroupBy.bind(this);
    this.setChecks = this.setChecks.bind(this);
    this.toggleLabel = this.toggleLabel.bind(this);
    this.togglePassing = this.togglePassing.bind(this);
    this.state = {
      style: layoutSelections[0],
      groupBy: groupSelectionsTemplate[0],
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

  setGroupBy(group) {
    this.setState({
      groupBy: group
    });
  }

  toggleLabel(label) {
    this.setState((state) => ({
      selectedLabels: toggleLabel(state.selectedLabels, label)
    }));
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
      stateChecks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );

    const groupSelections = getNewGroupSelections(checks);

    // update available group dropdown selections
    if (groupSelections.findIndex((o) => o.label === groupBy.label) === -1) {
      this.setGroupBy(groupSelections[0]);
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
                theadClass="sticky top-6"
                checks={checks}
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
                    label="Group items by"
                  />
                )}
              </div>
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
