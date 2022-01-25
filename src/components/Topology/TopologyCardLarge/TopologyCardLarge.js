import React from "react";
import cx from "clsx";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { Property } from "../Property";
import {
  databases,
  namespaces,
  nodes,
  pods
} from "../../../data/topologyDatas";
import { SubHeaderMetrics } from "./components/SubHeaderMetrics";
import { TopologyDropdownMenu } from "../TopologyDropdownMenu/TopologyDropdownMenu";
import { HealthSummary } from "../../HealthSummary";
import { topologyCardCommonPropTypes } from "../prop-types";

export const TopologyCardLarge = ({
  topology,
  selectionMode,
  selected,
  onSelectionChange
}) => {
  const { name, status, components, properties } = topology;

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

  return (
    <div
      className={cx(
        "rounded-8px mb-4 shadow-card border-t-6 card cursor-pointer",
        status
      )}
      {...selectionModeRootProps}
    >
      <div className="flex flex-row flex-nowrap rounded-t-8px bg-white">
        <div className="flex w-large-card-left pr-1 pt-2.5 pb-3.5 pl-4">
          <div className="text-gray-color pt-2.5 mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
            <h3 className="text-gray-color text-2xsi leading-1.21rel">
              http://
            </h3>
          </div>
          <div className="flex-1 overflow-hidden">
            <p
              className="font-bold overflow-hidden truncate text-15pxinrem leading-1.21rel pb-px"
              title={name}
            >
              {name}
            </p>
            <h3
              className="text-gray-color overflow-hidden truncate text-2xsi leading-1.21rel font-medium pt-px"
              title="jobs-demo"
            >
              jobs-demo
            </h3>
          </div>
        </div>
        <div className="flex w-large-card-right justify-between pl-1 pr-3 pb-3.5 pt-2.5">
          <SubHeaderMetrics />
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
              className="flex-initial"
              menuButtonClassName="p-0.5 min-w-7 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              renderButton={() => <DotsVerticalIcon className="h-6 w-6" />}
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
        <div className="w-large-card-left pr-1 py-4 pl-5">
          {properties.map((property, index) => (
            <Property
              key={property.text}
              property={property}
              className={index === properties.length - 1 ? "mb-0" : "mb-2"}
            />
          ))}
        </div>
        <div className="w-large-card-right pl-1 pr-5 py-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {components.map((component) => (
              <div key={component.id}>
                <HealthSummary component={component} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

TopologyCardLarge.propTypes = topologyCardCommonPropTypes;
