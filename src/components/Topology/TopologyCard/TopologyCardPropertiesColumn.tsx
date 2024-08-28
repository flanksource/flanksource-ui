import { Property } from "@flanksource-ui/api/types/topology";
import { CustomScroll } from "@flanksource-ui/ui/CustomScroll";
import clsx from "clsx";
import { PropertyDisplay } from "./Property";

type TopologyCardPropertiesColumnProps = {
  properties: Property[];
  displayTwoColumns?: boolean;
};

export default function TopologyCardPropertiesColumn({
  properties,
  displayTwoColumns = false
}: TopologyCardPropertiesColumnProps) {
  // Filter out properties that are hidden, have no text or value, and are not a
  // headline property.
  const noneHeadlineProperties = properties.filter(
    (i) => !i.headline && i.type !== "hidden" && (i.text || i.value)
  );

  if (noneHeadlineProperties.length === 0) {
    return null;
  }

  return (
    <CustomScroll
      className={clsx(
        "flex-1 py-2 pl-2",
        displayTwoColumns ? "grid grid-cols-2" : ""
      )}
      showMoreClass="text-xs linear-1.21rel mr-1 cursor-pointer"
      maxHeight="200px"
      minChildCount={6}
    >
      {noneHeadlineProperties.map((property, index) => (
        <PropertyDisplay
          key={index}
          property={property}
          className={index === properties!.length - 1 ? "mb-0" : "mb-1.5"}
        />
      ))}
    </CustomScroll>
  );
}
