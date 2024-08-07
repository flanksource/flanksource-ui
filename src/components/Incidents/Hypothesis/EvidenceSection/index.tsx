import {
  useGetConfigByIdQuery,
  useGetConfigInsight
} from "@flanksource-ui/api/query-hooks";
import { getCanaries } from "@flanksource-ui/api/services/topology";
import { ConfigAnalysis } from "@flanksource-ui/api/types/configs";
import { Evidence, EvidenceType } from "@flanksource-ui/api/types/evidence";
import { Hypothesis } from "@flanksource-ui/api/types/hypothesis";
import { CheckDetails } from "@flanksource-ui/components/Canary/CanaryPopup/CheckDetails";
import { CheckTitle } from "@flanksource-ui/components/Canary/CanaryPopup/CheckTitle";
import { getUptimePercentage } from "@flanksource-ui/components/Canary/CanaryPopup/utils";
import {
  Duration,
  StatusList
} from "@flanksource-ui/components/Canary/renderers";
import { ConfigDetailsChanges } from "@flanksource-ui/components/Configs/Changes/ConfigDetailsChanges/ConfigDetailsChanges";
import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import { ConfigAnalysisLink } from "@flanksource-ui/components/Configs/Insights/ConfigAnalysisLink/ConfigAnalysisLink";
import { LogsTable } from "@flanksource-ui/components/Logs/Table/LogsTable";
import { TopologyCard } from "@flanksource-ui/components/Topology/TopologyCard";
import { Size, ViewType } from "@flanksource-ui/types";
import { Age } from "@flanksource-ui/ui/Age";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Modal } from "@flanksource-ui/ui/Modal";
import {
  sanitizeHTMLContent,
  toFixedIfNecessary
} from "@flanksource-ui/utils/common";
import mixins from "@flanksource-ui/utils/mixins.module.css";
import { ChevronRightIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import React, { ReactNode, useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { CommentEvidence } from "../../IncidentDetails/DefinitionOfDone/EvidenceView";

const ColumnSizes = {
  Time: {
    size: 64,
    maxSize: 64
  }
};

export function EvidenceItem({
  evidence,
  viewType = ViewType.summary
}: {
  evidence: Evidence;
  viewType?: ViewType;
}) {
  switch (evidence.type) {
    case EvidenceType.Log:
      return (
        <LogsTable
          viewOnly
          logs={evidence?.evidence?.lines}
          columnSizes={ColumnSizes}
        />
      );
    case EvidenceType.Topology:
      return (
        <div className="pt-2">
          <TopologyCard
            topologyId={evidence.component_id || evidence.evidence?.id}
            size={Size.large}
          />
        </div>
      );
    case EvidenceType.Config:
      return (
        <EvidenceAccordion
          date={evidence.created_at || ""}
          title={evidence.description!}
          configId={evidence.config_id!}
          configName={evidence.evidence?.configName}
        >
          <ConfigEvidenceView evidenceItem={evidence} />
        </EvidenceAccordion>
      );
    case EvidenceType.Check:
      return (
        <div className="pt-2">
          <HealthEvidenceViewer evidence={evidence} />
        </div>
      );
    case EvidenceType.Comment:
      return <CommentEvidence evidence={evidence} />;
    case EvidenceType.ConfigChange:
      return (
        <div className="pt-2">
          <ConfigChangeEvidence evidence={evidence} viewType={viewType} />
        </div>
      );
    case EvidenceType.ConfigAnalysis:
      return (
        <div className="pt-2">
          <ConfigAnalysisEvidence
            className="flex w-full flex-col rounded bg-white p-3 shadow shadow-card"
            evidence={evidence}
            viewType={viewType}
          />
        </div>
      );
    default:
      return null;
  }
}

const EvidenceAccordion: React.FC<{
  date: string | Date;
  title: string;
  configId: string;
  configName: string;
  children: React.ReactNode;
}> = ({ title, date, configId, configName, children, ...rest }) => {
  const { data: config } = useGetConfigByIdQuery(configId);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col border-b last:border-b-0" {...rest}>
      <div className="flex items-center justify-between">
        <button
          className="flex items-center py-2"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          <div className="mr-2">
            <ChevronRightIcon
              className={`h-5 w-5 transform ${expanded && "rotate-90"}`}
            />
          </div>
          <div className="flex w-full items-center justify-between">
            {title || <span className="text-gray-400">(no title)</span>}
            {date && (
              <div className="pl-2 text-gray-400">
                <Age from={date} />
              </div>
            )}
          </div>
        </button>
        <div>{config && <ConfigLink config={config} />}</div>
      </div>
      {expanded && children}
    </div>
  );
};

export function ConfigEvidenceView({
  evidenceItem
}: {
  evidenceItem: Pick<Evidence, "evidence">;
}) {
  const hunkLineGap = 3;
  const fullConfig = evidenceItem?.evidence?.lines || {};
  const selectedLines =
    Object.keys(evidenceItem?.evidence?.selected_lines) || [];
  const [hunks, setHunks] = useState<any[]>([]);

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
    <div className="overflow-y-hidden break-all">
      {evidenceItem ? (
        <div className="flex flex-col">
          {hunks.map(([hunkStart, hunkEnd], hunkIndex) => (
            <div key={`${hunkStart}-${hunkEnd}`}>
              <div className="mb-1 border last:mb-0">
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
                        <div className="flex w-8 select-none items-center justify-end border-r px-1 text-xs text-gray-600">
                          {lineIndex}
                        </div>
                        <code
                          className={`whitespace-pre-wrap px-2 text-xs ${
                            selected ? "text-gray-800" : "text-gray-600"
                          }`}
                        >
                          {line as ReactNode}
                        </code>
                      </div>
                    );
                  })}
              </div>
              {hunkIndex < hunks.length - 1 && (
                <DotsVerticalIcon className="mb-1 ml-2 h-4 w-4 text-gray-400" />
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

function createHunks(
  fullConfig: any,
  selectedLines: any,
  hunkLineGap: any
): any {
  const hunks: any[] = [];
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

type EvidenceSectionProps = {
  evidenceList: Evidence[];
  hypothesis: Hypothesis;
  titlePrepend?: React.ReactNode;
  onButtonClick?: () => void;
  onDeleteEvidence?: (evidenceId: string) => void;
  isLoading?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function EvidenceSection({
  evidenceList,
  hypothesis,
  titlePrepend,
  onButtonClick,
  onDeleteEvidence,
  isLoading,
  ...rest
}: EvidenceSectionProps) {
  return (
    <div className={rest.className} {...rest}>
      <div className="flex items-center justify-between">
        <div className="text-large flex align-baseline font-inter font-semibold">
          <h2 className="mr-2 text-gray-900">{titlePrepend}</h2>
        </div>
        <button
          type="button"
          onClick={onButtonClick}
          className="mb-1 inline-flex items-center rounded border border-transparent bg-blue-100 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Add evidence
        </button>
      </div>
      <div className="mt-2.5">
        {!isLoading ? (
          evidenceList && evidenceList.length > 0 ? (
            <div className="flex flex-col space-y-2 rounded-md border">
              {evidenceList.map((evidence) => (
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
            <div className="mt-2.5 flex justify-center rounded-8px border border-dashed border-gray-300 pt-8">
              <div className="mx-auto mb-6 flex flex-col">
                <div className="mx-auto">
                  <Icon name="database-plus" className="h-10 w-10" />
                </div>
                <p className="pt-2.5 text-sm font-medium leading-5">
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

export function HealthEvidenceViewer({
  evidence,
  size = "large"
}: {
  evidence: Evidence;
  size?: "large" | "small";
}) {
  const [check, setCheck] = useState<any>();
  const [validCheck, setValidCheck] = useState<any>();
  const [uptimeValue, setUptimeValue] = useState<number>();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const healthEvidence: any = evidence.evidence;
    const id = evidence.check_id || healthEvidence.check_id;
    const includeMessages = healthEvidence.includeMessages;
    const start = healthEvidence.start;
    fetchCheckDetails(id, start, includeMessages);
  }, [evidence]);

  useEffect(() => {
    if (!check) {
      return;
    }
    const uValue = toFixedIfNecessary(
      getUptimePercentage(check) as unknown as string,
      0
    );
    setUptimeValue(uValue);
    setValidCheck({
      ...check,
      checkStatuses: check.checkStatuses.slice(0, 1)
    });
  }, [check]);

  const fetchCheckDetails = (
    id: string,
    start: string,
    includeMessages: boolean
  ) => {
    const payload = {
      check: id,
      includeMessages,
      start
    };
    getCanaries(payload).then((results: any) => {
      if (results == null || results.data.checks.length === 0) {
        return;
      }
      setCheck(results.data.checks[0]);
    });
  };

  const evidenceDetailsView = () => {
    return (
      <div className="flex flex-1 flex-col overflow-x-auto align-middle">
        <div className="flex flex-1 flex-col overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <div className="flex flex-1 flex-col divide-y divide-gray-300 overflow-x-auto">
            <div
              className="flex max-w-full flex-1 cursor-pointer flex-row overflow-x-auto whitespace-nowrap text-sm font-medium text-gray-900"
              onClick={(e) => setShowModal(true)}
            >
              <div className="flex flex-1 flex-col px-2 py-2">
                <CheckTitle
                  className="inline-block"
                  check={check}
                  size="small"
                />
              </div>
              <div className="flex w-auto flex-col px-2 py-2">
                <div className="flex flex-row">
                  <label className="text-sm font-medium text-gray-700">
                    Health:
                    <span className="inline-block pl-2">
                      <StatusList checkStatuses={check.checkStatuses} />
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex w-auto flex-col px-2 py-2">
                <div className="flex flex-row">
                  <label className="text-sm font-medium text-gray-700">
                    Uptime:
                    <span className="inline-block pl-2">
                      {!Number.isNaN(uptimeValue)
                        ? `${toFixedIfNecessary(uptimeValue?.toString()!, 2)}%`
                        : "-"}
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex w-auto flex-col px-2 py-2">
                <div className="flex flex-row">
                  <label className="form-label">
                    Latency:
                    <span className="inline-block pl-2">
                      <Duration ms={check.latency.p99} />
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {validCheck?.checkStatuses?.[0]?.error && (
              <div className="whitespace-wrap flex px-2 py-2 text-sm font-medium text-gray-900">
                {validCheck.checkStatuses[0].error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-84 w-full bg-white">
      {check && evidenceDetailsView()}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={<CheckTitle check={check} />}
        size="medium"
        containerClassName="flex flex-col h-full overflow-y-auto"
        bodyClass="flex flex-col flex-1 overflow-y-auto"
      >
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <CheckDetails
            check={check}
            timeRange={evidence.evidence?.start}
            className={`flex flex-1 flex-col overflow-y-hidden px-4 ${mixins.appleScrollbar}`}
          />
        </div>
      </Modal>
    </div>
  );
}

export function ConfigChangeEvidence({
  evidence,
  className = "w-full bg-white rounded shadow-card card p-3",
  viewType
}: {
  evidence: Evidence;
  className?: string;
  viewType?: ViewType;
}) {
  return (
    <div className={className}>
      <ConfigDetailsChanges
        configId={evidence.config_id!}
        id={evidence.config_change_id!}
        viewType={viewType}
        showConfigLogo={true}
      />
    </div>
  );
}

export function ConfigAnalysisEvidence({
  evidence,
  viewType,
  className = "flex flex-col w-full bg-white"
}: {
  evidence: Evidence;
  className?: string;
  viewType?: ViewType;
}) {
  const { data: response } = useGetConfigInsight<ConfigAnalysis[]>(
    evidence.config_id!,
    evidence.config_analysis_id!
  );
  const [configAnalysis, setConfigAnalysis] = useState<ConfigAnalysis>();

  useEffect(() => {
    const analysis = response?.[0];
    if (!analysis) {
      return;
    }
    analysis.sanitizedMessageHTML = sanitizeHTMLContent(analysis.message);
    setConfigAnalysis(analysis);
  }, [response]);

  if (!configAnalysis) {
    return null;
  }

  return (
    <div className={className}>
      <ConfigAnalysisLink
        configAnalysis={configAnalysis}
        viewType={viewType}
        showConfigLogo={true}
      />
    </div>
  );
}
