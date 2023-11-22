import { PropertyItem } from "../Topology/Sidebar/Utils/formatTopologyProperties";
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
            className="flex flex-col space-y-2 py-2 max-w-full"
          >
            <div className="text-sm font-semibold text-gray-600 border-b border-dashed border-gray-300 pb-1">
              {property.label}
            </div>
            <div className="flex flex-col px-1 gap-2">
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
