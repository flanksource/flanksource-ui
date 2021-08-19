import { format } from 'timeago.js';
import Icon from "../Icon";
import Modal from "../Modal";
import Status from "../Status";
import { useState } from 'react'
import Description from "../DescriptionCard";
import Table from "../Table";
import TimeAgo from 'timeago-react';
import React from 'react';
import Badge from '../Badge';
import Toggle from '../Toggle';
import Dropdown from '../Dropdown';
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri"
import { countBy, filter, findIndex, forEach, orderBy, reduce } from 'lodash';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function duration(ms) {
  if (ms == 0) {
    return "";
  }
  if (ms < 1000) {
    return ms + "ms";
  }
  if (ms < 1000 * 60) {
    return (ms / 1000).toFixed() + "s";
  }
  if (ms < 1000 * 60 * 60) {
    return (ms / 1000 / 60).toFixed() + "m";
  }
  return (ms / 1000 / 60 / 6).toFixed(1) + "h";
}

function getStatii(check) {
  var statii = check.checkStatuses
  var data = []
  if (statii == null) {
    return data
  }
  statii.map((status, idx) => {
    data.push({
      "key": check.key + "." + idx,
      "age": format(status.time + " UTC"),
      "message": <> <CanaryStatus status={status} /> {status.message} {status.error}</>,
      "duration": duration(status.duration)
    })
  })
  return data

}

function getUptime(check) {
  if (check.health) {
    return check.health.uptime
  }
  return check.uptime
}

function getLatency(check) {
  if (check.health) {
    return check.health.latency
  }
  return check.latency
}

function Labels({ labels }) {
  if (labels == null) {
    return null
  }
  var items = []
  for (var k in labels) {
    if (labels[k] == "true") {
      items.push(<div key={`${k}`}><Badge text={k} /> </div>)
    } else {
      items.push(<div key={`${k}-${labels[k]}`}><Badge text={`${k}: ${labels[k]}`} /> </div>)

    }
  }
  return items
}

function getLabels(checks) {
  var labelMap = {}
  for (const check of checks) {
    if (check.labels) {
      for (let k in check.labels) {
        let v = check.labels[k]
        var id = `canary:${k}:${v}`
        labelMap[id] = { type: "canary", id: id, key: k, value: v, label: `${k}: ${v}` }
      }
    }
  }

  var labels = []
  Object.values(labelMap).map((label) => {
    if (label.value == "true") {
      label.label = label.key
    }
    labels.push(label)
  }
  )
  return labels
}

function getDescription(check) {
  var health = check.health
  return [

    {
      key: check.key + "name",
      name: "Name", value: <span>
        {check.namespace}/{check.name}
      </span>
    },
    { key: check.key + "namespace", name: "Namespace", value: <Badge text={check.namespace} /> },
    {
      key: check.key + "latency",
      name: "Latency", value: getLatency(check)
    },
    {
      key: check.key + "uptime",
      name: "Uptime", value: getUptime(check)
    },
    {
      key: check.key + "owner",
      name: "Owner", value: check.owner
    },
    {
      key: check.key + "severity",
      name: "Severity", value: check.severity
    },
    {
      key: check.key + "labels",
      name: "Labels", value: <Labels labels={check.labels} />
    },
    {
      key: check.key + "runner",
      name: "Runner", value: <Labels labels={check.runnerLabels} />
    },

    {
      key: check.key + "interval",
      name: "Interval", value: check.interval > 0 ? check.interval : check.schedule
    },
    {
      key: check.key + "type",
      name: "Type", value: check.type
    },
    {
      key: check.key + "endpoint",
      name: "Endpoint", value: check.endpoint, colspan: 2
    },
    {
      key: check.key + "checks",
      name: "Checks", value: <Table
        id={check.key + '-table'}
        data={getStatii(check)}
        columns={["Age", "Duration", "Message"]}
      />, colspan: 2
    },

  ]
}

const table = {
  name: "table",
  icon: <RiLayoutGridLine />,
  label: "Table"
}
const card = {
  name: "card",
  icon: <BsTable />,
  label: "Card"
}


function labelIndex(selectedLabels, label) {
  return findIndex(selectedLabels, (l) => l.id == label.id)
}

