import { ConfigItem } from "../../../../api/types/configs";
import { Link } from "react-router-dom";
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

type Parent = {
  id: string;
  name: string;
  type: string;
};

export function formatConfigLabels(
  config?: Pick<ConfigItem, "labels">,
  parents?: Parent[]
) {
  if (!config?.labels && (!parents || parents.length === 0)) {
    return [];
  }

  const items = new Map<string, PropertyItem>();
  const tags = Object.assign({}, config?.labels || {});

  if (parents && parents.length > 0) {
    // Any labels with the key will overshadow the labels whose name are in the values
    // Example: if availabilityzone is present, then zone should be hidden
    const overrides: Record<string, string[]> = {
      availabilityzone: ["zone"],
      vpc: ["network"]
    };

    for (const p of parents) {
      // Get the last section after splitting by "::"
      const typeKey = p.type.split("::").pop()?.toLowerCase() || p.type;

      if (overrides[typeKey]) {
        overrides[typeKey].forEach((key) => {
          delete tags[key];
        });
      }
    }
  }

  // Transform parents into the same format as labels
  const parentUrls = new Map<string, string>();
  if (parents && parents.length > 0) {
    const parentsMap: Record<string, string> = {};

    parents.forEach((parent) => {
      if (parent.type && parent.name) {
        // Get the last section after splitting by "::"
        const typeKey =
          parent.type.split("::").pop()?.toLowerCase() || parent.type;
        parentsMap[typeKey] = parent.name;
        parentUrls.set(typeKey, `/catalog/${parent.id}`);
      }
    });

    // Filter out parents that are already in tags/labels
    const existingTagKeys = new Set(Object.keys(tags));

    Object.entries(parentsMap).forEach(([key, value]) => {
      if (!existingTagKeys.has(key)) {
        tags[key] = value;
      }
    });
  }

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
            value: parentUrls.has(key) ? (
              <Link
                to={parentUrls.get(key)!}
                className="text-blue-500 hover:underline"
              >
                {value}
              </Link>
            ) : (
              value
            )
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
              value: parentUrls.has(key) ? (
                <Link
                  to={parentUrls.get(key)!}
                  className="text-blue-500 hover:underline"
                >
                  {value}
                </Link>
              ) : (
                value
              )
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
