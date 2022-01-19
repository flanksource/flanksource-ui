import React from "react";
import PropTypes from "prop-types";

export const TopologyColumnHeader = ({ name, className }) => (
  <div
    className={`text-center bg-warm-blue p-4 rounded-md font-bold text-sm ${className}`}
  >
    <h6>{name}</h6>
  </div>
);

TopologyColumnHeader.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};
TopologyColumnHeader.defaultProps = {
  className: ""
};
