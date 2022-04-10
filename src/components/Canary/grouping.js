// process table groupings, given a list of checks and a 'groupBy' object
export function getGroupedChecks(checks, groupBy) {
  if (
    groupBy === "name" ||
    groupBy === "description" ||
    groupBy === "canaryName"
  ) {
    const groupedChecks = {};
    const groupNames = [];
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
  const groupedChecks = { Others: [] };
  const groupNames = ["Others"];
  checks.forEach((check) => {
    let hasValidGroup = false;
    let groupName;

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
      groupedChecks[groupName].push(check);
    } else {
      groupedChecks.Others.push(check);
    }
  });
  return groupedChecks;
}
