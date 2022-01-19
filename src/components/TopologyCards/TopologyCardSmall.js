import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../Icon";
import { cardStatusBorderTop } from "../../utils/common";

export const TopologyCardSmall = ({ title, status }) => (
  <div
    className={`rounded-8px mb-4 shadow-card border-t-6 ${cardStatusBorderTop(
      status
    )} card cursor-pointer`}
  >
    <div className="flex flex-row flex-nowrap rounded-t-8px pt-2.5 pr-2.5 pb-4 pl-4 bg-white">
      <div className="text-gray-color pt-3 mr-2.5 flex-initial max-w-1/4">
        <h6 className="text-gray-color text-2xsi">http://</h6>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-bold overflow-hidden truncate text-1" title={title}>
          {title}
        </p>
        <h6
          className="text-gray-color overflow-hidden truncate text-xs"
          title="jobs-demo"
        >
          jobs-demo
        </h6>
      </div>
      <div className="flex-initial text-1 p-1.5 mt-1">
        <Icon name="dots" className="" />
      </div>
    </div>
    <div className="grid grid-cols-3 bg-gray-100 px-2 py-4 rounded-b-8px divide-x">
      <div>
        <div className="text-gray-800 px-2">
          <h6 className="text-gray-color text-xs font-medium">RPS:</h6>
          <p className="font-bold text-sm">165/s</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <h6 className="text-gray-color text-xs font-medium">Errors:</h6>
          <p className="font-bold text-sm">0.1%</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <h6 className="text-gray-color text-xs font-medium">Latency:</h6>
          <p className="font-bold text-sm">225ms</p>
        </div>
      </div>
    </div>
  </div>
);

TopologyCardSmall.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};