function toggleLabel(selectedLabels, label) {
  var index = labelIndex(selectedLabels, label)
  if (index >= 0) {
    return selectedLabels.filter((i) => i.id != label.id)
  } else {
    selectedLabels.push(label)
  }
  return selectedLabels
}


function matchesLabel(check, labels) {
  if (labels.length == 0) {
    return true
  }
  for (let label of labels) {
    if (label.type == "canary") {
      if (check.labels == null) {
        return true
      }
      if (check.labels[label.key] == label.value) {
        return true
      }
    } else {
      return true
    }
  }
  return false
}

function isHealthy(check) {

  if (check.checkStatuses == null) {
    return false
  }

  var passed = true
  forEach(check.checkStatuses, (s) => {
    passed = passed && s.status
  })
  return passed

}

function filterChecks(checks, hidePassing, labels) {
  checks = orderBy(checks, (a) => a.description)
  var filtered = []
  for (let check of checks) {
    if (hidePassing && isHealthy(check)) {
      continue
    }

    if (!matchesLabel(check, labels)) {
      continue
    }
    filtered.push(check)

  }
  return filtered

}


export default class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.url = props.url
    this.interval = 10
    this.modal = React.createRef()
    this.fetch = this.fetch.bind(this)
    this.select = this.select.bind(this)
    this.setStyle = this.setStyle.bind(this)
    this.toggleLabel = this.toggleLabel.bind(this)
    this.togglePassing = this.togglePassing.bind(this)
    this.state = {
      style: table,
      selected: null,
      lastFetched: null,
      hidePassing: true,
      labels: getLabels(props.checks),
      selectedLabels: getLabels(props.checks),
      checks: props.checks ? props.checks : []
    }
  }

  setChecks(checks) {
    this.setState({
      checks: checks,
      labels: getLabels(checks),
      lastFetched: new Date()
    })
  }

  componentDidMount() {
    if (this.url == null) {
      return
    }
    this.fetch()
    this.timer = setInterval(() => this.fetch(), this.interval * 1000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  fetch() {
    fetch(this.url)
      .then(result => result.json())
      .then(this.setChecks);
  }

  toggleLabel(label) {
    this.setState((state) => {
      return { "selectedLabels": toggleLabel(state.selectedLabels, label) }
    })
  }

  setStyle(style) {
    this.setState({
      "style": style
    });
  }

  togglePassing() {
    this.setState((state) => {
      return {
        "hidePassing": !state.hidePassing,
      }
    })
  }

  select(check) {
    this.setState({
      selected: check
    })
    if (this.modal.current != null) {
      this.modal.current.show()
    }
  }

  render() {
    // first filter for pass/faill
    var checks = filterChecks(this.state.checks, this.state.hidePassing, [])
    // get labels for the new subset
    var labels = getLabels(checks)
    // filter the subset down
    checks = filterChecks(checks, this.stateHidePassing, this.state.selectedLabels)
    var passed = reduce(checks, (sum, c) => isHealthy(c) ? sum + 1 : sum, 0)
    var passedAll = reduce(this.state.checks, (sum, c) => isHealthy(c) ? sum + 1 : sum, 0)

    return (
      <>
        <div className="">
          <div>
            <div className="fixed top-0 left-0 w-1/2 h-full bg-white" ></div>
            <div className="fixed top-0 right-0 w-1/2 h-full bg-gray-50" ></div>
            <div className="relative min-h-screen flex flex-col">

              <div className="flex-grow w-full 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto xl:px-8 lg:flex">
                <div className="flex-1 min-w-0 bg-white xl:flex">
                  <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
                    <div className="h-full pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
                      <div className="h-full relative h-min-1" >
                        <div>
                          <div className="mt-5 grid grid-cols-1 gap-5  flex-wrap">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                              <div className="px-4 py-5 sm:p-6"><dl><dt className="text-sm leading-5 font-medium text-gray-500 truncate">All Checks</dt><dd className="mt-1 text-3xl leading-9 font-semibold text-gray-900">{this.state.checks.length}
                                <span className="text-xl font-light">
                                  {" "} (<span className="text-green-500">{passedAll}</span>/<span className="text-red-500">{this.state.checks.length - passedAll}</span>)
                                </span>
                              </dd></dl></div>
                            </div>

                            {checks.length != this.state.checks.length &&
                              <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6"><dl><dt className="text-sm leading-5 font-medium text-gray-500 truncate">Filtered Checks</dt><dd className="mt-1 text-3xl leading-9 font-semibold text-gray-900">{checks.length}
                                  <span className="text-xl  font-light">
                                    {" "} (<span className="text-green-500">{passed}</span>/<span className="text-red-500">{checks.length - passed}</span>)
                                  </span>
                                </dd></dl></div>
                              </div>
                            }

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white lg:min-w-0 lg:flex-1">
                    <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                      <div className="relative h-full " style={{ "min-height": "36rem" }}>

                        {this.state.style.name == "card" && <CanaryCards checks={checks} onClick={this.select} />}
                        {this.state.style.name == "table" && <CanaryTable checks={checks} onClick={this.select} />}

                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
                  <div className="h-full pl-6 py-6 lg:w-80">
                    <div className="h-full relative" style={{ "min-height": "16rem" }}>

                      <Dropdown items={[card, table]} selected={this.state.style} setSelected={this.setStyle} className="mb-3" />

                      <Toggle label="Hide Passing" enabled={this.state.hidePassing} setEnabled={this.togglePassing} className="mb-3" />

                      {
                        labels.map((label) => (
                          <Toggle label={label.label} enabled={labelIndex(this.state.selectedLabels, label) >= 0} setEnabled={() => this.toggleLabel(label)} className="mb-3" />
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          this.state.selected != null &&
          <Modal
            ref={this.modal}
            submitText=""
            title={<>
              <Icon name={this.state.selected.icon ? this.state.selected.icon : this.state.selected.type} className="inline" size="xl" />
              {this.state.selected.description}
            </>}
            body={<Description items={getDescription(this.state.selected)} />}
            open={true}
          />
        }
      </>
    );
  }
}


export class CanaryTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="flex flex-col max-w-max">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block max-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                      Check
                    </th>
                    <th scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                      Health
                    </th>

                    <th scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                      Uptime
                    </th>
                    <th scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                      Latency
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {this.props.checks.map((check, idx) => (
                    <tr key={check.key + "table" + idx} onClick={() => this.props.onClick(check)} className="cursor-pointer">
                      <td className="px-6 py-2 whitespace-nowrap">
                        <Icon name={check.icon ? check.icon : check.type} className="inline" size="lg" />
                        {check.description}
                      </td >
                      <td className="px-6 py-2 whitespace-nowrap">
                        {check.checkStatuses && check.checkStatuses.map((status, idx) =>
                          <CanaryStatus key={`${check.key}-s${idx}`} status={status} className="mr-0.5" />
                        )}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {check.health ? check.health.uptime : check.uptime}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {check.health ? check.health.latency : check.latency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export class CanaryCards extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ul className={`mt-1 grid grid-cols-1 gap-1 sm:gap-2 `}>
        {this.props.checks.map((check) => (

          <li key={check.key} className="col-span-1 flex shadow-sm rounded-md ">
            <div
              className={classNames(
                check.bgColor,
                'check-shrink-0 flex items-center justify-center w-12 text-white text-sm font-medium rounded-l-md border-l border-t border-b border-gray-200'
              )}
            >
              <Icon name={check.icon ? check.icon : check.type} className="inline" size="lg" />

            </div>
            <div className="flex-1 flex items-center cursor-pointer justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate  " onClick={() => this.props.onClick(check)}>
              <div className="flex-1 py-2 text-sm ">
                <span className="text-gray-900 font-medium hover:text-gray-600 truncate">
                  {check.description}
                </span>
                <div className="float-right mr-2">
                  {check.checkStatuses && check.checkStatuses.message}
                  {check.checkStatuses && check.checkStatuses.map((status, idx) =>
                    <CanaryStatus key={`${check.key}-s${idx}`} status={status} className="mr-0.5" />
                  )}
                </div>
              </div>
            </div>
          </li>
        ))
        }
      </ul >
    )
  }
}

export function CanaryStatus({ status, className }) {
  return (
    <Status state={status.status ? "ok" : "bad"} className={className} />
  )
}
