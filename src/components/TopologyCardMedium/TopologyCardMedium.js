import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Icon } from "../Icon";
import { NodeSpecification } from "../NodeSpecification/NodeSpecification";
import { NodeStats } from "../NodeStats/NodeStats";
import { databases, nodes } from "../../data/topologyDatas";
import { getTopologyCardStatusBorderTopColor } from "../../utils/getTopologyCardStatusBorderTopColor";
import { SubHeaderMetrics } from "./components/SubHeaderMetrics";
import { TopologyDropdownMenu } from "../TopologyDropdownMenu/TopologyDropdownMenu";

export const TopologyCardMedium = ({
  name,
  properties,
  status,
  selectionMode,
  selected,
  onSelectionChange
}) => (
  <div
    className={cx(
      "rounded-8px mb-4 shadow-card border-t-6 card cursor-pointer bg-white",
      getTopologyCardStatusBorderTopColor(status)
    )}
  >
    <div className="flex flex-row flex-nowrap rounded-t-8px bg-white">
      <div className="flex w-med-card-left pr-1 pt-2.5 pb-3.5 pl-5">
        <div className="text-gray-color pt-2.5 mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
          <h3 className="text-gray-color text-2xsi leading-1.21rel">http://</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <p
            className="font-bold overflow-hidden truncate text-15pxinrem leading-1.21rel"
            title={name}
          >
            {name}
          </p>
          <h3
            className="text-gray-color overflow-hidden truncate text-2xsi leading-1.21rel font-medium"
            title="jobs-demo"
          >
            jobs-demo
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
    <div className="flex flex-nowrap bg-lightest-gray rounded-b-8px py-4 px-5">
      <div className="w-med-card-left pr-1">
        {properties.map(({ name, text }, index) => (
          <NodeSpecification
            key={text}
            className={index === properties.length - 1 ? "mb-0" : "mb-2.5"}
            name={name}
            text={text}
          />
        ))}
      </div>
      <div className="w-med-card-right pl-1">
        <div className="mb-4">
          <NodeStats title="nodes" icon="nodes" chips={nodes} />
        </div>
        <div>
          <NodeStats
            title="databases"
            icon="databases"
            iconSize="2xsi"
            chips={databases}
          />
        </div>
      </div>
    </div>
  </div>
);

TopologyCardMedium.propTypes = {
  name: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  status: PropTypes.string.isRequired,
  selectionMode: PropTypes.bool,
  selected: PropTypes.bool,
  onSelectionChange: PropTypes.func
};

TopologyCardMedium.defaultProps = {
  selectionMode: false,
  selected: false,
  onSelectionChange: () => {}
};
