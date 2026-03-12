import { FeatureFlag } from "@flanksource-ui/services/permissions/permissionsService";

export type PropertyGroup = {
  name: string;
  properties: FeatureFlag[];
};

/**
 * Groups properties by their prefix (e.g., "jobs", "access.log", "db")
 * Properties are grouped by the first segment before a dot or by full name if no prefix
 */
export function groupPropertiesByPrefix(
  properties: FeatureFlag[]
): PropertyGroup[] {
  const groups = new Map<string, FeatureFlag[]>();

  properties.forEach((property) => {
    // Extract the first part of the property name as the group name
    const parts = property.name.split(".");
    let groupName = parts[0];

    // Special handling for "jobs." prefix to group by job name
    if (groupName === "jobs" && parts.length > 1) {
      // For "jobs.JobName.property", group by "jobs.JobName"
      groupName = `${parts[0]}.${parts[1]}`;
    }

    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }

    groups.get(groupName)!.push(property);
  });

  // Convert map to array and sort by group name
  return Array.from(groups.entries())
    .map(([name, properties]) => ({
      name,
      properties: properties.sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Filters properties based on search term
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
