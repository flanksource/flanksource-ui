import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import clsx from "clsx";
import { Icon } from "../../Icon";
import { Property } from "../Property";
import { HealthSummary } from "../../HealthSummary/summary";
import { SubHeaderMetrics } from "./components/SubHeaderMetrics";
import { TopologyDropdownMenu } from "../TopologyDropdownMenu/TopologyDropdownMenu";
import {
  databases,
  namespaces,
  nodes,
  pods
} from "../../../data/topologyDatas";

export function TopologyCardMedium({
  topology,
  selectionMode,
  selected,
  onSelectionChange
}) {
  const { name, status, components, properties } = topology;

  const handleCheckedStateChange = (nextState, event) => {
    onSelectionChange(nextState, event);
  };

  const selectionModeRootProps = selectionMode
    ? {
        onClick: (event) => {
          handleCheckedStateChange(!selected, event);
        },
        onKeyUp: (event) => {
          if (event.code === "Space" || event.code === "Enter") {
            handleCheckedStateChange(!selected, event);
          }
        },
        role: "button",
        tabIndex: 0
      }
    : {
        role: "none"
      };

  return (
    <div
      className={cx(
        "rounded-8px mb-4 shadow-card border-t-6 card cursor-pointer bg-white topology-card",
        status
      )}
      {...selectionModeRootProps}
    >
      <div className="flex flex-row flex-nowrap rounded-t-8px bg-white">
        <div className="flex w-med-card-left pr-1 pt-2.5 pb-3.5 pl-5">
          <div className="text-gray-color pt-2.5 mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
            <h3 className="text-gray-color text-2xsi leading-1.21rel">
              <Icon name={topology.icon} />
            </h3>
          </div>
          <div className="flex-1 overflow-hidden">
            <p
              className="font-bold overflow-hidden truncate text-15pxinrem leading-1.21rel"
              title={name}
            >
              {name}
            </p>
            <h3 className="text-gray-color overflow-hidden truncate text-2xsi leading-1.21rel font-medium">
              {topology.description}
            </h3>
          </div>
        </div>

        <div className="flex w-med-card-right justify-between pl-1 pr-1.5 pb-3.5 pt-3">
          <SubHeaderMetrics
            items={[
              { name: "RPS:", value: "165/s" },
              { name: "Errors:", value: "0.1%" },
              { name: "Latency:", value: "225ms" }
            ]}
          />
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
            <TopologyDropdownMenu
              className="flex flex-initial"
              menuButtonClassName="p-1.5 min-w-7 rounded-md hover:bg-gray-200 active:bg-gray-200 focus:outline-none focus-visible:ring-2  focus:ring-gray-200 focus-visible:ring-opacity-75"
              renderButton={() => <Icon name="dots" className="" />}
              items={[
                { title: "Duplicate" },
                { title: "Share" },
                { title: "Delete" }
              ]}
            />
          )}
        </div>
      </div>
      <div className="flex flex-nowrap bg-lightest-gray rounded-b-8px">
        <div className="w-med-card-left py-4 pl-5 pr-1">
          {properties.map((property, index) => (
            <Property
              key={property.name}
              property={property}
              className={index === properties.length - 1 ? "mb-0" : "mb-2.5"}
            />
          ))}
        </div>
        <div className="w-med-card-right pl-1 py-4 pr-5">
          {components.map((component, index) => (
            <div
              className={index === properties.length - 1 ? "mb-0" : "mb-2.5"}
              key={component.id}
            >
              <HealthSummary component={component} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

TopologyCardMedium.propTypes = {
  selectionMode: PropTypes.bool,
  selected: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  topology: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    icon: PropTypes.string,
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        text: PropTypes.string
      }).isRequired
    )
  }).isRequired
};

TopologyCardMedium.defaultProps = {
  selectionMode: false,
  selected: false,
  onSelectionChange: () => {}
};
