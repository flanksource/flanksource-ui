import { ConfigItem } from "../../../../api/types/configs";
type GroupedProperties = {
  type: "GROUPED";
  label: string;
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
    label: string;
    value: React.ReactNode;
  }[];
};

export type PropertyItem = GroupedProperties | SingleProperty;

export function formatConfigTags(config?: Pick<ConfigItem, "tags">) {
  if (!config?.tags) {
    return [];
  }

  const items = new Map<string, PropertyItem>();
  const tags = Object.assign({}, config.tags);

  delete tags["name"];
  delete tags["Name"];

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

  Object.entries(tags).forEach(([key, value]) => {
    if (key.split(/[:/]/).length === 1) {
      const rowKey = rowKeysMaps.get(key) ?? key;

      const existingValues = items.get(rowKey);

      items.set(rowKey, {
        type: "SINGLE",
        label: rowKey,
        rowKey: rowKey,
        properties: [
          ...((existingValues as SingleProperty)?.properties ?? []),
          {
            label: key,
            value: value
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

    const groupName = key.split(/[:/]/)[0];
    const name = key.split(/[:/]/).slice(1).join("/");

    const existingValues = (items.get(groupName) as GroupedProperties) ?? {
      type: "GROUPED",
      label: groupName,
      groupName,
      properties: []
    };

    const label = name;

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
              value: value
            }
          ]
        }
      ]
    });
  });

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
