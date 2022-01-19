import { isNil, forEach } from "lodash";

export function getLabels(checks) {
  if (checks == null || typeof checks[Symbol.iterator] !== "function") {
    // eslint-disable-next-line no-console
    return {};
  }
  const labelMap = {};
  for (const check of checks) {
    if (check.labels) {
      for (const [key, value] of Object.entries(check.labels)) {
        const id = `canary:${key}:${value}`;
        labelMap[id] = {
          type: "canary",
          id,
          key,
          value,
          label: value === "true" ? key : `${key}: ${value}`
        };
      }
    }
  }
  return labelMap;
}

export function getLabelFilters(stateful = {}, labels) {
  const labelLen = Object.keys(labels).length;
  const filters = Object.entries(stateful).reduce(
    (acc, [k, v]) => {
      const exInsert = acc.exclude.length;
      const inInsert = acc.include.length;
      if (labelLen > 0 && labels[k] == null) {
        return acc;
      }

      if (v === -1) {
        acc.exclude[exInsert] = k;
      }
      if (v === 1) {
        acc.include[inInsert] = k;
      }

      return acc;
    },
    {
      exclude: [],
      include: []
    }
  );
  return filters;
}

export const getLabelKeys = (labels) =>
  Array.from([
    ...new Set(
      Object.keys(labels).map((label) => label.match(/(?<=:)(.*?)(?=:)/g)[0])
    )
  ]).reduce((acc, k) => {
    acc[k] = null;
    return acc;
  }, {});

// filter checks based on exclusion/inclusion label filters
// exclusion has a higher priority, and is considered prior to inclusion
export function filterChecksByLabels(checks, labelFilters) {
  const excludedLabels = labelFilters.exclude;
  const includedLabels = labelFilters.include;

  const filtered = checks.reduce((acc, check) => {
    if (excludedLabels.length === 0 && includedLabels.length === 0) {
      acc[check.key] = check;
      return acc;
    }

    if ("labels" in check === false && includedLabels.length > 0) {
      // "labels: null" cannot be included
      return acc;
    }

    if ("labels" in check === false && includedLabels.length === 0) {
      // "labels: null" cannot be excluded
      acc[check.key] = check;
      return acc;
    }

    if (
      "labels" in check &&
      Object.keys(check.labels).length === 0 &&
      includedLabels.length === 0
    ) {
      // "labels: {}" cannot be excluded
      acc[check.key] = check;
      return acc;
    }

    if (
      "labels" in check &&
      Object.keys(check.labels).length > 0 &&
      includedLabels.length >= 0
    ) {
      const { hasExclusion, hasInclusion } = Object.entries(
        check.labels
      ).reduce(
        (accum, [k, v]) => {
          if (accum.hasExclusion === true) {
            return accum;
          }

          const id = `canary:${k}:${v}`;

          if (
            excludedLabels.length > 0 &&
            excludedLabels.includes(id) === true
          ) {
            accum.hasExclusion = true;
            return accum;
          }

          if (
            includedLabels.length > 0 &&
            includedLabels.includes(id) === true
          ) {
            accum.hasInclusion = true;
            return accum;
          }
          return accum;
        },
        { hasExclusion: false, hasInclusion: false }
      );
      if (hasInclusion && hasExclusion === false) {
        acc[check.key] = check;
      }
      if (includedLabels.length === 0 && hasExclusion === false) {
        acc[check.key] = check;
      }
    }

    return acc;
  }, {});
  return filtered;
}

// filter labels based on the currently available checks
// (only include labels present in current checks list)
export function getFilteredLabelsByChecks(checks, allLabels) {
  const checkLabels = {};
  checks.forEach((check) => {
    if (isNil(check.labels)) {
      return;
    }
    forEach(check.labels, (v, k) => {
      const id = `canary:${k}:${v}`;
      checkLabels[id] = allLabels[id];
    });
  });
  return checkLabels;
}
