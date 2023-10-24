import clsx from "clsx";
import { NodePodPropToLabelMap } from "../../constants";
import { TopologyProperty } from "../../context/TopologyPageContext";
import { isEmpty } from "../Canary/utils";
import { Icon } from "../Icon";
import { Age } from "../UI/Age";
import {
  FormatPropertyCurrency,
  FormatPropertyDefault,
  FormatPropertyURL
} from "./Utils/FormatProperties";

type FormatPropertyProps = {
  property: TopologyProperty;
  short?: boolean;
};

export function FormatProperty({
  property,
  short = false
}: FormatPropertyProps) {
  if (property == null) {
    return null;
  }
  let { text } = property;

  if (property.name === "created" && typeof text === "string") {
    return <Age from={text} />;
  }

  if (property.type === "url") {
    return <FormatPropertyURL property={property} />;
  }

  if (property.type === "currency") {
    return <FormatPropertyCurrency property={property} />;
  }

  return <FormatPropertyDefault property={property} short={short} />;
}

type PropertyProps = {
  property: TopologyProperty;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "property">;

export const Property = ({
  property,
  className = "",
  ...props
}: PropertyProps) => {
  const { name, icon, color } = property;
  const label =
    NodePodPropToLabelMap[name as keyof typeof NodePodPropToLabelMap] || name;

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
      {...props}
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
