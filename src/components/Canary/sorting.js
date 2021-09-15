import { aggregate, getAggregatedGroupedChecks } from "./aggregate";

export const sortValues = ["none", "asc", "desc"];

export const getHealthPercentageScore = (check) => {
  if (check.checkStatuses && check.checkStatuses.length > 0) {
    let positives = 0;
    check.checkStatuses.forEach((statusObj) => {
      if (statusObj.status) {
        positives += 1;
      }
    });
    return positives / check.checkStatuses.length;
  }
  return 0;
};

export const getUptimeScore = (check) => {
  const { uptime } = check;
  let score = uptime.passed / (uptime.passed + uptime.failed);
  if (Number.isNaN(score)) {
    score = 0;
  }
  return score;
};

export const getLatency = (check) => {
  const { latency } = check;
  if (latency && latency.rolling1h) {
    return latency.rolling1h;
  }
  return Number.POSITIVE_INFINITY;
};

// sorting functions for each of the columns
export const sortingFunctions = {
  check: (a, b) =>
    a.description === b.description
      ? 0
      : a.description > b.description
      ? 1
      : -1,
  health: (a, b) => getHealthPercentageScore(b) - getHealthPercentageScore(a),
  uptime: (a, b) => getUptimeScore(b) - getUptimeScore(a),
  latency: (a, b) => getLatency(a) - getLatency(b)
};

// sort checks based on a column's sorting function
export const sortChecks = (checks, sortFunc, sortDirection) => {
  let newChecks = [...checks];
  newChecks = newChecks.sort(sortingFunctions[sortFunc]);
  if (sortDirection === "desc") {
    newChecks = newChecks.reverse();
  }
  return newChecks;
};

// sorts aggregated groupedChecks based on a sorting function
// returns a sorted string array (of group key names).
export const sortGroupedChecks = (groupedChecks, sortFunc, sortDirection) => {
  let aggregated = getAggregatedGroupedChecks(groupedChecks);
  // perform sorting based on aggregated values
  aggregated = aggregated.sort(sortingFunctions[sortFunc]);
  let sortedKeys = aggregated.map((group) => group.groupKey);
  if (sortDirection === "desc") {
    sortedKeys = sortedKeys.reverse();
  }
  return sortedKeys;
};
