import React from "react";
import { Title, Uptime, Latency } from "./data";
import StatusList from "./status";

export function CanaryTable({ ...props }) {
  const tableHeaderClass = `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 first:rounded-tl-md last:rounded-tr-md`;
  return (
    <div className="rounded-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 relative">
        <thead className="sticky top-0">
          <tr>
            <th scope="col" className={tableHeaderClass}>
              Check
            </th>
            <th scope="col" className={tableHeaderClass}>
              Health
            </th>

            <th scope="col" className={tableHeaderClass}>
              Uptime
            </th>
            <th scope="col" className={tableHeaderClass}>
              Latency
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {props.checks.map((check, idx) => (
            <tr
              key={check.key + "table" + idx}
              onClick={() => props.onClick(check)}
              className="cursor-pointer"
            >
              <td className="px-6 py-2 w-full max-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
                asdas dasda sasd asd asd as d
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
  );
}
