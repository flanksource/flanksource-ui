import React from "react";
import PropTypes from "prop-types";

export const TopologyColumnHeader = ({ name, className }) => (
  <div
    className={`text-center bg-warm-blue p-4 rounded-md font-bold text-sm ${className}`}
  >
    <h1>{name}</h1>
  </div>
);

TopologyColumnHeader.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};
TopologyColumnHeader.defaultProps = {
  className: ""
};
