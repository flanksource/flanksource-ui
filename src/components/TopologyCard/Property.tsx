import PropTypes from "prop-types";
import clsx from "clsx";
import { Icon } from "../Icon";
import { formatBytes } from "../../utils/common";
import { isEmpty } from "../Canary/utils";
import { NodePodPropToLabelMap } from "../../constants";
import { BsCurrencyDollar } from "react-icons/bs";

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

  if (property.type === "currency") {
    var amount = property.value;
    if (amount > 1000) {
      amount = (amount / 1000).toFixed(1) + "k";
    } else if (amount > 100) {
      amount = amount.toFixed(0);
    } else if (amount > 10) {
      amount = amount.toFixed(1);
    } else if (amount > 0.01) {
      amount = amount.toFixed(2);
    } else if (amount > 0.001) {
      amount = amount.toFixed(3);
    }

    if (property.unit.toUpperCase() === "USD") {
      return (
        <span className="flex flex-center">
          <span className="align-middle">
            <BsCurrencyDollar color="gray" size={16} />
          </span>

          <span className="align-bottom">{amount}</span>
        </span>
      );
    }
    return (
      <span>
        {property.unit}
        {amount}
      </span>
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
      text = (property.value / 1000).toFixed(2);
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

export const Property = ({ property, className, ...rest }) => {
  const { name, icon, color } = property;
  const label = NodePodPropToLabelMap[name] || name;

  if (
    property.type === "hidden" ||
    (isEmpty(property.text) && isEmpty(property.value))
  ) {
    return null;
  }
  return (
    <div
      className={clsx(
        "flex",
        { [className]: className },
        icon ? "flex-row" : "flex-col"
      )}
      {...rest}
    >
      <Icon name={icon} className="mr-1" size="2xsi" />
      {!isEmpty(label) && (
        <span className="text-xs overflow-hidden truncate text-gray-400 pb-1">
          {label}:&nbsp;
        </span>
      )}
      <span
        title={property.text}
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
