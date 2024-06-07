import { getTopology } from "@flanksource-ui/api/services/topology";
import { Topology } from "@flanksource-ui/api/types/topology";
import { Size } from "@flanksource-ui/types";
import { CustomScroll } from "@flanksource-ui/ui/CustomScroll";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import TopologyCardSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TopologyCardSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { MouseEventHandler, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import AgentName from "../../Agents/AgentName";
import { HealthChecksSummary } from "../../Canary/HealthChecksSummary";
import { HealthSummary } from "../../Canary/HealthSummary";
import IncidentCardSummary from "../../Incidents/IncidentCardSummary";
import { CardMetrics } from "./CardMetrics";
import { PropertyDisplay } from "./Property";
import { TopologyConfigAnalysisLine } from "./TopologyConfigAnalysisLine";
import { TopologyDropdownMenu } from "./TopologyDropdownMenu";

export enum ComponentStatus {
  unhealthy = "unhealthy",
  warning = "warning"
}

export const CardWidth: Record<keyof typeof Size, string> = {
  [Size.small]: "198px",
  [Size.medium]: "258px",
  [Size.large]: "356px",
  [Size.extra_large]: "554px"
};

export const StatusStyles: Record<keyof typeof ComponentStatus, string> = {
  [ComponentStatus.unhealthy]: "border-red-300",
  [ComponentStatus.warning]: "border-orange-300"
} as const;

interface IProps {
  size?: Size | string;
  topologyId?: string;
  topology?: Topology;
  selectionMode?: boolean;
  hideMenu?: boolean;
  // where to open new links
  target?: string;
  selected?: boolean;
  onSelectionChange?: MouseEventHandler<HTMLDivElement>;
  menuPosition?: "fixed" | "absolute";
}

export function TopologyCard({
  size,
  topology: topologyData,
  topologyId,
  selectionMode,
  target = "",
  hideMenu,
  selected,
  onSelectionChange,
  menuPosition = "fixed"
}: IProps) {
  const [searchParams] = useSearchParams();
  const { id: parentId } = useParams();

  const { data } = useQuery({
    queryKey: ["topology", topologyId],
    queryFn: () => getTopology({ id: topologyId }),
    enabled: !!topologyId && topologyData == null
  });

  const topology = useMemo(() => {
    return topologyData || data?.components?.[0];
  }, [data, topologyData]);

  let selectionModeRootProps = null;

  if (selectionMode) {
    selectionModeRootProps = {
      role: "button",
      onClick: onSelectionChange
    };
  }

  const metricsInFooter = useMemo(
    () => size === Size.small || size === Size.medium,
    [size]
  );

  const canShowChildHealth = () => {
    let totalCount = 0;
    if (topology?.summary?.checks) {
      topology.summary.checks.healthy = topology.summary.checks.healthy || 0;
      topology.summary.checks.unhealthy =
        topology.summary.checks.unhealthy || 0;
      topology.summary.checks.warning = topology.summary.checks.warning || 0;
      Object.keys(topology.summary.checks).forEach((key) => {
        totalCount +=
          topology.summary?.checks?.[key as keyof Topology["summary"]] || 0;
      });
    }
    return (
      !topology?.components?.length &&
      (!topology?.is_leaf || (topology.is_leaf && totalCount !== 1))
    );
  };

  const prepareTopologyLink = (topologyItem: Topology) => {
    if (topologyItem.id === parentId && parentId) {
      return "";
    }

    const params = Object.fromEntries(searchParams.entries());
    delete params.refererId;
    delete params.status;
    const queryString = Object.entries(params)
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join("&");

    const parentIdAsPerPath = (topologyItem.path || "").split(".").pop();
    return `/topology/${topologyItem.id}?${queryString}${
      parentId && parentIdAsPerPath !== parentId && parentId !== topologyItem.id
        ? `&refererId=${parentId}`
        : ""
    }`;
  };

  const sortedTopologyComponents = useMemo(
    () =>
      topology?.components?.sort((a, b) => {
        // we want to move unhealthy components to the top, then warning, then healthy
        if (a.status === "unhealthy" && b.status !== "unhealthy") {
          return -1;
        }
        if (a.status === "warning" && b.status === "healthy") {
          return -1;
        }
        if (a.status === "healthy" && b.status !== "healthy") {
          return 1;
        }
        return 0;
      }),
    [topology?.components]
  );

  if (topology == null) {
    return <TopologyCardSkeletonLoader />;
  }

  const allProperties = topology.properties || [];
  const properties = allProperties.filter((i) => !i.headline);

  const heading = allProperties.filter(
    (i) => i.headline && (!!i.value || !!i.text || !!i.url)
  );

  return (
    <div
      style={{ width: CardWidth[size as Size] || size }}
      className={clsx(
        "rounded-8px mb-3 mr-3 shadow-card card bg-lightest-gray border-0 border-t-8 relative",
        StatusStyles[topology.status as ComponentStatus] || "border-white",
        selectionMode ? "cursor-pointer" : ""
      )}
      {...selectionModeRootProps}
    >
      <div className="flex flex-row -mt-1 bg-white border-b flex-nowrap rounded-t-md">
        <div className="flex flex-1 gap-2 pr-1 pt-2.5 pb-3.5 pl-2 overflow-hidden">
          <div className="text-gray-color m-auto mr-1.5 flex-initial max-w-1/4 leading-1.21rel">
            <h3 className="text-gray-color text-2xsi leading-1.21rel">
              <Icon name={topology.icon} className="h-6 w-auto" />
            </h3>
          </div>
          <div className="flex flex-col flex-1 m-auto overflow-hidden">
            <div
              className="font-bold overflow-hidden truncate text-ellipsis align-middle text-15pxinrem leading-1.21rel"
              title={topology.name}
            >
              {prepareTopologyLink(topology) && (
                <Link to={prepareTopologyLink(topology)}>
                  {topology.text || topology.name}
                </Link>
              )}
              {!prepareTopologyLink(topology) &&
                (topology.text || topology.name)}
            </div>
            <div className="flex flex-row items-center gap-1.5 text-gray-500">
              <AgentName agentId={topology.agent_id} />
              {topology.status_reason && (
                <div
                  title={topology.status_reason}
                  className="text-sm text-gray-400 flex-1 text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  {topology.status_reason}
                </div>
              )}
            </div>
          </div>
        </div>

        {!metricsInFooter && (
          <div className="flex ml-auto pl-1 pr-1.5 pb-3.5 pt-3">
            <CardMetrics items={heading} row={size === Size.extra_large} />
          </div>
        )}

        <div className="flex ml-auto pl-1 pr-1.5 pb-3.5 pt-3">
          {selectionMode && (
            <div className="pr-1.5 pt-1 flex min-w-7 justify-end items-start">
              <input
                type="checkbox"
                className="w-4 h-4 outline-none text-dark-blue rounded-4px focus:outline-none"
                checked={selected}
                readOnly
              />
            </div>
          )}

          {!selectionMode && !hideMenu && (
            <TopologyDropdownMenu topology={topology} position={menuPosition} />
          )}
        </div>
      </div>
      <div className="flex flex-nowrap bg-lightest-gray rounded-b-8px space-x-4">
        {metricsInFooter ? (
          <div className="flex flex-1 py-4">
            <CardMetrics items={heading} />
          </div>
        ) : (
          <>
            {Boolean(properties.length) && (
              <CustomScroll
                className="flex-1 py-2 pl-2"
                showMoreClass="text-xs linear-1.21rel mr-1 cursor-pointer"
                maxHeight="200px"
                minChildCount={6}
              >
                {properties.map((property, index) => (
                  <PropertyDisplay
                    key={index}
                    property={property}
                    className={
                      index === topology.properties!.length - 1
                        ? "mb-0"
                        : "mb-1.5"
                    }
                  />
                ))}
              </CustomScroll>
            )}
            <CustomScroll
              className="flex-1 py-2 pl-2 pr-2 space-y-1.5"
              showMoreClass="text-xs linear-1.21rel mr-1 cursor-pointer"
              maxHeight="200px"
              minChildCount={5}
            >
              <TopologyConfigAnalysisLine topology={topology} />
              {canShowChildHealth() && (
                <HealthSummary
                  className=""
                  target={target}
                  key={topology.id}
                  component={topology}
                />
              )}
              <HealthChecksSummary
                checks={topology?.summary?.checks}
                className=""
              />
              {topology?.id && <IncidentCardSummary topology={topology} />}
              {sortedTopologyComponents?.map((component: any) => (
                <HealthSummary
                  className=""
                  target={target}
                  key={component.id}
                  component={component}
                />
              ))}
            </CustomScroll>
          </>
        )}
      </div>
    </div>
  );
}
