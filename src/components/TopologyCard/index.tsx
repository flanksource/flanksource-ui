import clsx from "clsx";
import { filter } from "lodash";
import { useEffect, useState, useMemo, MouseEventHandler } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getTopology } from "../../api/services/topology";
import { Size } from "../../types";
import { CustomScroll } from "../CustomScroll";
import { HealthSummary } from "../HealthSummary";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { HealthChecksSummary } from "../HealthChecksSummary";
import TopologyCardIncidentSummary from "../TopologyCardIncidentSummary";
import { CardMetrics } from "./CardMetrics";
import { Property } from "./Property";
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
};

interface IProps {
  size: Size;
  topologyId?: string;
  topology?: any;
  selectionMode?: boolean;
  selected?: boolean;
  onSelectionChange?: MouseEventHandler<HTMLDivElement>;
}

export function TopologyCard({
  size,
  topology: topologyData,
  topologyId,
  selectionMode,
  selected,
  onSelectionChange
}: IProps) {
  const [topology, setTopology] = useState(topologyData);
  const [searchParams] = useSearchParams();
  const { id: parentId } = useParams();

  useEffect(() => {
    if (topologyId != null && topologyData == null) {
      getTopology({ id: topologyId }).then(({ data }) => setTopology(data[0]));
    }
  }, [topologyId, topologyData]);

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
    if (topology?.summary) {
      topology.summary.healthy = topology.summary.healthy || 0;
      topology.summary.unhealthy = topology.summary.unhealthy || 0;
      topology.summary.warning = topology.summary.warning || 0;
      Object.keys(topology.summary).forEach((key) => {
        totalCount += topology.summary[key];
      });
    }
    return (
      !topology?.components?.length &&
      (!topology?.is_leaf || (topology.is_leaf && totalCount !== 1))
    );
  };

  const prepareTopologyLink = (topologyItem: {
    id: string;
    parent_id: string;
    path: string;
  }) => {
    if (topologyItem.id === parentId && parentId) {
      return null;
    }

    if (searchParams.get("refererId")) {
      searchParams.delete("refererId");
    }
    const parentIdAsPerPath = (topologyItem.path || "").split(".").pop();
    return `/topology/${topologyItem.id}?${searchParams.toString()}${
      parentId && parentIdAsPerPath !== parentId && parentId !== topologyItem.id
        ? `&refererId=${parentId}`
        : ""
    }`;
  };

  if (topology == null) {
    return <Loading text={`Loading ${topologyId}`} />;
  }

  topology.properties = topology.properties || [];
  const properties = filter(topology.properties, (i) => !i.headline);
  const heading = filter(topology.properties, (i) => i.headline);

  return (
    <div
      style={{ width: CardWidth[size] || size }}
      className={clsx(
        "rounded-8px mb-3 mr-3 shadow-card card bg-lightest-gray border-0 border-t-8 relative",
        StatusStyles[topology.status as ComponentStatus] || "border-white",
        selectionMode ? "cursor-pointer" : ""
      )}
      {...selectionModeRootProps}
    >
      <div className="flex flex-row -mt-1 bg-white border-b flex-nowrap rounded-t-md">
        <div className="flex pr-1 pt-2.5 pb-3.5 pl-2 overflow-hidden">
          <div className="text-gray-color m-auto mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
            <h3 className="text-gray-color text-2xsi leading-1.21rel">
              <Icon name={topology.icon} size="2xl" />
            </h3>
          </div>
          <div className="flex-1 m-auto overflow-hidden">
            <p
              className="font-bold overflow-hidden truncate align-middle text-15pxinrem leading-1.21rel"
              title={topology.name}
            >
              {prepareTopologyLink(topology) && (
                <Link to={prepareTopologyLink(topology)}>
                  {topology.text || topology.name}
                </Link>
              )}
              {!prepareTopologyLink(topology) &&
                (topology.text || topology.name)}
            </p>
            {topology.description != null ||
              (topology.id != null && (
                <h3 className="text-gray-color overflow-hidden truncate text-2xsi leading-1.21rel font-medium">
                  {topology.description || topology.id}
                </h3>
              ))}
          </div>
        </div>

        {!metricsInFooter && (
          <div className="flex ml-auto pl-1 pr-1.5 pb-3.5 pt-3">
            <CardMetrics items={heading} row={size === Size.extra_large} />
          </div>
        )}

        <div className="flex ml-auto pl-1 pr-1.5 pb-3.5 pt-3">
          {selectionMode ? (
            <div className="pr-1.5 pt-1 flex min-w-7 justify-end items-start">
              <input
                type="checkbox"
                className="w-4 h-4 outline-none text-dark-blue rounded-4px focus:outline-none"
                checked={selected}
                readOnly
              />
            </div>
          ) : (
            <TopologyDropdownMenu topology={topology} />
          )}
        </div>
      </div>
      <div className="flex flex-nowrap bg-lightest-gray rounded-b-8px">
        {metricsInFooter ? (
          <div className="flex flex-1 py-4">
            <CardMetrics items={heading} />
          </div>
        ) : (
          <>
            {Boolean(properties.length) && (
              <CustomScroll
                className="flex-1 py-4 pl-2"
                showMoreClass="text-xs linear-1.21rel mr-1 cursor-pointer"
                maxHeight="200px"
                minChildCount={6}
              >
                {properties.map((property, index) => (
                  <Property
                    key={index}
                    property={property}
                    className={
                      index === topology.properties.length - 1
                        ? "mb-0"
                        : "mb-2.5"
                    }
                  />
                ))}
              </CustomScroll>
            )}
            <CustomScroll
              className="flex-1 py-4 pl-2 pr-2"
              showMoreClass="text-xs linear-1.21rel mr-1 cursor-pointer"
              maxHeight="200px"
              minChildCount={5}
            >
              {canShowChildHealth() && (
                <HealthSummary
                  className="mb-2"
                  key={topology.id}
                  component={topology}
                />
              )}
              <HealthChecksSummary checks={topology?.checks} />
              {topology?.id && (
                <TopologyCardIncidentSummary topologyID={topology.id} />
              )}
              {topology?.components?.map((component: any) => (
                <HealthSummary
                  className="mb-2"
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
