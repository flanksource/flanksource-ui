import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Icon } from "../../Icon";

export const Property = ({ property, className }) => {
  const { name, text, icon, color } = property;
  return (
    <div className={cx("flex", { [className]: className })}>
      <Icon name={icon} className="mr-2.5" size="2xsi" />
      <span className="text-xs overflow-hidden truncate leading-tightly font-medium text-gray-400 pr-2">
        {name}:
      </span>
      <span className="text-xs overflow-hidden truncate leading-tightly font-medium">
        {text}
      </span>
    </div>
  );
};
Property.propTypes = {
  property: PropTypes.shape({
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string
};

Property.defaultProps = {
  className: ""
};
