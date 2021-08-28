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

// function to get an array of labels that isnt "true or calse"
export function getNonBooleanLabels(checks) {
  const nonBooleanLabels = [];
  checks.forEach((check) => {
    if (check.labels) {
      const labelKeys = Object.keys(check.labels);
      labelKeys.forEach((key) => {
        const val = check.labels[key];
        // push new label to non-boolean-labels array if it doesnt exist yet
        if (
          val !== "true" &&
          val !== "false" &&
          nonBooleanLabels.indexOf(key) === -1
        ) {
          nonBooleanLabels.push(key);
        }
      });
    }
  });
  return nonBooleanLabels;
}
