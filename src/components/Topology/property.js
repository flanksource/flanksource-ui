import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Icon } from "../Icon";
import { formatBytes } from "../../utils/common";
import { isEmpty } from "../Canary/utils";

export const FormatProperty = ({ property, short = false }) => {
  if (property == null) {
    return "undefined";
  }
  let { text } = property;

  if (property.type === "url") {
    return (
      <a
        href={property.text}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        {property.text.replace("https://", "")}
      </a>
    );
  }

  if (property.value != null) {
    if (property.max != null) {
      const percent = ((property.value / property.max) * 100).toFixed(0);
      text = `${percent}%`;
      if (percent > 70) {
        text = <span className="text-red-500">{text}</span>;
      }
    } else if (property.unit && property.unit.startsWith("milli")) {
      text = (property.value / 1000).toFixed;
    } else if (property.unit === "bytes") {
      text = formatBytes(property.value, 0);
    }

    if (!short && property.max != null) {
      if (property.unit.startsWith("milli")) {
        text += ` of ${(property.max / 1000).toFixed(2)}`;
      } else if (property.unit === "bytes") {
        text += ` of ${formatBytes(property.max, 0)}`;
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

  if (
    property.type === "hidden" ||
    (isEmpty(property.text) && isEmpty(property.value))
  ) {
    return null;
  }
  return (
    <div className={clsx("flex", { [className]: className })}>
      <Icon name={icon} className="mr-1" size="2xsi" />
      {!isEmpty(name) && (
        <span className="text-xs overflow-hidden truncate text-gray-400 pr-1">
          {name}:
        </span>
      )}
      <span
        className={clsx(
          "text-xs overflow-hidden truncate",
          `text-${color}-500`
        )}
      >
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
