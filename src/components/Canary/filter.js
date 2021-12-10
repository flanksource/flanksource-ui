import { orderBy, findIndex, forEach } from "lodash";

export function matchesLabel(check, labels) {
  if (labels.length === 0) {
    return true;
  }
  for (const label of labels) {
    if (label.type === "canary") {
      if (check.labels == null) {
        return true;
      }
      if (check.labels[label.key] === label.value) {
        return true;
      }
    } else {
      return true;
    }
  }
  return false;
}

export function isHealthy(check) {
  if (check.checkStatuses == null) {
    return false;
  }

  let passed = true;
  forEach(check.checkStatuses, (s) => {
    passed = passed && s.status;
  });
  return passed;
}

export function filterChecks(checks, hidePassing, labels) {
  const filtered = [];
  if (checks == null) {
    return filtered;
  }
  checks = orderBy(checks, (a) => a.description);
  for (const check of checks) {
    if (hidePassing && isHealthy(check)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!matchesLabel(check, labels)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    filtered.push(check);
  }
  return filtered;
}

export function labelIndex(selectedLabels, label) {
  return findIndex(selectedLabels, (l) => l.id === label.id);
}

export function hasStringMatch(pattern, text) {
  return text.indexOf(pattern) >= 0;
}

export function filterChecksByText(checks, textQuery) {
  if (checks == null) {
    return [];
  }
  const text = textQuery.toLowerCase();
  const filtered = [...checks].filter((check) => {
    const match =
      hasStringMatch(text, check.description.toLowerCase()) ||
      hasStringMatch(text, check.canaryName.toLowerCase()) ||
      hasStringMatch(text, check.endpoint.toLowerCase());
    return match;
  });
  return filtered;
}
