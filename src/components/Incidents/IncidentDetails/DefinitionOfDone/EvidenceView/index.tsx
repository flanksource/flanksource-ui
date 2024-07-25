import {
  useComponentNameQuery,
  useConfigNameQuery,
  useTopologyQuery
} from "@flanksource-ui/api/query-hooks";
import { getCanaries } from "@flanksource-ui/api/services/topology";
import { Evidence, EvidenceType } from "@flanksource-ui/api/types/evidence";
import { Size, ViewType } from "@flanksource-ui/types";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo } from "react";
import { BsFillCircleFill, BsPersonFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ConfigIcon } from "../../../../../ui/Icons/ConfigIcon";
import { Icon } from "../../../../../ui/Icons/Icon";
import { StatusStyles } from "../../../../Topology/TopologyCard";
import { CardMetrics } from "../../../../Topology/TopologyCard/CardMetrics";
import {
  ConfigAnalysisEvidence,
  ConfigChangeEvidence
} from "../../../Hypothesis/EvidenceSection";

type EvidenceViewProps = Omit<React.HTMLProps<HTMLDivElement>, "size"> & {
  evidence: Evidence;
  size?: Size;
};

function TopologyEvidence({
  evidence,
  size,
  className,
  ...rest
}: EvidenceViewProps) {
  const componentId = evidence?.component_id || evidence?.evidence?.id;

  const { data: topology } = useTopologyQuery(componentId);

  const prepareTopologyLink = (topologyItem: { id: string }) => {
    return `/topology/${topologyItem.id}`;
  };

  if (topology == null) {
    return <TextSkeletonLoader className="w-full" />;
  }

  const heading = (topology?.properties || []).filter((i) => i.headline);

  return (
    <div
      className={clsx(
        "border-t-8 bg-lightest-gray",
        StatusStyles[topology.status as keyof typeof StatusStyles] ||
          "border-white",
        className
      )}
      {...rest}
    >
      <div className="-mt-1 flex w-full flex-col divide-y divide-gray-200 bg-white">
        <div className="flex overflow-hidden pb-2.5 pr-1 pt-2.5">
          <div className="m-auto mr-2.5 max-w-1/4 flex-initial leading-1.21rel text-gray-500">
            <h3 className="leading-1.21rel text-gray-500">
              <Icon name={topology.icon} />
            </h3>
          </div>
          <div className="m-auto flex-1 overflow-hidden">
            <p
              className="overflow-hidden truncate align-middle font-bold leading-1.21rel text-gray-500"
              title={topology.name}
            >
              <Link to={prepareTopologyLink(topology)}>
                {topology.text || topology.name}
              </Link>
            </p>
            {(topology as any).description != null ||
              (topology.id != null && (
                <h3 className="overflow-hidden truncate font-medium leading-1.21rel text-gray-500">
                  {(topology as any).description || topology.id}
                </h3>
              ))}
          </div>
        </div>
        {heading?.length > 0 && false && (
          <div className="flex pb-3.5 pl-1 pr-1.5 pt-3">
            <CardMetrics items={heading} row={false} />
          </div>
        )}
      </div>
    </div>
  );
}

function LogEvidence({
  evidence,
  size,
  className,
  ...rest
}: EvidenceViewProps) {
  const {
    data: comp,
    isFetching,
    isRefetching
  } = useComponentNameQuery(evidence?.component_id);

  if (isFetching || isRefetching) {
    return <TextSkeletonLoader className="w-full" />;
  }

  if (!comp || !evidence.component_id) {
    return null;
  }

  return (
    <div
      className={clsx(
        "overflow-hidden py-2 font-medium text-gray-500",
        className
      )}
      {...rest}
    >
      <span>
        <Icon name={comp.icon} /> {comp.name}
      </span>
    </div>
  );
}

