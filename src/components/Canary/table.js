import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { Title, Uptime, Latency } from "./renderers";
import { StatusList } from "./status";
import { aggregate } from "./aggregate";

export function CanaryTable({
  className,
  hasGrouping,
  groupingLabel,
  checks,
  onClick,
  theadClass,
  ...rest
}) {
  const sortValues = ["none", "asc", "desc"];
  const initialSortState = {
    check: sortValues[0],
    health: sortValues[0],
    uptime: sortValues[0],
    latency: sortValues[0]
  };
  const [sortState, setSortState] = useState(initialSortState);

  const handleSort = (columnKey) => {
    console.log("click", columnKey);
    const currentIndex = sortValues.indexOf(sortState[columnKey]);
    const newIndex = (currentIndex + 1) % sortValues.length;
    const newSortDirection = sortValues[newIndex];
    const newSortState = { ...initialSortState };
    newSortState[columnKey] = newSortDirection;
    setSortState(newSortState);
  };

  return (
    <div className={`rounded-md border border-gray-200 ${className}`} {...rest}>
      <table className="min-w-full divide-y divide-gray-200 relative">
        <thead className={theadClass}>
          <tr>
            <TableHeader
              label={hasGrouping ? groupingLabel : "Check"}
              onSortChange={(key) => handleSort(key)}
              sortDirection={sortState.check}
              columnKey="check"
            />
            <TableHeader
              label="Health"
              onSortChange={handleSort}
              sortDirection={sortState.health}
              columnKey="health"
            />
            <TableHeader
              label="Uptime"
              onSortChange={handleSort}
              sortDirection={sortState.uptime}
              columnKey="uptime"
            />
            <TableHeader
              label="Latency"
              onSortChange={handleSort}
              sortDirection={sortState.latency}
              columnKey="latency"
            />
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
                    <Title key={`${check.key}-title`} check={check} />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <StatusList key={`${check.key}-status`} check={check} />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <Uptime key={`${check.key}-uptime`} check={check} />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <Latency key={`${check.key}-latency`} check={check} />
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
      onClick={handleSort}
      className={`${className} px-6 py-3 bg-gray-100 first:rounded-tl-md last:rounded-tr-md hover:text-indigo-700 text-gray-500 cursor-pointer`}
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
              <Title key={`${item.key}-title`} check={item} />
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
              <StatusList key={`${item.key}-status`} check={item} />
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
              <Uptime key={`${item.key}-uptime`} check={item} />
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
              <Latency key={`${item.key}-latency`} check={item} />
            </td>
          </tr>
        ))}
    </>
  );
}
