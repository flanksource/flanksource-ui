import React from "react";
import { BsPlusLg } from "react-icons/all";
import { LogsTable } from "../../../Logs/Table/logs-table";
import { TopologyCard } from "../../../Topology";
import { DatabasePlusIcon } from "../../../Src-icons";

export function EvidenceItem({ evidence }) {
  if (evidence.type === "log") {
    return <LogsTable logs={evidence.evidence} title="" />;
  }
  if (evidence.type === "topology") {
    return <TopologyCard topologyId={evidence.evidence.id} size="small" />;
  }
  return null;
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
        {evidence && evidence.length > 0 ? (
          evidence.map((evidence) => (
            <EvidenceItem key={evidence.id} evidence={evidence} />
          ))
        ) : (
          <div className="border border-dashed border-gray-300 rounded-8px flex justify-center pt-8 mt-2.5">
            <div className="flex flex-col mx-auto mb-6">
              <div className="mx-auto">
                <DatabasePlusIcon className="text-red-400 w-10 h-10" />
              </div>
              <p className="text-sm leading-5 font-medium pt-2.5">
                Add evidence
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
