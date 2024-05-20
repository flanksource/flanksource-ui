import clsx from "clsx";
import { FiExternalLink } from "react-icons/fi";
import { Property as PropertyD } from "../../../api/types/topology";
import { NodePodPropToLabelMap } from "../../../constants";
import { Age } from "../../../ui/Age";
import { isEmpty } from "../../Canary/utils";
import { Icon } from "../../Icon";
import {
  FormatPropertyCPUMemory,
  FormatPropertyCurrency,
  FormatPropertyDefault,
  FormatPropertyURL
} from "./Utils/FormatProperties";

type FormatPropertyProps = {
  property: PropertyD;
  short?: boolean;
  isSidebar?: boolean;
};

export function FormatProperty({
  property,
  short = false,
  isSidebar = false
}: FormatPropertyProps) {
  if (property == null) {
    return null;
  }

  let { text } = property;

  if (property.name === "created" && typeof text === "string") {
    return <Age from={text} />;
  }

  if (property.type === "url") {
    return <FormatPropertyURL property={property} short={short} />;
  }

  if (property.type === "currency") {
    return <FormatPropertyCurrency property={property} short={short} />;
  }

  if (property.name === "cpu" || property.name === "memory") {
    return (
      <FormatPropertyCPUMemory
        property={property}
        isSidebar={isSidebar}
        short={short}
      />
    );
  }

  if (
    (property.type === "text" || !property.type) &&
    !property.value &&
    property.links
  ) {
    return (
      <div className="flex flex-wrap gap-2">
        {property.links?.map((link) => (
          <a
            key={link.url}
            href={link.url}
            className="link"
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
            <FiExternalLink className="inline ml-1" size={12} />
          </a>
        ))}
      </div>
    );
  }

  return <FormatPropertyDefault property={property} short={short} />;
}

type PropertyDisplayProps = {
  property: PropertyD;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "property">;

export function PropertyDisplay({
  property,
  className = "",
  ...props
}: PropertyDisplayProps) {
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
}
