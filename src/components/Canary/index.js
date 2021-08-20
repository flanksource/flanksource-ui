import { orderBy, reduce } from "lodash";
import React from "react";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";

import Dropdown from "../Dropdown";
import Icon from "../Icon";
import Modal from "../Modal";

import Toggle from "../Toggle";
import { getLabels } from "./labels";
import { filterChecks, isHealthy } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { StatusList } from "./status";
import { CanarySorter, GetName, Title } from "./data";
import { CanaryDescription } from "./description";
import { labelIndex } from "./filter";

const table = {
  id: "dropdown-table",
  name: "table",
  icon: <BsTable />,
  label: "Table",
};
const card = {
  id: "dropdown-card",
  name: "card",
  icon: <RiLayoutGridLine />,
  label: "Card",
};

function toggleLabel(selectedLabels, label) {
  var index = labelIndex(selectedLabels, label);
  if (index >= 0) {
    return selectedLabels.filter((i) => i.id != label.id);
  } else {
    selectedLabels.push(label);
  }
  return selectedLabels;
}

export default class Canary extends React.Component {
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
      lastFetched: null,
      hidePassing: true,
      labels: getLabels(props.checks),
      selectedLabels: getLabels(props.checks),
      checks: props.checks ? props.checks : [],
    };
  }

  setChecks(checks) {
    if (checks.checks) {
      // FIXME unify pipeline for demo and remote
      checks = checks.checks;
    }
    this.setState({
      checks: checks,
      labels: getLabels(checks),
      lastFetched: new Date(),
    });
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

  fetch() {
    fetch(this.url)
      .then((result) => result.json())
      .then(this.setChecks);
  }

  toggleLabel(label) {
    this.setState((state) => {
      return { selectedLabels: toggleLabel(state.selectedLabels, label) };
    });
  }

  setStyle(style) {
    this.setState({
      style: style,
    });
  }

  togglePassing() {
    this.setState((state) => {
      return {
        hidePassing: !state.hidePassing,
      };
    });
  }

  select(check) {
    this.setState({
      selected: check,
    });
    if (this.modal.current != null) {
      this.modal.current.show();
    }
  }

  render() {
    // first filter for pass/faill
    var checks = filterChecks(this.state.checks, this.state.hidePassing, []);
    // get labels for the new subset
    var labels = getLabels(checks);
    // filter the subset down
    checks = filterChecks(
      checks,
      this.stateHidePassing,
      this.state.selectedLabels
    );
    checks = orderBy(checks, CanarySorter);
    var passed = reduce(checks, (sum, c) => (isHealthy(c) ? sum + 1 : sum), 0);
    var passedAll = reduce(
      this.state.checks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );

    return (
      <>
        <div className="flex justify-center ">
          <div className="max-w-7xl flex flex-col sm:flex-row ">
            <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
              <div className="h-full pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
                <div className="h-full relative h-min-1">
                  <div>
                    <div className="mt-5 grid grid-cols-1 gap-5  flex-wrap">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dl>
                            <dt className="text-sm leading-5 font-medium text-gray-500 truncate">
                              All Checks
                            </dt>
                            <dd className="mt-1 text-3xl leading-9 font-semibold text-gray-900">
                              {this.state.checks.length}
                              <span className="text-xl font-light">
                                {" "}
                                (
                                <span className="text-green-500">
                                  {passedAll}
                                </span>
                                /
                                <span className="text-red-500">
                                  {this.state.checks.length - passedAll}
                                </span>
                                )
                              </span>
                            </dd>
                          </dl>
                        </div>
                      </div>

                      {checks.length != this.state.checks.length && (
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <dl>
                              <dt className="text-sm leading-5 font-medium text-gray-500 truncate">
                                Filtered Checks
                              </dt>
                              <dd className="mt-1 text-3xl leading-9 font-semibold text-gray-900">
                                {checks.length}
                                <span className="text-xl  font-light">
                                  {" "}
                                  (
                                  <span className="text-green-500">
                                    {passed}
                                  </span>
                                  /
                                  <span className="text-red-500">
                                    {checks.length - passed}
                                  </span>
                                  )
                                </span>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                <div className="relative h-full">
                  {this.state.style.name == "card" && (
                    <CanaryCards checks={checks} onClick={this.select} />
                  )}
                  {this.state.style.name == "table" && (
                    <CanaryTable checks={checks} onClick={this.select} />
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
              <div className="h-full pl-6 py-6 lg:w-80">
                <div className="h-full relative">
                  <Dropdown
                    items={[card, table]}
                    selected={this.state.style}
                    setSelected={this.setStyle}
                    className="mb-3"
                  />

                  <Toggle
                    label="Hide Passing"
                    enabled={this.state.hidePassing}
                    setEnabled={this.togglePassing}
                    className="mb-3"
                  />

                  {labels.map((label) => (
                    <Toggle
                      key={label.label}
                      label={label.label}
                      enabled={
                        labelIndex(this.state.selectedLabels, label) >= 0
                      }
                      setEnabled={() => this.toggleLabel(label)}
                      className="mb-3"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.selected != null && (
          <Modal
            ref={this.modal}
            submitText=""
            title={<Title check={this.state.selected} />}
            body={<CanaryDescription check={this.state.selected} />}
            open={true}
          />
        )}
      </>
    );
  }
}
