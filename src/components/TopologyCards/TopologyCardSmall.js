import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../Icon";

export const TopologyCardSmall = ({ title, statusColor }) => (
  <div
    className={`rounded-8px mb-4 shadow-card border-t-6 ${statusColor} card cursor-pointer`}
  >
    <div className="flex flex-row flex-nowrap rounded-t-8px pt-2.5 pr-2.5 pb-4 pl-4 bg-white">
      <div className="text-gray-color pt-3 mr-2.5 flex-initial max-w-1/4">
        <h3 className="text-gray-color text-2xsi">http://</h3>
      </div>
      <div className="flex-1 overflow-hidden">
        <h1 className="font-bold overflow-hidden truncate text-1" title={title}>
          {title}
        </h1>
        <h3
          className="text-gray-color overflow-hidden truncate text-xs"
          title="jobs-demo"
        >
          jobs-demo
        </h3>
      </div>
      <div className="flex-initial text-1 p-1.5 mt-1">
        <Icon name="dots" className="" />
      </div>
    </div>
    <div className="grid grid-cols-3 bg-gray-100 px-2 py-4 rounded-b-8px divide-x">
      <div>
        <div className="text-gray-800 px-2">
          <h3 className="text-gray-color text-xs font-medium">RPS:</h3>
          <h1 className="font-bold text-sm">165/s</h1>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <h3 className="text-gray-color text-xs font-medium">Errors:</h3>
          <h1 className="font-bold text-sm">0.1%</h1>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <h3 className="text-gray-color text-xs font-medium">Latency:</h3>
          <h1 className="font-bold text-sm">225ms</h1>
        </div>
      </div>
    </div>
  </div>
);

TopologyCardSmall.propTypes = {
  title: PropTypes.string.isRequired,
  statusColor: PropTypes.string.isRequired
};
