import { Icon } from "../../ui/Icons/Icon";
import { PropertyItem } from "../Topology/Sidebar/Utils/formatProperties";
import DisplayDetailsRow from "./DisplayDetailsRow";

type Props = {
  items: PropertyItem[];
};

export function DisplayGroupedProperties({ items }: Props) {
  return (
    <>
      {items.map((property) => {
        if (property.type === "SINGLE") {
          return (
            <DisplayDetailsRow
              items={property.properties}
              key={property.label}
            />
          );
        }

        return (
          <div
            key={property.label}
            className="flex max-w-full flex-col space-y-2 py-1"
          >
            <div className="text-sm text-gray-700">
              <span className="border-b border-dashed border-gray-500">
                {property.icon && (
                  <Icon name={property.icon} className="mr-1 w-4" />
                )}
                {property.label}
              </span>
            </div>
            <div className="mx-2 flex flex-col gap-2 px-1.5">
              {property.properties.map((property) => (
                <DisplayDetailsRow
                  items={property.rowProperties}
                  key={property.rowKey}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
