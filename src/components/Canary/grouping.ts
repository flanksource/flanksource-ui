import { HealthCheck } from "../../api/types/health";

// process table groupings, given a list of checks and a 'groupBy' object
export function getGroupedChecks(checks: HealthCheck[] = [], groupBy?: string) {
  if (
    groupBy === "name" ||
    groupBy === "description" ||
    groupBy === "canary_name"
  ) {
    const groupedChecks: Record<string, HealthCheck[]> = {};
    const groupNames: string[] = [];
    checks.forEach((check) => {
      const value = check[groupBy] || "(none)";
      if (groupNames.indexOf(value) === -1) {
        groupNames.push(value);
        groupedChecks[value] = [];
      }
      groupedChecks[value].push(check);
    });
    return groupedChecks;
  }

  const groupedChecks: Record<string, HealthCheck[]> = { Others: [] };
  const groupNames = ["Others"];
  checks.forEach((check) => {
    let hasValidGroup = false;
    let groupName: any;

    if (check.labels) {
      const labelKeys = Object.keys(check.labels);
      labelKeys.forEach((key) => {
        // if current item has a matching label with the currently selected groupBy
        if (key === groupBy) {
          hasValidGroup = true;
          groupName = check.labels[key];

          if (groupNames.indexOf(groupName) === -1) {
            groupNames.push(groupName);
            groupedChecks[groupName] = [];
          }
        }
      });
    }
    if (hasValidGroup) {
      groupedChecks[groupName!].push(check);
    } else {
      groupedChecks.Others.push(check);
    }
  });
  return groupedChecks;
}
