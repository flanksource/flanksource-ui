import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Icon } from "../Icon";
import { cardStatusBorderTop } from "./utils/cardStatusBorderTop";

export const TopologyCardCompact = ({ name, status }) => (
  <div
    className={cx(
      "rounded-8px mb-4 shadow-card border-t-6 card cursor-pointer",
      cardStatusBorderTop(status)
    )}
  >
    <div className="flex flex-row flex-nowrap rounded-t-8px pt-2.5 pr-2.5 pb-4 pl-4 bg-white">
      <div className="text-gray-color pt-3 mr-2.5 flex-initial max-w-1/4">
        <span className="text-gray-color text-2xsi">http://</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-bold overflow-hidden truncate text-1">{name}</p>
        <span
          className="text-gray-color overflow-hidden truncate text-xs"
          title="jobs-demo"
        >
          jobs-demo
        </span>
      </div>
      <div className="flex-initial text-1 p-1.5 mt-1">
        <Icon name="dots" className="" />
      </div>
    </div>
    <div className="grid grid-cols-3 bg-gray-100 px-2 py-4 rounded-b-8px divide-x">
      <div>
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium">RPS:</span>
          <p className="font-bold text-sm">165/s</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium">Errors:</span>
          <p className="font-bold text-sm">0.1%</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium">Latency:</span>
          <p className="font-bold text-sm">225ms</p>
        </div>
      </div>
    </div>
  </div>
);

TopologyCardCompact.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};
