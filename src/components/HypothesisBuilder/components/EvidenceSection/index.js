import React from "react";
import { LogsTable } from "../../../Logs/Table/logs-table";
import { TopologyCard } from "../../../Topology";

export function EvidenceItem({ evidence }) {
  if (evidence.type === "log") {
    return <LogsTable logs={evidence.evidence} title="" />;
  }
  if (evidence.type === "topology") {
    return <TopologyCard topologyId={evidence.evidence.id} />;
  }
  return (
    <div>
      {evidence.type}
      {evidence.description}
    </div>
  );
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
        <div className="">{titlePrepend}</div>
        <button
          type="button"
          onClick={onButtonClick}
          className="hidden inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add evidence
        </button>
      </div>
      <div className="mt-2">
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
