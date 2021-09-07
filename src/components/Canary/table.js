import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { Title, Uptime, Latency } from "./renderers";
import { StatusList } from "./status";
import { aggregate } from "./aggregate";

import { sortChecks, sortGroupedChecks, sortValues } from "./sorting";

export function CanaryTable({
  className,
  hasGrouping,
  groupingLabel,
  checks,
  groupedChecks,
  onClick,
  theadClass,
  ...rest
}) {
  const [sortedChecks, setSortedChecks] = useState(checks);
  const [sortedGroups, setSortedGroups] = useState(Object.keys(groupedChecks));
  const initialSortState = {
    check: sortValues[0],
    health: sortValues[0],
    uptime: sortValues[0],
    latency: sortValues[0]
  };
  const [sortState, setSortState] = useState(initialSortState);

  const resetSortState = () => {
    setSortState(initialSortState);
  };

  // handle table header click. updates sort column/direction.
  const handleSortChange = (columnKey) => {
    // cycle between sortValues on consecutive clicks
    const sortValueIndex = sortValues.indexOf(sortState[columnKey]);
    const newIndex = (sortValueIndex + 1) % sortValues.length;
    const newSortDirection = sortValues[newIndex];

    // reset other columns and update sortState
    const newSortState = { ...initialSortState };
    newSortState[columnKey] = newSortDirection;
    setSortState(newSortState);

    if (newSortDirection === sortValues[0]) {
      // if no direction selected, reset sort to initial state
      setSortedChecks(checks);
      setSortedGroups(Object.keys(groupedChecks));
    } else if (!hasGrouping) {
      // perform sorting on Checks
      setSortedChecks(sortChecks(checks, columnKey, newSortDirection));
    } else {
      // perform sorting on grouped Checks
      setSortedGroups(
        sortGroupedChecks(groupedChecks, columnKey, newSortDirection)
      );
    }
  };

  // reset sort state and update table on checks/groups change
  useEffect(() => {
    resetSortState();
    if (checks) {
      setSortedChecks(checks);
    }
    if (groupedChecks) {
      setSortedGroups(Object.keys(groupedChecks));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checks, groupedChecks]);

  return (
    <div className={`rounded-md border border-gray-200 ${className}`} {...rest}>
      <table className="min-w-full divide-y divide-gray-200 relative">
        <thead className={theadClass}>
          <tr>
            <TableHeader
              label={hasGrouping ? groupingLabel : "Check"}
              hasSorting
              onSortChange={(key) => handleSortChange(key)}
              sortDirection={sortState.check}
              columnKey="check"
            />
            <TableHeader
              label="Health"
              hasSorting
              onSortChange={handleSortChange}
              sortDirection={sortState.health}
              columnKey="health"
            />
            <TableHeader
              label="Uptime"
              hasSorting
              onSortChange={handleSortChange}
              sortDirection={sortState.uptime}
              columnKey="uptime"
            />
            <TableHeader
              label="Latency"
              hasSorting
              onSortChange={handleSortChange}
              sortDirection={sortState.latency}
              columnKey="latency"
            />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hasGrouping ? (
            <>
              {sortedGroups.map((groupName) => (
                <TableGroupRow
                  showIcon
                  key={groupName}
                  title={groupName}
                  items={groupedChecks[groupName]}
                  onClick={onClick}
                />
              ))}
            </>
          ) : (
            <>
              {sortedChecks.length > 0 &&
                sortedChecks.map((check) => (
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

function TableHeader({
  label,
  hasSorting,
  columnKey,
  onSortChange,
  sortDirection,
  className
}) {
  const handleSort = () => {
    if (onSortChange) {
      onSortChange(columnKey);
    }
  };

  return (
    <th
      scope="col"
      onClick={hasSorting ? handleSort : () => {}}
      className={`${className} px-6 py-3 bg-gray-100 first:rounded-tl-md last:rounded-tr-md  text-gray-500  ${
        hasSorting ? "hover:text-indigo-700 cursor-pointer" : ""
      }`}
    >
      <div className="flex select-none text-left text-xs font-medium uppercase tracking-wider">
        <span className="">{label}</span>
        <span className="text-indigo-700 ml-1">
          {sortDirection === "asc" ? (
            <TiArrowSortedDown />
          ) : sortDirection === "desc" ? (
            <TiArrowSortedUp />
          ) : (
            ""
          )}
        </span>
      </div>
    </th>
  );
}

function TableGroupRow({ title, items, onClick, showIcon, ...rest }) {
  const [expanded, setExpanded] = useState(false);
  const [aggregated, setAggregated] = useState(null);

  useEffect(() => {
    setAggregated(aggregate(title, items));
  }, [items, title]);

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
