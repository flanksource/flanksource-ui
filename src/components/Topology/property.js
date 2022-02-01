import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Icon } from "../Icon";
import { formatBytes } from "../../utils/common";
import { isEmpty } from "../Canary/utils";

export const FormatProperty = ({ property, short = false }) => {
  if (property == null) {
    return "undefined";
  }
  let { text } = property;

  if (property.value != null) {
    if (property.unit && property.unit.startsWith("milli")) {
      text = (property.value / 1000).toFixed(2);
    } else if (property.unit === "bytes") {
      text = formatBytes(property.value);
    }

    if (!short && property.max != null) {
      if (property.unit.startsWith("milli")) {
        text += ` of ${(property.max / 1000).toFixed(2)}`;
      } else if (property.unit === "bytes") {
        text += ` of ${formatBytes(property.max)}`;
      }
    }
  }
  if (isEmpty(text)) {
    return "";
  }
  return text;
};

export const Property = ({ property, className }) => {
  const { name, icon, color } = property;

  return (
    <div className={cx("flex", { [className]: className })}>
      <Icon name={icon} className="mr-2.5" size="2xsi" />
      <span className="text-xs overflow-hidden truncate text-gray-400 pr-1">
        {name}:
      </span>
      <span className="text-xs overflow-hidden truncate">
        <FormatProperty property={property} />
      </span>
    </div>
  );
};
Property.propTypes = {
  // property: PropTypes.shape({
  //   name: PropTypes.string.isRequired,
  //   text: PropTypes.string,
  // }).isRequired,
  className: PropTypes.string
};

Property.defaultProps = {
  className: ""
};
