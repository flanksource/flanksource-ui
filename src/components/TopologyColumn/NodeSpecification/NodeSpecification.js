import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../../Icon";

export const NodeSpecification = ({ icon, title }) => (
  <div className="flex mb-2">
    <Icon name={icon} />
    <h1 className="text-xs ml-2.5">{title}</h1>
  </div>
);

NodeSpecification.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};
