import { orderBy, findIndex, forEach, isEmpty } from "lodash";
import { HealthCheck, HealthCheckLabels } from "../../types/healthChecks";
import { hasStringMatch } from "../../utils/common";

export function matchesLabel(
  check: HealthCheck,
  labels: HealthCheckLabels[]
): boolean {
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

export function isHealthy(check: HealthCheck): boolean {
  if (check.checkStatuses == null) {
    return false;
  }

  let passed = true;
  forEach(check.checkStatuses, (s) => {
    passed = passed && s.status;
  });
  return passed;
}

export function filterChecks(
  checks: HealthCheck[],
  hidePassing: boolean,
  labels: HealthCheckLabels[]
): HealthCheck[] {
  if (checks == null) {
    return [];
  }
  const orderedChecks = orderBy(checks, (a) => a.description);

  return orderedChecks.filter((check) => {
    if (hidePassing && isHealthy(check)) {
      return false;
    }
    if (!matchesLabel(check, labels)) {
      return false;
    }
    return true;
  });
}

export function labelIndex(
  selectedLabels: HealthCheckLabels[],
  label: HealthCheckLabels
): number {
  return findIndex(selectedLabels, (l) => l.id === label.id);
}

export function filterChecksByText(
  checks: HealthCheck[] | undefined,
  textQuery: string
): HealthCheck[] {
  if (checks == null) {
    return [];
  }
  if (isEmpty(textQuery)) {
    return checks;
  }
  const text = textQuery.toLowerCase();
  const filtered = [...checks].filter((check) => {
    const match =
      hasStringMatch(text, check.description?.toLowerCase()) ||
      hasStringMatch(text, check.canary_name?.toLowerCase()) ||
      hasStringMatch(text, check.endpoint?.toLowerCase()) ||
      hasStringMatch(text, check.name?.toLowerCase());
    return match;
  });
  return filtered;
}
