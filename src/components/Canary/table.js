import React from "react";
import { Title, Uptime, Latency } from "./data";
import Icon from "../Icon";
import StatusList from "./status";

export class CanaryTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="flex flex-col max-w-max min-w-full">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block max-w-full min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      Check
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      Health
                    </th>

                    <th
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      Uptime
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      Latency
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {this.props.checks.map((check, idx) => (
                    <tr
                      key={check.key + "table" + idx}
                      onClick={() => this.props.onClick(check)}
                      className="cursor-pointer"
                    >
                      <td className="px-6 py-2 whitespace-nowrap">
                        <Title check={check} />
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <StatusList check={check} />
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <Uptime check={check} />
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <Latency check={check} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
