import React, { useEffect, useState } from "react";
import { ChevronRightIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { LogsTable } from "../../Logs/Table/logs-table";
import { CardSize, TopologyCard } from "../../TopologyCard";
import { Icon } from "../../Icon";
import { Button } from "../../Button";
import { BsTrash } from "react-icons/bs";
import { Evidence, EvidenceType } from "../../../api/services/evidence";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";

export function EvidenceItem({ evidence }: { evidence: Evidence }) {
  switch (evidence.type) {
    case EvidenceType.Log:
      return <LogsTable viewOnly logs={evidence?.evidence?.lines} />;
    case EvidenceType.Topology:
      return (
        <div className="pt-2">
          <TopologyCard
            topologyId={evidence.evidence.id}
            size={CardSize.large}
          />
        </div>
      );
    case EvidenceType.Config:
      return (
        <EvidenceAccordion
          date={evidence.created_at}
          title={evidence.description}
          configId={evidence.evidence.id}
          configName={evidence.evidence.configName}
          configType={evidence.evidence.configType}
        >
          <ConfigEvidenceView evidenceItem={evidence} />
        </EvidenceAccordion>
      );
    default:
      return null;
  }
}

const EvidenceAccordion: React.FC<{
  date: string;
  title: string;
  configId: string;
  configName: string;
  configType: string;
  children: React.ReactNode;
}> = ({ title, date, configId, configName, configType, children, ...rest }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="border-b last:border-b-0 flex flex-col" {...rest}>
      <div className="flex items-center justify-between">
        <button
          className="py-2 flex items-center"
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
                {formatDate(date, "HH:mm A, MMM DD, YYYY")}
              </div>
            )}
          </div>
        </button>
        <div>
          <Icon className="inline-block mr-2" name={configType} size="lg" />
          <Link
            to={`/configs/${configId}`}
            className="underline text-blue-600 hover:text-blue-800"
          >
            {configName && configName}
          </Link>
        </div>
      </div>
      {expanded && children}
    </div>
  );
};

function ConfigEvidenceView({
  evidenceItem
}: {
  evidenceItem: Extract<Evidence, { evidence: { configName: string } }>;
}) {
  const hunkLineGap = 3;
  const fullConfig = evidenceItem?.evidence?.lines || {};
  const selectedLines =
    Object.keys(evidenceItem?.evidence?.selected_lines) || [];
  const [hunks, setHunks] = useState([]);

  useEffect(() => {
    setHunks(
      createHunks(
        evidenceItem?.evidence?.lines,
        evidenceItem?.evidence?.selected_lines,
        hunkLineGap
      )
    );
  }, [evidenceItem]);

  return (
    <div>
      {evidenceItem ? (
        <div className="flex flex-col">
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
                        style={selected ? { backgroundColor: "#cfe3ff" } : {}}
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

function createHunks(fullConfig, selectedLines, hunkLineGap) {
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
  onDeleteEvidence,
  isLoading,
  ...rest
}) {
  return (
    <div className={rest.className} {...rest}>
      <div className="flex justify-between items-center">
        <div className="flex align-baseline font-inter text-large font-semibold">
          <h2 className="text-gray-900 mr-2">{titlePrepend}</h2>
        </div>
        <button
          type="button"
          onClick={onButtonClick}
          className="inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add evidence
        </button>
      </div>
      <div className="mt-2.5">
        {!isLoading ? (
          evidenceList && evidenceList.length > 0 ? (
            <div className="border rounded-md flex flex-col space-y-2">
              {evidenceList.map((evidence: Evidence) => (
                <div key={evidence.id} className="relative">
                  {onDeleteEvidence && (
                    <span className="absolute right-0 top-0">
                      <Button
                        className="btn-primary bg-opacity-40 hover:bg-opacity-100"
                        icon={<BsTrash className="mr-1" size={18} />}
                        text="Delete"
                        onClick={() => onDeleteEvidence(evidence.id)}
                      />
                    </span>
                  )}
                  <EvidenceItem evidence={evidence} />
                </div>
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
