import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";

export const TopologyMetrics = ({ items, size }) => {
  const [firstItem, secondItem, thirdItem] = items;

  return (
    <div className={cx("metrics", size)}>
      <div className="metrics-col">
        <span className="metrics-label">{firstItem.name}</span>
        <p className="metrics-value">{firstItem.value}</p>
      </div>
      <div className="metrics-col metrics-col-not-first">
        <span className="metrics-label">{secondItem.name}</span>
        <p className="metrics-value">{secondItem.value}</p>
      </div>
      <div className="metrics-col metrics-col-not-first">
        <span className="metrics-label">{thirdItem.name}</span>
        <p className="metrics-value">{thirdItem.value}</p>
      </div>
    </div>
  );
};

TopologyMetrics.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  size: PropTypes.string.isRequired
};
