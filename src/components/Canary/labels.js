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

// filter checks based on exclusion/inclusion label filters
// exclusion has a higher priority, and is considered prior to inclusion
export function filterChecksByLabels(checks, labelFilters) {
  const newChecks = [];
  const excludedLabels = labelFilters.exclude;
  const includedLabels = labelFilters.include;
  checks.forEach((check) => {
    let included = true; // initialized as true
    if (check.labels) {
      const currentLabels = Object.keys(check.labels);

      // exclusion step
      currentLabels.forEach((label) => {
        // if current label exists in excluded labels, dont include this check
        if (excludedLabels.indexOf(label) >= 0) {
          included = false;
        }
      });

      // inclusion step. Only considered if 'includedLabels' is not empty.
      if (includedLabels.length > 0) {
        let inclusionPass = false;
        // if a label is found to be in 'includedLabels', pass the inclusion check
        currentLabels.forEach((label) => {
          if (includedLabels.indexOf(label) >= 0) {
            inclusionPass = true;
          }
        });
        // if this check already passes the exclusion check, apply results of inclusion check
        if (included) {
          included = inclusionPass;
        }
      }
    } else if (includedLabels.length > 0) {
      // do not include checks with null labels if 'includedLabels' are not empty
      included = false;
    }
    // push current check into result array if included.
    if (included) {
      newChecks.push(check);
    }
  });
  return newChecks;
}
