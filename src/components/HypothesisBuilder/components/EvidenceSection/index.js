import React from "react";
import dayjs from "dayjs";
import { BsFillBarChartFill } from "react-icons/all";
import { LogsTable } from "../../../Logs/Table/logs-table";
import { TopologyCard } from "../../../Topology";
import { Icon } from "../../../Icon";

export function EvidenceItem({ evidence }) {
  if (evidence.type === "log") {
    return <LogsTable logs={evidence.evidence} title="" />;
  }
  if (evidence.type === "topology") {
    return <TopologyCard topologyId={evidence.evidence.id} />;
  }
  return (
    <div>
      <div className="flex flex-row gap-x-10 py-1.5 border-b" key={evidence.id}>
        <div className="flex flex-row">
          <div className="text-dark-blue">
            <BsFillBarChartFill />
          </div>
          <p className="ml-2.5 text-sm leading-5 font-medium">
            {dayjs(evidence.created_at).format("MMM DD, YYYY HH:mm.ss.mmm")}
          </p>
        </div>
        <p className="max-w-5/10 text-sm leading-5 font-medium truncate">
          {evidence.description}
        </p>
      </div>
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
        <div className="flex align-baseline font-inter text-large font-semibold">
          <h2 className="text-dark-gray mr-3">{titlePrepend}</h2>
          <div className="bg-dark-blue rounded-full p-2">
            <Icon name="addButton" className="w-2.5 h-2.5" />
          </div>
        </div>
        <button
          type="button"
          onClick={onButtonClick}
          className="hidden inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add evidence
        </button>
      </div>
      <div className="mt-3.5">
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
