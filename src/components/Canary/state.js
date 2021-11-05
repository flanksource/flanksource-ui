import { decodeUrlSearchParams } from "./url";
import { isPlainObject } from "../../lib/isPlainObject";
import { defaultGroupSelections } from "./grouping";
import { defaultTabSelections } from "../Dropdown/TabByDropdown";
import { getGroupByLabels, getLabelKeys } from "./labels";

export function getDefaultForm(labels, incoming = {}) {
  const initialLabelState = initialiseLabelState(labels, incoming);

  return {
    layout: "table",
    groupBy: defaultGroupSelections.name.name,
    tabBy: defaultTabSelections.namespace.name,
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
  const { layout, tabBy, groupBy, hidePassing, labels } =
    decodeUrlSearchParams(url);
  const canaryState = {
    ...(layout != null && typeof layout === "string" && { layout }),
    ...(tabBy != null && typeof groupBy === "string" && { tabBy }),
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    ...(groupBy != null && typeof groupBy === "string" && { groupBy }),
    ...(isPlainObject(labels) && {
      labels: { ...labels }
    })
  };
  return { canaryState };
}

export function initialiseFormState(defaultValues, url, savedFormState) {
  const decodedUrlSearchParams = decodeUrlSearchParams(url);
  const initialFormState = { ...savedFormState, ...decodedUrlSearchParams };
  const {
    layout,
    tabBy,
    groupBy,
    hidePassing,
    labels: decodedLabels = {},
    ...rest
  } = initialFormState;

  const newLabelState =
    Object.keys(defaultValues.labels).length === 0
      ? initialiseLabelState(decodedLabels, decodedLabels)
      : initialiseLabelState(defaultValues.labels, decodedLabels);

  const groupByDefaults = new Map([
    ["no-group", null],
    ["description", null],
    ["name", null],
    ...Object.entries(getGroupByLabels(newLabelState))
  ]);

  const tabByDefaults = new Map([
    ["namespace", null],
    ...Object.entries(getLabelKeys(defaultValues.labels))
  ]);

  const groupByValueOrDefault = groupByDefaults.has(groupBy) ? groupBy : "name";
  const tabByValueOrDefault = tabByDefaults.has(tabBy) ? tabBy : "namespace";

  const formState = {
    ...defaultValues,
    ...(layout != null && typeof layout === "string" && { layout }),
    tabBy: tabByValueOrDefault,
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    groupBy: groupByValueOrDefault,
    labels: newLabelState
  };
  return { formState, fullState: { ...rest, ...formState } };
}

export function updateFormState(update, url, labels) {
  const {
    layout,
    tabBy,
    groupBy,
    hidePassing,
    labels: updateLabels = {}
  } = update;
  const { labels: decodedLabels = {}, ...rest } = decodeUrlSearchParams(url);
  const incoming = { ...decodedLabels, ...updateLabels };
  const newLabels = initialiseLabelState(labels, incoming);

  const groupByDefaults = new Map([
    ["no-group", null],
    ["description", null],
    ["name", null],
    ...Object.entries(getGroupByLabels(newLabels))
  ]);

  const tabByDefaults = new Map([
    ["namespace", null],
    ...Object.entries(labels).map((label) => [label[1].key, null])
  ]);

  const groupByValueOrDefault = groupByDefaults.has(groupBy) ? groupBy : "name";
  const tabByValueOrDefault = tabByDefaults.has(tabBy) ? tabBy : "namespace";

  const formState = {
    ...rest,
    ...(layout != null && typeof layout === "string" && { layout }),
    tabBy: tabByValueOrDefault,
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    groupBy: groupByValueOrDefault,
    labels: newLabels
  };
  return { formState };
}
