import { getTopology } from "@flanksource-ui/api/services/topology";
import { Topology } from "@flanksource-ui/api/types/topology";
import { Size } from "@flanksource-ui/types";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import TopologyCardSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TopologyCardSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { MouseEventHandler, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import AgentName from "../../Agents/AgentName";
import { useTopologyHidePropertiesPreference } from "../TopologyPopover/TopologyHideProperties";
import { CardMetrics } from "./CardMetrics";
import TopologyCardPropertiesColumn from "./TopologyCardPropertiesColumn";
import TopologyCardStatuses from "./TopologyCardStatuses";
import { TopologyDropdownMenu } from "./TopologyDropdownMenu";
import TopologyItemHealthSummary from "./TopologyItemHealthSummary";

export enum ComponentHealth {
  unhealthy = "unhealthy",
  warning = "warning"
}

export const CardWidth: Record<keyof typeof Size, string> = {
  [Size.small]: "198px",
  [Size.medium]: "258px",
  [Size.large]: "356px",
  [Size.extra_large]: "554px"
};

export const StatusStyles: Record<keyof typeof ComponentHealth, string> = {
  [ComponentHealth.unhealthy]: "border-red-300",
  [ComponentHealth.warning]: "border-orange-300"
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
  const [hideTopologyProperties] = useTopologyHidePropertiesPreference();

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

  const topologyLink = useMemo(() => {
    if (!topology) {
      return undefined;
    }
    if (topology.id === parentId && parentId) {
      return undefined;
    }
    const params = Object.fromEntries(searchParams.entries());
    delete params.refererId;
    delete params.status;
    const queryString = Object.entries(params)
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join("&");

    const parentIdAsPerPath = (topology.path || "").split(".").pop();
    return `/topology/${topology.id}?${queryString}${
      parentId && parentIdAsPerPath !== parentId && parentId !== topology.id
        ? `&refererId=${parentId}`
        : ""
    }`;
  }, [parentId, searchParams, topology]);

  const { heading, properties, isPropertiesPanelEmpty } = useMemo(() => {
    const allProperties = topology?.properties || [];
    const properties = allProperties.filter((i) => !i.headline);

    const heading = allProperties.filter(
      (i) => i.headline && (!!i.value || !!i.text || !!i.url)
    );

    const isPropertiesPanelShown =
      properties.filter(
        // we don't want to show properties that are hidden or have no value or
        // text
        (i) => !i.headline && i.type !== "hidden" && (i.text || i.value)
      ).length > 0;

    return {
      heading,
      properties,
      isPropertiesPanelEmpty: !isPropertiesPanelShown
    };
  }, [topology?.properties]);

  const isAnalyticsPanelEmpty = useMemo(() => {
    // if there are no insights, checks or components, we don't need to show the
    // second panel at all
    return (
      !topology?.summary?.insights &&
      !topology?.summary?.checks &&
      !(
        (topology?.components ?? []).filter((i) => {
          return (
            !isEmpty(i.summary) ||
            !isEmpty(i.summary?.checks) ||
            !isEmpty(i.summary?.insights)
          );
        }).length > 0
      )
    );
  }, [
    topology?.components,
    topology?.summary?.checks,
    topology?.summary?.insights
  ]);

  const isFooterEmpty = useMemo(() => {
    if (metricsInFooter && heading.length > 0) {
      return false;
    }
    if (
      isAnalyticsPanelEmpty &&
      // if there are no properties to show, we don't need to show the second
      // panel and if the properties panel is hidden, we don't need to show the
      // footer panel
      (isPropertiesPanelEmpty || hideTopologyProperties)
    ) {
      return true;
    }
    return false;
  }, [
    heading.length,
    hideTopologyProperties,
    isAnalyticsPanelEmpty,
    isPropertiesPanelEmpty,
    metricsInFooter
  ]);

  if (topology == null) {
    return <TopologyCardSkeletonLoader />;
  }

  return (
    <div
      style={{ width: CardWidth[size as Size] || size }}
      className={clsx(
        "card relative mb-3 mr-3 rounded-8px border-0 border-t-8 bg-lightest-gray shadow-card",
        StatusStyles[topology.health as ComponentHealth] || "border-white",
        selectionMode ? "cursor-pointer" : ""
      )}
      {...selectionModeRootProps}
    >
      <div
        className={clsx(
          "-mt-1 flex flex-row flex-nowrap rounded-t-md border-b bg-white",
          isFooterEmpty ? "rounded-b-md" : ""
        )}
      >
        <div className="flex flex-1 gap-2 overflow-hidden pb-3.5 pl-2 pr-1 pt-2.5">
          <div className="m-auto mr-1.5 max-w-1/4 flex-initial leading-1.21rel text-gray-color">
            <h3 className="text-2xsi leading-1.21rel text-gray-color">
              <Icon name={topology.icon} className="h-6 w-auto" />
            </h3>
          </div>
          <div className="m-auto flex flex-1 flex-col overflow-hidden">
            <div
              role="heading"
              aria-level={2}
              className="overflow-hidden truncate text-ellipsis align-middle text-15pxinrem font-bold leading-1.21rel"
              title={topology.name}
            >
              {topologyLink ? (
                <Link to={topologyLink}>{topology.text || topology.name}</Link>
              ) : (
                topology.text || topology.name
              )}
            </div>
            <div className="flex flex-row items-center gap-1.5 text-gray-500">
              <AgentName agentId={topology.agent_id} />
              {topology.status_reason && (
                <div
                  title={topology.status_reason}
                  className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-400"
                >
                  {topology.status_reason}
                </div>
              )}
              <TopologyItemHealthSummary topology={topology} />
            </div>
          </div>
        </div>

        {!metricsInFooter && (
          <div className="ml-auto flex pb-3.5 pl-1 pr-1.5 pt-3">
            <CardMetrics items={heading} row={size === Size.extra_large} />
          </div>
        )}

        <div className="ml-auto flex pb-3.5 pl-1 pr-1.5 pt-3">
          {selectionMode && (
            <div className="flex min-w-7 items-start justify-end pr-1.5 pt-1">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-4px text-dark-blue outline-none focus:outline-none"
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
      {!isFooterEmpty && (
        <div className="flex flex-nowrap space-x-4 rounded-b-8px bg-lightest-gray py-1">
          {metricsInFooter && heading.length > 0 ? (
            <div className="flex flex-1 py-4">
              <CardMetrics items={heading} />
            </div>
          ) : (
            <>
              {!isPropertiesPanelEmpty && (
                <TopologyCardPropertiesColumn
                  displayTwoColumns={isAnalyticsPanelEmpty}
                  properties={properties}
                />
              )}
              <TopologyCardStatuses
                topology={topology}
                isPropertiesPanelEmpty={isPropertiesPanelEmpty}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
