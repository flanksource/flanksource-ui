import { FeatureFlag } from "@flanksource-ui/services/permissions/permissionsService";

export type PropertyGroup = {
  name: string;
  properties: FeatureFlag[];
};

/**
 * Groups properties by their prefix.
 * Properties starting with "jobs." are grouped by "jobs.{JobName}".
 * Other properties are grouped by their first segment before a dot.
 */
export function groupPropertiesByPrefix(
  properties: FeatureFlag[]
): PropertyGroup[] {
  const groups = new Map<string, FeatureFlag[]>();

  properties.forEach((property) => {
    const parts = property.name.split(".");
    let groupName = parts[0];

    // For "jobs.JobName.property", group by "jobs.JobName"
    if (groupName === "jobs" && parts.length > 1) {
      groupName = `${parts[0]}.${parts[1]}`;
    }

    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }

    groups.get(groupName)!.push(property);
  });

  return Array.from(groups.entries())
    .map(([name, properties]) => ({
      name,
      properties: properties.sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Filters properties based on search term matching name, description, or value.
 */
export function filterProperties(
  properties: FeatureFlag[],
  searchTerm: string
): FeatureFlag[] {
  if (!searchTerm) {
    return properties;
  }

  const lowercaseSearch = searchTerm.toLowerCase();
  return properties.filter(
    (property) =>
      property.name.toLowerCase().includes(lowercaseSearch) ||
      property.description?.toLowerCase().includes(lowercaseSearch) ||
      property.value?.toLowerCase().includes(lowercaseSearch)
  );
}
