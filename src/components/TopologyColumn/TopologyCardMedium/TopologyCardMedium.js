import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../../Icon";
import { TopologySubHeader } from "../TopologySubHeader/TopologySubHeader";
import { NodeSpecification } from "../NodeSpecification/NodeSpecification";
import { Chips } from "../Chips/Chips";
import {
  databases,
  nodes,
  nodeSpecification
} from "../../../data/topologyDatas";

export const TopologyCardMedium = ({ title, color }) => (
  <div
    className={`rounded-8px mb-4 shadow-card border-t-6 ${color} card cursor-pointer`}
  >
    <div className="flex flex-row flex-nowrap rounded-t-8px pt-2.5 pr-2.5 pb-4 pl-4 bg-white">
      <div className="flex w-2/4">
        <div className="text-gray-color pt-3 mr-2.5 flex-initial max-w-1/4">
          <h3 className="text-gray-color text-2.8">http://</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <h1
            className="font-bold overflow-hidden truncate text-fifteen"
            title={title}
          >
            {title}
          </h1>
          <h3
            className="text-gray-color overflow-hidden truncate text-2.8"
            title="jobs-demo"
          >
            jobs-demo
          </h3>
        </div>
      </div>
      <div className="pt-0.5">
        <TopologySubHeader />
      </div>

      <div className="flex-initial text-1 p-1.5 mt-1 right-1.5">
        <Icon name="dots" />
      </div>
    </div>
    <div className="grid grid-cols-2 bg-gray-100 rounded-b-8px p-5">
      <div>
        {nodeSpecification.map(({ title, icon, id }) => (
          <NodeSpecification key={id} icon={icon} title={title} />
        ))}
      </div>
      <div>
        <div className="mb-4">
          <Chips title="nodes" icon="nodes" chips={nodes} />
        </div>
        <div className="mb-4">
          <Chips title="databases" icon="databases" chips={databases} />
        </div>
      </div>
    </div>
  </div>
);

TopologyCardMedium.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};
