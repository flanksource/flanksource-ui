import { Badge } from "../Badge";

export function Labels({ labels }) {
  if (labels == null) {
    return null;
  }
  const items = [];
  for (const k of labels) {
    if (labels[k] === "true") {
      items.push(
        <div key={`${k}`}>
          <Badge text={k} />{" "}
        </div>
      );
    } else {
      items.push(
        <div key={`${k}-${labels[k]}`}>
          <Badge text={`${k}: ${labels[k]}`} />{" "}
        </div>
      );
    }
  }
  return items;
}

export function getLabels(checks) {
  if (checks == null || typeof checks[Symbol.iterator] !== "function") {
    // eslint-disable-next-line no-console
    console.error("unknown check format", checks);
    return [];
  }
  const labelMap = {};
  for (const check of checks) {
    if (check.labels) {
      for (const check of checks) {
        if (check.labels) {
          for (const [key, value] of Object.entries(check.labels)) {
            const id = `canary:${key}:${value}`;
            labelMap[id] = {
              type: "canary",
              id,
              key,
              value,
              label: `${key}: ${value}`
            };
          }
        }
      }
    }
  }

  const labels = [];
  Object.values(labelMap).forEach((label) => {
    if (label.value === "true") {
      label.label = label.key;
    }
    labels.push(label);
  });
  return labels;
}
