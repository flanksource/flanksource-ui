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
    items.push(<div key={`${k}-${labels[k]}`}><Badge text={`${k}: ${labels[k]}`} /> </div>)
  }
  return items
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


export default class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.url = props.url
    this.interval = 10
    this.modal = React.createRef()
    this.fetch = this.fetch.bind(this)
    this.select = this.select.bind(this)
    this.setStyle = this.setStyle.bind(this)
    this.state = {
      style: props.style ? props.style : "table",
      selected: null,
      lastFetched: null,
      checks: props.checks ? props.checks : []
    }
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
      .then(result => this.setState({ checks: result.checks, lastFetched: new Date() }));
  }

  setStyle(style) {
    this.setState({
      "style": style,
    });
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

    return (
      <>


        <Description items={[
          { name: "URL", value: this.url, colspan: 2 },
          { name: "Last Run", value: <Badge text={<TimeAgo datetime={this.state.lastFetched} />} /> },
          {
            name: "Style", value: <>

              <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button
                  type="button"
                  onClick={() => this.setStyle("card")}
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  Card
                </button>

                <button
                  onClick={() => this.setStyle("table")}
                  type="button"
                  className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  Table
                </button>
              </span>
            </>
          }
        ]} />

        <hr className="my-5" />


        {this.state.style == "card" && <CanaryCards checks={this.state.checks} onClick={this.select} />}
        {this.state.style == "table" && <CanaryTable checks={this.state.checks} onClick={this.select} />}

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
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
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
                  {check.checkStatuses.message}
                  {check.checkStatuses.map((status, idx) =>
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
