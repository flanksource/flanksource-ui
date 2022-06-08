import clsx from "clsx";
import { filter } from "lodash";
import { useMemo } from "react";
import { HealthSummary } from "../HealthSummary";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import "./index.css";
import { Metrics } from "./metrics";
import { Property } from "./property";
import { TopologyDropdownMenu } from "./topology-menu";

const CARD_SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  EXTRA_LARGE: "extra-large"
};

export function TopologyCard({
  size,
  topology,
  topologyId,
  selectionMode,
  selected,
  onSelectionChange,
  exploreTopology
}) {
  let selectionModeRootProps = null;

  if (selectionMode) {
    selectionModeRootProps = {
      role: "button",
      onClick: (state, event) => {
        onSelectionChange(state, event);
      }
    };
  }

  const metricsInFooter = useMemo(
    () => size === CARD_SIZE.SMALL || size === CARD_SIZE.MEDIUM,
    [size]
  );

  if (topology == null) {
    return <Loading text={`Loading ${topologyId}`} />;
  }

  topology.properties = topology.properties || [];
  const properties = filter(topology.properties, (i) => !i.headline);
  const heading = filter(topology.properties, (i) => i.headline);

  return (
    <div
      className={clsx(
        "rounded-8px mb-3 mr-3 shadow-card card topology-card bg-lightest-gray",
        topology.status,
        selectionMode ? "cursor-pointer" : "",
        `topology-card-${size}`
      )}
      {...selectionModeRootProps}
    >
      <div className="flex flex-row flex-nowrap topology-card-header rounded-t-8px bg-white">
        <div className="flex pr-1 pt-2.5 pb-3.5 pl-5 overflow-hidden">
          <div className="text-gray-color m-auto mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
            <h3 className="text-gray-color text-2xsi leading-1.21rel">
              <Icon name={topology.icon} size="2xl" />
            </h3>
          </div>
          <div className="flex-1 m-auto overflow-hidden">
            <div
              className="font-bold overflow-hidden truncate align-middle text-15pxinrem leading-1.21rel cursor-pointer"
              title={topology.name}
              onClick={(e) => exploreTopology(topology)}
            >
              {topology.text || topology.name}
            </div>
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
            <Metrics items={heading} row={size === CARD_SIZE.EXTRA_LARGE} />
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
            <Metrics items={heading} />
          </div>
        ) : (
          <>
            {properties.length > 0 && (
              <div className="w-med-card-left py-4 pl-5 pr-1 overflow-auto">
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
            <div className="w-med-card-right pl-1 py-4 pr-5 overflow-y-auto">
              {topology.components &&
                topology.components.map((component, index) => (
                  <div
                    className={
                      index === topology.components.length - 1
                        ? "mb-0"
                        : "mb-2.5"
                    }
                    key={component.id}
                  >
                    <HealthSummary
                      component={component}
                      exploreTopology={exploreTopology}
                    />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
