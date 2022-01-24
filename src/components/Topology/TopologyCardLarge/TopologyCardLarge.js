import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Icon } from "../../Icon";
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

export const TopologyCardLarge = ({
  name,
  properties,
  status,
  selectionMode,
  selected,
  onSelectionChange
}) => (
  <div
    className={cx(
      "rounded-8px mb-4 shadow-card border-t-6 card cursor-pointer",
      status
    )}
  >
    <div className="flex flex-row flex-nowrap rounded-t-8px bg-white">
      <div className="flex w-large-card-left pr-1 pt-2.5 pb-3.5 pl-4">
        <div className="text-gray-color pt-2.5 mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
          <h3 className="text-gray-color text-2xsi leading-1.21rel">http://</h3>
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
              onChange={onSelectionChange}
            />
          </div>
        ) : (
          <TopologyDropdownMenu
            className="flex flex-initial"
            renderButton={() => (
              <div className="p-1.5 min-w-7">
                <Icon name="dots" className="" />
              </div>
            )}
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
        {properties.map(({ name, text }, index) => (
          <Property
            key={text}
            className={index === properties.length - 1 ? "mb-0" : "mb-2"}
            name={name}
            text={text}
          />
        ))}
      </div>
      <div className="w-large-card-right pl-1 pr-5 py-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <HealthSummary title="nodes" icon="nodes" chips={nodes} />
          </div>
          <div>
            <HealthSummary
              title="namespaces"
              icon="namespaces"
              chips={namespaces}
            />
          </div>
          <div>
            <HealthSummary
              title="databases"
              icon="databases"
              chips={databases}
            />
          </div>
          <div>
            <HealthSummary title="pods" icon="pods" chips={pods} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

TopologyCardLarge.propTypes = {
  name: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  status: PropTypes.string.isRequired
};