function ConfigEvidence({
  evidence,
  size,
  className,
  ...rest
}: EvidenceViewProps) {
  const {
    data: config,
    isFetching,
    isRefetching
  } = useConfigNameQuery(evidence?.config_id, {
    enabeld: !!evidence?.config_id
  });

  if (isFetching || isRefetching) {
    return <TextSkeletonLoader className="w-full" />;
  }

  if (!config || !evidence.config_id) {
    return null;
  }

  return (
    <div className={clsx("overflow-hidden py-2", className)} {...rest}>
      <ConfigIcon config={config} />
      <span className="pl-1 font-medium text-gray-500">
        {" "}
        {config.name}{" "}
      </span>{" "}
    </div>
  );
}

function HealthEvidence({
  evidence,
  size,
  className,
  ...rest
}: EvidenceViewProps) {
  const healthEvidence = evidence.evidence;
  const id = evidence.check_id || healthEvidence?.check_id;
  const includeMessages = healthEvidence?.includeMessages;
  const start = healthEvidence?.start;

  const payload = useMemo(
    () => ({
      check: id,
      includeMessages,
      start
    }),
    [id, includeMessages, start]
  );

  const { data: check } = useQuery(
    ["check", payload],
    () => {
      return getCanaries(payload);
    },
    {
      select: (results) => {
        if (results.data === null || results.data?.checks.length === 0) {
          return;
        }
        return results.data.checks[0];
      }
    }
  );

  const isHealthCheckHealth = check?.status === "healthy";

  return (
    <div className="overflow-hidden py-2" {...rest}>
      <div className={`flex flex-row items-center gap-1`} {...rest}>
        <div className={clsx("flex-shrink-0", "pr-2")}>
          <Icon name={check?.icon || check?.type} />
        </div>
        <div className="flex flex-1 flex-row overflow-hidden">
          <span
            title={check?.name}
            className={clsx(
              "overflow-hidden overflow-ellipsis whitespace-nowrap pr-4 font-semibold text-gray-500"
            )}
          >
            {check?.name}
          </span>
          <span
            className="float-right inline-block"
            title={`Namespace for ${check?.name}`}
            style={{ paddingTop: "1px" }}
          >
            <Badge text={check?.namespace} />
          </span>
        </div>

        <div className="block px-2">
          <BsFillCircleFill
            className={clsx(
              isHealthCheckHealth ? "text-green-500" : "text-red-500"
            )}
            size={10}
          />
        </div>
      </div>
    </div>
  );
}

export function CommentEvidence({
  evidence,
  size,
  className,
  ...rest
}: EvidenceViewProps) {
  return (
    <div className="overflow-hidden py-2" {...rest}>
      <div className={`flex flex-row items-center`} {...rest}>
        <div className="flex flex-row">
          <div className={clsx("flex-shrink-0", "pr-2")}>
            <BsPersonFill size={22} />
          </div>
          <div className={clsx("overflow-hidden")}>
            {evidence.evidence?.comment}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EvidenceView({
  evidence,
  size,
  className,
  ...rest
}: EvidenceViewProps) {
  switch (evidence.type) {
    case EvidenceType.Log:
      return <LogEvidence evidence={evidence} {...rest} />;
    case EvidenceType.Topology:
      return (
        <TopologyEvidence className={className} evidence={evidence} {...rest} />
      );
    case EvidenceType.Config:
      return (
        <ConfigEvidence className={className} evidence={evidence} {...rest} />
      );
    case EvidenceType.Check:
      return (
        <HealthEvidence className={className} evidence={evidence} {...rest} />
      );
    case EvidenceType.ConfigChange:
      return (
        <ConfigChangeEvidence
          className="w-full rounded bg-white"
          evidence={evidence}
          viewType={size === Size.small ? ViewType.summary : ViewType.detailed}
        />
      );
    case EvidenceType.ConfigAnalysis:
      return (
        <ConfigAnalysisEvidence
          className={className}
          evidence={evidence}
          {...rest}
        />
      );
    case EvidenceType.Comment:
      return (
        <CommentEvidence className={className} evidence={evidence} {...rest} />
      );
    default:
      return null;
  }
}
