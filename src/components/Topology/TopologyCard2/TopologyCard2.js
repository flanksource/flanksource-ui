import React from "react";
import cx from "clsx";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { TopologyDropdownMenu } from "../TopologyDropdownMenu/TopologyDropdownMenu";
import { topologyCardCommonPropTypes } from "../prop-types";
import { TopologyMetrics } from "./components/TopologyMetrics";
import { Heading } from "./components/Heading";
import { Property } from "../Property";
import { HealthSummary } from "../../HealthSummary";
import PropTypes from "prop-types";

export const TopologyCardSmall2 = ({
  topology,
  selectionMode,
  selected,
  onSelectionChange,
  size
}) => {
  const isSmall = size === "small";
  const isMedium = size === "medium";
  const isLarge = size === "large";

  const { properties, components } = topology;
  const handleCheckedStateChange = (nextState, event) => {
    onSelectionChange(nextState, event);
  };

  const selectionModeRootProps = selectionMode
    ? {
        onClick: (event) => {
          handleCheckedStateChange(!selected, event);
        },
        onKeyUp: () => {},
        role: "button"
      }
    : {
        role: "none"
      };

  const renderTopologyMetrics = () => (
    <TopologyMetrics
      size={size}
      items={[
        { name: "RPS:", value: "165/s" },
        { name: "Errors:", value: "0.1%" },
        { name: "Latency:", value: "225ms" }
      ]}
    />
  );

  return (
    <div className={cx(" topology-card2", size)} {...selectionModeRootProps}>
      <div className="section-row top-section">
        <div className="section-left">
          <Heading size={size} />
        </div>
        <div className="section-right">
          {!isSmall && renderTopologyMetrics()}
          {selectionMode ? (
            <div className="checkbox-container">
              <input
                type="checkbox"
                className="h-4 w-4 text-dark-blue outline-none rounded-4px focus:outline-none"
                checked={selected}
                readOnly
              />
            </div>
          ) : (
            <div className="menu-container">
              <TopologyDropdownMenu
                className="flex flex-initial"
                menuButtonClassName="flex-initial text-1 p-0.5 min-w-7 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                renderButton={() => <DotsVerticalIcon className="h-6 w-6" />}
                items={[
                  { title: "Duplicate" },
                  { title: "Share" },
                  { title: "Delete" }
                ]}
              />
            </div>
          )}
        </div>
      </div>
      <div className="section-row bottom-section">
        <div className="section-left">
          {isSmall
            ? renderTopologyMetrics()
            : properties.map((property, index) => (
                <Property
                  key={property.name}
                  property={property}
                  className={
                    index === properties.length - 1 ? "mb-0" : "mb-2.5"
                  }
                />
              ))}
        </div>
        <div className="section-right">
          {!isSmall &&
            components.map((component) => (
              <div key={component.id}>
                <HealthSummary component={component} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

TopologyCardSmall2.propTypes = {
  ...topologyCardCommonPropTypes,
  size: PropTypes.string.isRequired
};

TopologyCardSmall2.defaultProps = {
  selectionMode: false,
  selected: false,
  onSelectionChange: () => {},
  size: "small"
};
