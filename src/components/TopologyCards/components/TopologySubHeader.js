import React from "react";
import PropTypes from "prop-types";

export const TopologySubHeader = ({ isLarge }) => (
  <div className="grid grid-cols-3 rounded-b-8px divide-x">
    <div>
      <div className={`text-gray-800 ${isLarge && "flex pt-3"}`}>
        <h6
          className={`text-gray-color text-2xs font-medium font-inter ${
            isLarge && "leading-4"
          }`}
        >
          RPS:
        </h6>
        <span className={`font-bold text-xs ${isLarge && "ml-1"}`}>165/s</span>
      </div>
    </div>
    <div className="flex justify-center">
      <div
        className={`text-gray-800 px-2 align-middle  ${isLarge && "flex pt-3"}`}
      >
        <h6
          className={`text-gray-color text-2xs font-medium font-inter${
            isLarge && "leading-4"
          }`}
        >
          Errors:
        </h6>
        <span className={`font-bold text-xs ${isLarge && "ml-1"}`}>0.1%</span>
      </div>
    </div>
    <div className="flex justify-center">
      <div
        className={`text-gray-800 px-2 align-middle  ${isLarge && "flex pt-3"}`}
      >
        <h6
          className={`text-gray-color text-2xs font-medium font-inter ${
            isLarge && "leading-4"
          } `}
        >
          Latency:
        </h6>
        <span className={`font-bold text-xs ${isLarge && "ml-1"}`}>225ms</span>
      </div>
    </div>
  </div>
);

TopologySubHeader.propTypes = {
  isLarge: PropTypes.bool
};
TopologySubHeader.defaultProps = {
  isLarge: false
};
