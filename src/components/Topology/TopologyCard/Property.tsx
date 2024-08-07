import clsx from "clsx";
import { Property as PropertyD } from "../../../api/types/topology";
import { NodePodPropToLabelMap } from "../../../constants";
import { Icon } from "../../../ui/Icons/Icon";
import { isEmpty } from "../../Canary/utils";
import { FormatProperty } from "./FormatProperty";

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
        <span className="overflow-hidden truncate pb-1 text-xs text-gray-400">
          {label}:&nbsp;
        </span>
      )}
      <span
        title={property.text}
        className={clsx(
          "overflow-hidden truncate text-xs",
          `text-${color}-500`
        )}
      >
        <FormatProperty property={property} />
      </span>
    </div>
  );
}
