import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Icon } from "../Icon";
import { getTopologyCardStatusBorderTopColor } from "../../utils/getTopologyCardStatusBorderTopColor";

export const TopologyCardSmall = ({ name, status }) => (
  <div
    className={cx(
      "rounded-8px mb-4 shadow-card border-t-6 card cursor-pointer bg-white",
      getTopologyCardStatusBorderTopColor(status)
    )}
  >
    <div className="flex flex-row flex-nowrap rounded-t-8px pt-2.5 pr-1.5 pb-3.5 pl-4 bg-white">
      <div className="text-gray-color pt-2.5 mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
        <span className="text-gray-color text-2xsi leading-1.21rel">
          http://
        </span>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <p className="font-bold overflow-hidden truncate text-1 leading-1.21rel mb-px">
          {name}
        </p>
        <span
          className="text-gray-color overflow-hidden truncate text-xs leading-1.21rel"
          title="jobs-demo"
        >
          jobs-demo
        </span>
      </div>
      <div className="flex-initial text-1 p-1.5 mt-1.5">
        <Icon name="dots" className="" />
      </div>
    </div>
    <div className="grid grid-cols-3 bg-lightest-gray px-2 py-4 rounded-b-8px divide-x leading-none">
      <div>
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium leading-1.21rel">
            RPS:
          </span>
          <p className="font-bold text-sm leading-1.21rel">165/s</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium leading-1.21rel">
            Errors:
          </span>
          <p className="font-bold text-sm leading-1.21rel">0.1%</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium leading-1.21rel">
            Latency:
          </span>
          <p className="font-bold text-sm leading-1.21rel">225ms</p>
        </div>
      </div>
    </div>
  </div>
);

TopologyCardSmall.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};
