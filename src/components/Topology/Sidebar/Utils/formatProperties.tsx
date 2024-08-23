import { Topology } from "../../../../api/types/topology";
import { FormatProperty } from "../../TopologyCard/FormatProperty";

type GroupedProperties = {
  type: "GROUPED";
  label: string;
  icon?: string;
  groupName: string;
  properties: {
    rowKey: string;
    rowProperties: {
      label: string;
      value: React.ReactNode;
    }[];
  }[];
};

type SingleProperty = {
  type: "SINGLE";
  label: string;
  rowKey: string;
  properties: {
    icon?: string;
    label: string;
    value: React.ReactNode;
  }[];
};

export type PropertyItem = GroupedProperties | SingleProperty;

export function formatProperties(topology?: Pick<Topology, "properties">) {
  if (topology == null) {
    return [];
  }

  const items = new Map<string, PropertyItem>();

  // remove headline properties from the list of properties
  const topologyProperties = topology?.properties ?? [];

  const rowKeysMaps = new Map([
    ["region", "region/zone"],
    ["zone", "region/zone"],
    ["vpc", "vpc/subnet"],
    ["subnet", "vpc/subnet"],
    ["os", "os/arch"],
    ["arch", "os/arch"],
    ["version", "version/part-of"],
    ["part-of", "version/part-of"]
  ]);

  topologyProperties.forEach((property) => {
    // first, take name from property and split it by : or / to get the group
    // name, if we can't split it, then we don't need to group the properties
    if (property.name?.split(/[:/]/).length === 1) {
      const label = property.namespace
        ? `${property.namespace}/${property.name}`
        : property.name;

      const rowKey = rowKeysMaps.get(property.name) ?? property.name;

      const existingValues = items.get(rowKey);

      items.set(rowKey, {
        type: "SINGLE",
        label: rowKey,
        rowKey: rowKey,
        properties: [
          ...((existingValues as SingleProperty)?.properties ?? []),
          {
            label: label,
            value: <FormatProperty property={property} isSidebar />
          }
        ].sort((a, b) => {
          // sort alphabetically, by label
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        })
      });
      return;
    }

    const groupName = property.name.split(/[:/]/)[0];
    const name = property.name.split(/[:/]/).slice(1).join("/");

    const existingValues = (items.get(groupName) as GroupedProperties) ?? {
      type: "GROUPED",
      label: groupName,
      groupName,
      properties: []
    };

    const label = property.namespace ? `${property.namespace}/${name}` : name;

    const rowKey = rowKeysMaps.get(name) ?? name;

    const existingProperty =
      existingValues.properties.find((p) => p.rowKey === rowKey)
        ?.rowProperties ?? [];

    items.set(groupName, {
      ...existingValues,
      properties: [
        // remove existing property with same rowKey
        ...(existingValues as GroupedProperties).properties.filter(
          (p) => p.rowKey !== rowKey
        ),
        {
          rowKey: rowKey,
          rowProperties: [
            ...existingProperty,
            {
              label: label,
              value: <FormatProperty property={property} isSidebar />
            }
          ]
        }
      ]
    });
  });

  // take the above map and convert it to an array, and group by rowKey
  return Array.from(items.values()).sort((a, b) => {
    // sort alphabetically, by label
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
}
