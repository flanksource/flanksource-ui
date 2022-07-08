import clsx from "clsx";
import { filter } from "lodash";
import { useEffect, useState, useMemo, MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { getTopologyWithoutUnroll } from "../../api/services/topology";
import { HealthSummary } from "../HealthSummary";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { CardMetrics } from "./CardMetrics";
import { Property } from "./Property";
import { TopologyDropdownMenu } from "./TopologyDropdownMenu";

export enum CardSize {
  small = "small",
  medium = "medium",
  large = "large",
  extra_large = "extra_large"
}

enum ComponentStatus {
  unhealthy = "unhealthy",
  warning = "warning"
}

const CardWidth: { [k: keyof typeof CardSize]: string } = {
  [CardSize.small]: "198px",
  [CardSize.medium]: "258px",
  [CardSize.large]: "356px",
  [CardSize.extra_large]: "554px"
};

const StatusStyles: { [k: keyof typeof ComponentStatus]: string } = {
  [ComponentStatus.unhealthy]: "border-red-300",
  [ComponentStatus.warning]: "border-orange-300"
};

const CARD_SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  EXTRA_LARGE: "extra-large"
};

interface IProps {
  size: CardSize;
  topologyId: string;
  topology: any;
  selectionMode: boolean;
  depth: number;
  selected: boolean;
  onSelectionChange: MouseEventHandler<HTMLDivElement>;
}

export function TopologyCard({
  size,
  topology: topologyData,
  topologyId,
  selectionMode,
  depth,
  selected,
  onSelectionChange
}: IProps) {
  const [topology, setTopology] = useState(topologyData);

  useEffect(() => {
    if (topologyId != null && topologyData == null) {
      getTopologyWithoutUnroll({ id: topologyId, depth }).then((topology) => {
        setTopology(topology.data[0]);
      });
    }
  }, [topologyId, topologyData, depth]);

  let selectionModeRootProps = null;

  if (selectionMode) {
    selectionModeRootProps = {
      role: "button",
      onClick: onSelectionChange
    };
  }

  const metricsInFooter = useMemo(
    () => size === CardSize.small || size === CardSize.medium,
    [size]
  );

  const prepareTopologyLink = (topologyItem: { id: string }) => {
    return `/topology/${topologyItem.id}`;
  };

  if (topology == null) {
    return <Loading text={`Loading ${topologyId}`} />;
  }

  topology.properties = topology.properties || [];
  const properties = filter(topology.properties, (i) => !i.headline);
  const heading = filter(topology.properties, (i) => i.headline);

  return (
    <div
      style={{ width: CardWidth[size] }}
      className={clsx(
        "rounded-8px mb-3 mr-3 shadow-card card bg-lightest-gray border-0 border-t-8",
        StatusStyles[topology.status] || "border-white",
        selectionMode ? "cursor-pointer" : ""
      )}
      {...selectionModeRootProps}
    >
      <div className="flex flex-row flex-nowrap bg-white -mt-1 rounded-t-md border-b">
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
              <Link to={prepareTopologyLink(topology)}>
                {topology.text || topology.name}
              </Link>
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
            <CardMetrics items={heading} row={size === CardSize.extra_large} />
          </div>
        )}

        <div className="flex ml-auto pl-1 pr-1.5 pb-3.5 pt-3">
          {selectionMode ? (
            <div className="pr-1.5 pt-1 flex min-w-7 justify-end items-start">
              <input
                type="checkbox"
                className="h-4 w-4 text-dark-blue outline-none rounded-4px focus:outline-none"
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
          <div className="flex py-4 flex-1">
            <CardMetrics items={heading} />
          </div>
        ) : (
          <>
            {Boolean(properties.length) && (
              <div className="py-4 pl-5 pr-1 overflow-y-auto max-h-36">
                {properties.map((property, index) => (
                  <Property
                    key={property.name}
                    property={property}
                    className={
                      index === topology.properties.length - 1
                        ? "mb-0"
                        : "mb-2.5"
                    }
                  />
                ))}
              </div>
            )}
            <div className="pl-2 py-4 pr-5 overflow-y-auto max-h-36 space-y-0 last:mb-2.5">
              {topology.components ? (
                topology.components.map((component: any) => (
                  <HealthSummary key={component.id} component={component} />
                ))
              ) : (
                <HealthSummary component={topology} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
