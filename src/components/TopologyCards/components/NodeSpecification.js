import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Icon } from "../../Icon";

export const NodeSpecification = ({ name, text, className }) => (
  <div className={cx("flex", { [className]: className })}>
    <Icon name={name} className="mr-2.5" />
    <h1 className="text-xs overflow-hidden truncate">{text}</h1>
  </div>
);

NodeSpecification.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};

NodeSpecification.defaultProps = {
  className: ""
};
