import clsx from "clsx";
import PropTypes from "prop-types";
import { FiExternalLink } from "react-icons/fi";
import { NodePodPropToLabelMap } from "../../constants";
import { formatBytes } from "../../utils/common";
import { relativeDateTime } from "../../utils/date";
import { isEmpty } from "../Canary/utils";
import { Icon } from "../Icon";

export const FormatProperty = ({ property, short = false }) => {
  if (property == null) {
    return "undefined";
  }
  let { text } = property;

  if (property.name === "created") {
    return relativeDateTime(text);
  }

  if (property.type === "url") {
    return (
      <a
        href={property.text}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        <span>{property.text.replace("https://", "")}</span>
        <FiExternalLink className="inline-block ml-1" />
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

    // if (property.unit.toUpperCase() === "USD") {
    //   return (
    //     <span className="flex flex-center">
    //       <span className="align-middle">
    //         <BsCurrencyDollar color="gray" size={16} />
    //       </span>

    //       <span className="align-bottom">{amount}</span>
    //     </span>
    //   );
    // }
    return (
      <span>
        {/* {property.unit} */}
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
    let suffix = "";
    if (!short && property.max != null) {
      if (property.unit.startsWith("milli")) {
        suffix = ` of ${(property.max / 1000).toFixed(2)}`;
      } else if (property.unit === "bytes") {
        suffix = ` of ${formatBytes(property.max, 0)}`;
      }
    }
    if (suffix && text) {
      text =
        typeof text === "object" ? (
          <>
            {text}
            {suffix}
          </>
        ) : (
          text + suffix
        );
    }
  }
  if (isEmpty(text)) {
    return "";
  }
  return (
    <span data-tip={text} className="overflow-ellipsis">
      {text}
    </span>
  );
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
      <Icon name={icon} className="mr-1 w-4" />
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
