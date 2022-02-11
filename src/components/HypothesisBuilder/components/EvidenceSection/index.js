import React from "react";
import { BsPlusLg } from "react-icons/all";
import { LogsTable } from "../../../Logs/Table/logs-table";
import { TopologyCard } from "../../../Topology";
import { EvidenceLogTable } from "../../../EvidenceLogTable/EvidenceLogTable";

export function EvidenceItem({ evidence }) {
  if (evidence.type === "log") {
    return <EvidenceLogTable evidence={evidence} />;
  }
  if (evidence.type === "topology") {
    return <TopologyCard topologyId={evidence.evidence.id} size="small" />;
  }
  return <LogsTable logs={evidence.evidence} title="" />;
}
export function EvidenceSection({
  evidence,
  hypothesis,
  titlePrepend,
  onButtonClick,
  ...rest
}) {
  return (
    <div className={rest.className} {...rest}>
      <div className="flex justify-between items-center">
        <div className="flex align-baseline font-inter text-large font-semibold">
          <h2 className="text-gray-dark mr-2">{titlePrepend}</h2>
          <button
            type="button"
            className="btn-round btn-round-primary btn-round-xs"
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
        {evidence && evidence.length > 0 ? (
          evidence.map((evidence) => (
            <EvidenceItem key={evidence.id} evidence={evidence} />
          ))
        ) : (
          <div className="py-2 px-4 text-sm text-gray-400">No evidence</div>
        )}
      </div>
    </div>
  );
}
