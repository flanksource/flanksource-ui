import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Title, Uptime, Latency } from "./renderers";
import { StatusList } from "./status";
import { aggregate } from "./aggregate"

export function CanaryTable({
  className,
  hasGrouping,
  groupingLabel,
  checks,
  onClick,
  theadClass,
  ...rest
}) {
  const tableHeaderClass = `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 first:rounded-tl-md last:rounded-tr-md`;
  return (
    <div className={`rounded-md border border-gray-200 ${className}`} {...rest}>
      <table className="min-w-full divide-y divide-gray-200 relative">
        <thead className={theadClass}>
          <tr>
            <th scope="col" className={tableHeaderClass}>
              {hasGrouping ? groupingLabel : "Check"}
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
          {hasGrouping ? (
            <>
              {Object.keys(checks)
                // make sure "Others" is sorted to the back
                .sort((a, b) => {
                  if (b === "Others") {
                    return -1;
                  }
                  return 0;
                })
                .map((group) => (
                  <TableGroupRow
                    showIcon
                    key={group}
                    title={group}
                    items={checks[group]}
                    onClick={onClick}
                  />
                ))}
            </>
          ) : (
            <>
              {checks.map((check) => (
                <tr
                  key={check.key}
                  onClick={() => onClick(check)}
                  className="cursor-pointer"
                >
                  <td className="px-6 py-2 w-full max-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
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
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}


function TableGroupRow({ title, items, onClick, showIcon, ...rest }) {
  const [expanded, setExpanded] = useState(false);
  const [aggregated, setAggregated] = useState(null);

  useEffect(() => {
    setAggregated(aggregate(title, items))
  }, [items, items.length]);

  return (
    <>
      <tr
        title="Click to expand row"
        aria-expanded={expanded}
        className="cursor-pointer bg-white"
        onClick={() => {
          setExpanded(!expanded);
        }}
        {...rest}
      >
        <td className="px-6 py-3 w-full">
          <div className="flex items-center select-none">
            <FaChevronRight
              className={`${expanded ? "transform rotate-90" : ""
                } mr-4 duration-75`}
            />
            <Title check={aggregated} />
          </div>
        </td>
        <td className="px-6 py-2 whitespace-nowrap">
          <StatusList check={aggregated} />
        </td>
        <td className="px-6 py-2 whitespace-nowrap">
          <Uptime check={aggregated} />
        </td>
        <td className="px-6 py-2 whitespace-nowrap">
          <Latency check={aggregated} />
        </td>
      </tr>
      {expanded &&
        items.map((item) => (
          <tr
            key={item.key}
            onClick={() => onClick(item)}
            className="cursor-pointer"
          >
            <td className="px-6 pl-14 py-2 w-full max-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
              <Title check={item} />
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
              <StatusList check={item} />
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
              <Uptime check={item} />
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
              <Latency check={item} />
            </td>
          </tr>
        ))}
    </>
  );
}
