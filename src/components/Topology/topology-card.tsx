import clsx from "clsx";
import { filter } from "lodash";
import { useEffect, useState, useMemo, MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { getTopologyWithoutUnroll } from "../../api/services/topology";
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

interface IProps {
  size: "small" | "medium" | "large" | "extra-large";
  topologyId: string;
  topology: any;
  selectionMode: boolean;
  depth: number;
  selected: boolean;
  onSelectionChange: MouseEventHandler<HTMLDivElement>;
}

export function TopologyCard({
  size,
  topology,
  topologyId,
  selectionMode,
  depth,
  selected,
  onSelectionChange
}: IProps) {
  const [_topology, setTopology] = useState(topology);

  useEffect(() => {
    if (topologyId != null && _topology == null) {
      getTopologyWithoutUnroll({ id: topologyId, depth }).then((topology) => {
        setTopology(topology.data[0]);
      });
    }
  }, [topologyId, _topology, depth]);

  let selectionModeRootProps = null;

  if (selectionMode) {
    selectionModeRootProps = {
      role: "button",
      onClick: onSelectionChange
    };
  }

  const metricsInFooter = useMemo(
    () => size === CARD_SIZE.SMALL || size === CARD_SIZE.MEDIUM,
    [size]
  );

  const prepareTopologyLink = (topologyItem: { id: string }) => {
    return `/topology/${topologyItem.id}`;
  };

  if (_topology == null) {
    return <Loading text={`Loading ${topologyId}`} />;
  }

  _topology.properties = _topology.properties || [];
  const properties = filter(_topology.properties, (i) => !i.headline);
  const heading = filter(_topology.properties, (i) => i.headline);

  return (
    <div
      className={clsx(
        "rounded-8px mb-3 mr-3 shadow-card card topology-card bg-lightest-gray",
        _topology.status,
        selectionMode ? "cursor-pointer" : "",
        `topology-card-${size}`
      )}
      {...selectionModeRootProps}
    >
      <div className="flex flex-row flex-nowrap topology-card-header rounded-t-8px bg-white">
        <div className="flex pr-1 pt-2.5 pb-3.5 pl-5 overflow-hidden">
          <div className="text-gray-color m-auto mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
            <h3 className="text-gray-color text-2xsi leading-1.21rel">
              <Icon name={_topology.icon} size="2xl" />
            </h3>
          </div>
          <div className="flex-1 m-auto overflow-hidden">
            <p
              className="font-bold overflow-hidden truncate align-middle text-15pxinrem leading-1.21rel"
              title={_topology.name}
            >
              <Link to={prepareTopologyLink(_topology)}>
                {_topology.text || _topology.name}
              </Link>
            </p>
            {_topology.description != null ||
              (_topology.id != null && (
                <h3 className="text-gray-color overflow-hidden truncate text-2xsi leading-1.21rel font-medium">
                  {_topology.description || _topology.id}
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
            <TopologyDropdownMenu topology={_topology} />
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
            {Boolean(properties.length) && (
              <div className="py-4 pl-5 pr-1 overflow-y-auto max-h-36">
                {properties.map((property, index) => (
                  <Property
                    key={property.name}
                    property={property}
                    className={
                      index === _topology.properties.length - 1
                        ? "mb-0"
                        : "mb-2.5"
                    }
                  />
                ))}
              </div>
            )}
            <div className="pl-1 py-4 pr-5 overflow-y-auto max-h-36">
              {_topology.components &&
                _topology.components.map((component: any, index: number) => (
                  <div
                    className={
                      index === _topology.components.length - 1
                        ? "mb-0"
                        : "mb-2.5"
                    }
                    key={component.id}
                  >
                    <HealthSummary component={component} />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
