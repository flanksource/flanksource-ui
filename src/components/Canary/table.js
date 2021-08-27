import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Title, Uptime, Latency } from "./data";
import { StatusList, CanaryStatus } from "./status";
import { Icon } from "../Icon";

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

function aggregateIcon(iconList) {
  iconList = iconList.filter((icon) => icon !== "");
  if (iconList.length === 0) {
    return null;
  }
  let icon = iconList[0];
  for (let i = 0; i < iconList.length; i += 1) {
    if (iconList[i] !== icon) {
      icon = "multiple";
      break;
    }
  }
  return icon;
}

function aggregateType(typeList) {
  typeList = typeList.filter((type) => type !== "");
  if (typeList.length === 0) {
    return null;
  }
  let type = typeList[0];
  for (let i = 0; i < typeList.length; i += 1) {
    if (typeList[i] !== type) {
      type = "multiple";
      break;
    }
  }
  return type;
}

function aggregateStatuses(statusLists) {
  const allStatuses = statusLists
    .filter((item) => item !== null && item.length > 0)
    .flatMap((item) => item);
  let n = 0;
  allStatuses.forEach((item) => {
    if (item.status) {
      n += 1;
    }
  });
  const scorePercentage = n / allStatuses.length;
  const scoreSimple = Math.floor(scorePercentage * 5);

  const aggregated = [];
  for (let i = 0; i < scoreSimple; i += 1) {
    aggregated.push({
      id: aggregated.length,
      invalid: false,
      status: true
    });
  }
  while (aggregated.length < 5) {
    aggregated.push({
      id: aggregated.length,
      invalid: false,
      status: false
    });
  }
  return aggregated;
}

function TableGroupRow({ title, items, onClick, showIcon, ...rest }) {
  const [expanded, setExpanded] = useState(false);
  const [aggregatedIcon, setAggregatedIcon] = useState(null);
  const [aggregatedType, setAggregatedType] = useState(null);
  const [aggregatedStatuses, setAggregatedStatuses] = useState(null);

  useState(() => {
    const iconsList = items.map((item) => item.icon);
    const typesList = items.map((item) => item.type);
    const statusLists = items.map((item) => item.checkStatuses);

    setAggregatedIcon(aggregateIcon(iconsList));
    setAggregatedType(aggregateType(typesList));
    setAggregatedStatuses(aggregateStatuses(statusLists));
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
              className={`${
                expanded ? "transform rotate-90" : ""
              } mr-4 duration-75`}
            />
            {showIcon && (
              <Icon
                name={aggregatedIcon || aggregatedType}
                className="inline mr-3"
                size="xl"
              />
            )}
            {title}
          </div>
        </td>
        <td className="px-6 py-2 whitespace-nowrap">
          <StatusList checkStatuses={aggregatedStatuses} />
        </td>
        <td />
        <td />
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
