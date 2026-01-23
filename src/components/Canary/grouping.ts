import { update } from "lodash";
import { HealthCheck } from "../../api/types/health";

// process table groupings, given a list of checks and a 'groupBy' object
export function getGroupedChecks(checks: HealthCheck[] = [], groupBy?: string) {
  if (
    groupBy === "description" ||
    groupBy === "canary_name" ||
    groupBy === "type"
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

  if (groupBy === "agent") {
    const groupedChecks: Record<string, HealthCheck[]> = {};
    const groupNames: string[] = [];
    checks.forEach((check) => {
      const agentName = check.agents?.name || "local";
      if (groupNames.indexOf(agentName) === -1) {
        groupNames.push(agentName);
        groupedChecks[agentName] = [];
      }
      groupedChecks[agentName].push(check);
    });
    return groupedChecks;
  }

  if (groupBy === "name") {
    // when grouping by name, we want to split name by /, and group each part
    const groupedChecks: Record<string, HealthCheck[]> = {};
    checks.forEach((check) => {
      const value = check[groupBy] || "(none)";
      if (!value.includes("/")) {
        update(groupedChecks, value, (current) => {
          if (!current) {
            return [check];
          }
          return [...current, check];
        });
        return;
      }
      const path = value.split("/")[0];
      update(groupedChecks, path, (current) => {
        const updatedCheck = {
          ...check,
          // if the name is a path, we want to show the last part of the path
          name: value.split("/").slice(1).join("/"),
          originalName: value
        };
        if (!current) {
          return [updatedCheck];
        }
        return [...current, updatedCheck];
      });
    });

    const normalizedGroupedChecks: Record<string, HealthCheck[]> = {};

    Object.entries(groupedChecks).forEach(([key, value]) => {
      // if there are multiple checks with the same name, we show the name with
      // the prefix of the path
      if (value.length > 1) {
        normalizedGroupedChecks[key] = value;
        return;
      }
      // if the name is a path, and there is only one check with that name, we
      // want to show the full name as it won't be grouped
      if ((value?.[0] as any)?.originalName?.includes("/")) {
        normalizedGroupedChecks[key] = value.map((check) => ({
          ...check,
          // replace the name with the full path
          name: (check as any).originalName
        }));
        return;
      }
      // if the name is not a path, we do nothing
      normalizedGroupedChecks[key] = value;
    });

    return normalizedGroupedChecks;
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
