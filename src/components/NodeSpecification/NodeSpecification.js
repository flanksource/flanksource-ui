import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Icon } from "../Icon";

export const NodeSpecification = ({ name, text, className }) => (
  <div className={cx("flex", { [className]: className })}>
    <Icon name={name} className="mr-2.5" size="2xsi" />
    <span className="text-xs overflow-hidden truncate leading-1.21rel font-medium">
      {text}
    </span>
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
