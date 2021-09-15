import { decodeUrlSearchParams } from "./url";
import { isPlainObject } from "../../lib/isPlainObject";
import { defaultGroupSelections } from "./grouping";

export function getDefaultForm(labels, incoming = {}) {
  const initialLabelState = initialiseLabelState(labels, incoming);

  return {
    layout: "table",
    groupBy: defaultGroupSelections["no-group"].name,
    hidePassing: true,
    labels: { ...initialLabelState }
  };
}

export function initialiseLabelState(labelMap, incoming) {
  return Object.entries(labelMap).reduce((acc, [k]) => {
    acc[k] = incoming[k] ?? 0;
    return acc;
  }, {});
}

export function readCanaryState(url) {
  const { layout, groupBy, hidePassing, labels } = decodeUrlSearchParams(url);
  const canaryState = {
    ...(layout != null && typeof layout === "string" && { layout }),
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    ...(groupBy != null && typeof groupBy === "string" && { groupBy }),
    ...(isPlainObject(labels) && {
      labels: { ...labels }
    })
  };
  return { canaryState };
}

export function initialiseFormState(defaultValues, url) {
  const {
    layout,
    groupBy,
    hidePassing,
    labels: decodedLabels = {},
    ...rest
  } = decodeUrlSearchParams(url);

  const newLabelState =
    Object.keys(defaultValues.labels).length === 0
      ? initialiseLabelState(decodedLabels, decodedLabels)
      : initialiseLabelState(defaultValues.labels, decodedLabels);

  const groupByDefaults = new Map([
    ["description", null],
    ["name", null],
    ...Object.entries(newLabelState)
  ]);

  const groupByValueOrDefault = groupByDefaults.has(groupBy)
    ? groupBy
    : "no-group";

  const formState = {
    ...defaultValues,
    ...(layout != null && typeof layout === "string" && { layout }),
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    groupBy: groupByValueOrDefault,
    labels: newLabelState
  };
  return { formState, fullState: { ...rest, ...formState } };
}

export function updateFormState(update, url, labels) {
  const { layout, groupBy, hidePassing, labels: updateLabels = {} } = update;
  const { labels: decodedLabels = {}, ...rest } = decodeUrlSearchParams(url);
  const incoming = { ...decodedLabels, ...updateLabels };
  const newLabels = initialiseLabelState(labels, incoming);

  const groupByDefaults = new Map([
    ["description", null],
    ["name", null],
    ...Object.entries(newLabels)
  ]);

  const groupByValueOrDefault = groupByDefaults.has(groupBy)
    ? groupBy
    : "no-group";

  const formState = {
    ...rest,
    ...(layout != null && typeof layout === "string" && { layout }),
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    groupBy: groupByValueOrDefault,
    labels: newLabels
  };
  return { formState };
}
