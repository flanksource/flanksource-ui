import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";

export const TopologyColumn = ({ title, cards }) => (
  <div className="p-3 bg-column-background border border-column-background rounded-md">
    <TopologyColumnHeader className="mb-4" name={title} />
    <div>{cards}</div>
  </div>
);

TopologyColumn.propTypes = {
  title: PropTypes.string.isRequired
};

export const TopologyColumnHeader = ({ name, className }) => (
  <div
    className={cx("text-center bg-warm-blue p-4 rounded-md font-bold text-sm", {
      [className]: className
    })}
  >
    <h4>{name}</h4>
  </div>
);

TopologyColumnHeader.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};
TopologyColumnHeader.defaultProps = {
  className: ""
};
