import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ChevronRightIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { BsPlusLg } from "react-icons/all";
import { LogsTable } from "../Logs/Table/logs-table";
import { TopologyCard } from "../Topology";
import { Icon } from "../Icon";

export function EvidenceItem({ evidence }) {
  if (evidence.type === "log") {
    return <LogsTable logs={evidence.evidence} title="" />;
  }
  if (evidence.type === "topology") {
    return <TopologyCard topologyId={evidence.evidence.id} size="small" />;
  }
  if (evidence.type === "config") {
    return (
      <EvidenceAccordion
        date={evidence.created_at}
        title={evidence.description}
      >
        <ConfigEvidenceView evidenceItem={evidence} />
      </EvidenceAccordion>
    );
  }
  return null;
}

export function EvidenceAccordion({ title, date, children, ...rest }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b last:border-b-0 flex flex-col" {...rest}>
      <button
        className={`${
          expanded && "border-b"
        } py-2 px-2 flex flex-row items-center`}
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="mr-2">
          <ChevronRightIcon
            className={`h-5 w-5 transform ${expanded && "rotate-90"}`}
          />
        </div>
        <div className="flex justify-between w-full items-center">
          {title || <span className="text-gray-400">(no title)</span>}
          {date && (
            <div className="text-gray-400 text-sm">
              {dayjs(date).format("HH:mm A, MMM DD, YYYY")}
            </div>
          )}
        </div>
      </button>

      {expanded && children}
    </div>
  );
}

export function ConfigEvidenceView({ evidenceItem }) {
  const hunkLineGap = 3;
  const fullConfig = evidenceItem?.evidence?.config_full || {};
  const selectedLines = Object.keys(evidenceItem?.evidence?.lines) || [];
  const [hunks, setHunks] = useState([]);

  useEffect(() => {
    setHunks(
      createHunks(
        evidenceItem?.evidence?.config_full,
        evidenceItem?.evidence?.lines,
        hunkLineGap
      )
    );
  }, [evidenceItem]);

  return (
    <div className="">
      {evidenceItem ? (
        <div className="flex flex-col p-1">
          {hunks.map(([hunkStart, hunkEnd], hunkIndex) => (
            <div key={`${hunkStart}-${hunkEnd}`}>
              <div className="border mb-1 last:mb-0">
                {Object.entries(fullConfig)
                  .filter(
                    ([lineIndex]) =>
                      lineIndex >= hunkStart && lineIndex <= hunkEnd
                  )
                  .map(([lineIndex, line]) => {
                    const selected = selectedLines.includes(lineIndex);
                    return (
                      <div
                        key={lineIndex}
                        className="flex"
                        style={{ background: selected && "#cfe3ff" }}
                      >
                        <div className="text-xs flex items-center justify-end px-1 text-gray-600 border-r w-8 select-none">
                          {lineIndex}
                        </div>
                        <code
                          className={`px-2 whitespace-pre-wrap text-xs ${
                            selected ? "text-gray-800" : "text-gray-600"
                          }`}
                        >
                          {line}
                        </code>
                      </div>
                    );
                  })}
              </div>
              {hunkIndex < hunks.length - 1 && (
                <DotsVerticalIcon className="h-4 w-4 text-gray-400 mb-1 ml-2" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>No Evidence</div>
      )}
    </div>
  );
}

export function createHunks(fullConfig, selectedLines, hunkLineGap) {
  const hunks = [];
  const lineNumbers = Object.keys(selectedLines);
  let hunkStart = Math.max(0, parseInt(lineNumbers[0], 10) - hunkLineGap);
  let prevNum = parseInt(lineNumbers[0], 10);
  lineNumbers.forEach((curr, idx) => {
    const currentNum = parseInt(curr, 10);
    if (currentNum - prevNum > hunkLineGap) {
      // went past hunk gap threshold; break gap.
      hunks.push([hunkStart, prevNum + hunkLineGap]);
      hunkStart = currentNum - hunkLineGap;
    }
    if (idx === lineNumbers.length - 1) {
      // last hunk, make sure to push.
      hunks.push([
        hunkStart,
        currentNum + hunkLineGap > Object.keys(fullConfig).length - 1
          ? Object.keys(fullConfig).length - 1
          : currentNum + hunkLineGap
      ]);
    }
    prevNum = currentNum;
  });
  return hunks;
}

export function EvidenceSection({
  evidenceList,
  hypothesis,
  titlePrepend,
  onButtonClick,
  isLoading,
  ...rest
}) {
  return (
    <div className={rest.className} {...rest}>
      <div className="flex justify-between items-center">
        <div className="flex align-baseline font-inter text-large font-semibold">
          <h2 className="text-gray-900 mr-2">{titlePrepend}</h2>
          <button
            type="button"
            className="btn-round btn-round-primary btn-round-sm"
          >
            <BsPlusLg />
          </button>
        </div>
        <button
          type="button"
          onClick={onButtonClick}
          className="hidden inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add evidence
        </button>
      </div>
      <div className="mt-2.5">
        {!isLoading ? (
          evidenceList && evidenceList.length > 0 ? (
            <div className="border rounded-md">
              {evidenceList.map((evidence) => (
                <EvidenceItem key={evidence.id} evidence={evidence} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-8px flex justify-center pt-8 mt-2.5">
              <div className="flex flex-col mx-auto mb-6">
                <div className="mx-auto">
                  <Icon name="database-plus" className="w-10 h-10" />
                </div>
                <p className="text-sm leading-5 font-medium pt-2.5">
                  Add evidence
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="text-sm text-gray-400">Loading...</div>
        )}
      </div>
    </div>
  );
}
