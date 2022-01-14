import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../../Icon";

export const NodeSpecification = ({ name, text, lastItem }) => (
  <div className={`flex ${text !== lastItem.text && "mb-2"}`}>
    <Icon name={name} className="mr-2.5" />
    <h1 className="text-xs overflow-hidden truncate">{text}</h1>
  </div>
);

NodeSpecification.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};
