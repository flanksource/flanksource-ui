import React from "react";
import { LogsTable } from "../../../Logs/Table/logs-table";

export function EvidenceItem({ evidence }) {
  if (evidence.type === "log") {
    return <LogsTable logs={evidence.evidence} title="" />;
  }
  return (
    <div>
      {evidence.type}
      {evidence.description}
      {evidence.evidence}
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
      <div className="border mt-2">
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
