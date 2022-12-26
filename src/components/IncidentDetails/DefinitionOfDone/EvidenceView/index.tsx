import clsx from "clsx";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useComponentNameQuery,
  useConfigNameQuery
} from "../../../../api/query-hooks";
import { Evidence, EvidenceType } from "../../../../api/services/evidence";
import { getCanaries } from "../../../../api/services/topology";
import { Size } from "../../../../types";
import { Badge } from "../../../Badge";
import { ConfigChangeEvidence } from "../../../Hypothesis/EvidenceSection";
import { ConfigAnalysisEvidence } from "../../../Hypothesis/EvidenceSection";
import { Icon } from "../../../Icon";
import { Loading } from "../../../Loading";
import { StatusStyles } from "../../../TopologyCard";
import { CardMetrics } from "../../../TopologyCard/CardMetrics";

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
  const { data: topology } = useComponentNameQuery(componentId, {
    enabled: !!componentId
  });

  const prepareTopologyLink = (topologyItem: { id: string }) => {
    return `/topology/${topologyItem.id}`;
  };

  if (topology == null) {
    return <Loading text={`Loading topology please wait...`} />;
  }

  const heading = filter(
    topology?.properties || [],
    (i: Record<string & "headline", string>) => i.headline
  );

  return (
    <div
      className={clsx(
        "bg-lightest-gray border-t-8",
        StatusStyles[topology.status as keyof typeof StatusStyles] ||
          "border-white",
        className
      )}
      {...rest}
    >
      <div className="flex flex-col -mt-1 bg-white divide-y divide-gray-200 w-full">
        <div className="flex pr-1 pt-2.5 pb-2.5 pl-2 overflow-hidden">
          <div className="text-gray-500 m-auto mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
            <h3 className="text-gray-500 leading-1.21rel">
              <Icon name={topology.icon} />
            </h3>
          </div>
          <div className="flex-1 m-auto overflow-hidden">
            <p
              className="text-gray-500 font-bold overflow-hidden truncate align-middle leading-1.21rel"
              title={topology.name}
            >
              <Link to={prepareTopologyLink(topology)}>
                {topology.text || topology.name}
              </Link>
            </p>
            {topology.description != null ||
              (topology.id != null && (
                <h3 className="text-gray-500 overflow-hidden truncate leading-1.21rel font-medium">
                  {topology.description || topology.id}
                </h3>
              ))}
          </div>
        </div>
        {Boolean(heading?.length) && false && (
          <div className="flex pl-1 pr-1.5 pb-3.5 pt-3">
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
  } = useComponentNameQuery(evidence?.component_id, {
    enabled: !!evidence?.component_id
  });

  if (isFetching || isRefetching) {
    return <Loading text={`Loading component please wait...`} />;
  }

  if (!comp || !evidence.component_id) {
    return null;
  }

  return (
    <div
      className={clsx(
        "overflow-hidden p-2 font-medium text-gray-500",
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
    return <Loading text={`Loading config please wait...`} />;
  }

  if (!config || !evidence.config_id) {
    return null;
  }

  return (
    <div className={clsx("overflow-hidden p-2", className)} {...rest}>
      <Icon
        name={config.external_type}
        secondary={config.config_type}
        size="lg"
      />{" "}
      <span className="pl-1 text-gray-500 font-medium"> {config.name} </span>{" "}
    </div>
  );
}

function HealthEvidence({
  evidence,
  size,
  className,
  ...rest
}: EvidenceViewProps) {
  const [check, setCheck] = useState<any>();

  useEffect(() => {
    const healthEvidence: any = evidence.evidence;
    const id = evidence.check_id || healthEvidence.check_id;
    const includeMessages = healthEvidence.includeMessages;
    const start = healthEvidence.start;
    fetchCheckDetails(id, start, includeMessages);
  }, [evidence]);

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

  return (
    <div className="overflow-hidden p-2" {...rest}>
      <div className={`flex flex-row`} {...rest}>
        <div className={clsx("flex-shrink-0", "pr-2")}>
          <Icon name={check?.icon || check?.type} />
        </div>
        <div className={clsx("overflow-hidden")}>
          <div className="flex flex-row">
            <span
              title={check?.name}
              className={clsx(
                "text-gray-500 font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden pr-4"
              )}
            >
              {check?.name}
            </span>{" "}
            <span
              className="inline-block float-right"
              title={`Namespace for ${check?.name}`}
              style={{ paddingTop: "1px" }}
            >
              <Badge text={check?.namespace} />
            </span>
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
      return <LogEvidence evidence={evidence} />;
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
          className="w-full bg-white rounded"
          evidence={evidence}
          viewType={size === Size.small ? "summary" : "detailed"}
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
    default:
      return null;
  }
}
