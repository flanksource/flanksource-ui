import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";

export const TopologySubHeader = ({ isLarge }) => (
  <div className="grid grid-cols-3 rounded-b-8px divide-x">
    <div>
      <div className={cx("text-gray-800", { "flex pt-3": isLarge })}>
        <h6
          className={cx("text-gray-color text-2xs font-medium font-inter", {
            "leading-4": isLarge
          })}
        >
          RPS:
        </h6>
        <span className={cx("font-bold text-xs", { "ml-1": isLarge })}>
          165/s
        </span>
      </div>
    </div>
    <div className="flex justify-center">
      <div
        className={cx("text-gray-800 px-2 align-middle", {
          "flex pt-3": isLarge
        })}
      >
        <h6
          className={cx("text-gray-color text-2xs font-medium font-inter", {
            "leading-4": isLarge
          })}
        >
          Errors:
        </h6>
        <span className={cx("font-bold text-xs", { "ml-1": isLarge })}>
          0.1%
        </span>
      </div>
    </div>
    <div className="flex justify-center">
      <div
        className={cx("text-gray-800 px-2 align-middle", {
          "flex pt-3": isLarge
        })}
      >
        <h6
          className={cx("text-gray-color text-2xs font-medium font-inter", {
            "leading-4": isLarge
          })}
        >
          Latency:
        </h6>
        <span className={cx("font-bold text-xs", { "ml-1": isLarge })}>
          225ms
        </span>
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
