import { isEmpty } from "lodash";
import { decodeUrlSearchParams } from "../url";
import { isPlainObject } from "../../../lib/isPlainObject";
import {
  defaultPivotSelections,
  getLabelsFromState
} from "../../Dropdown/lib/lists";
import { getLabelKeys } from "../labels";

const pivotCellDefaults = new Map([
  ["checkStatuses", null],
  ["latency", null],
  ["uptime", null]
]);

export function getDefaultForm(labels, incoming = {}) {
  const initialLabelState = initialiseLabelState(labels, incoming);

  return {
    layout: "table",
    groupBy: "canary_name",
    tabBy: "namespace",
    pivotBy: "none",
    pivotLabel: "",
    timeRange: "1h",
    pivotCellType: "checkStatuses",
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
  const {
    layout,
    tabBy,
    groupBy,
    hidePassing,
    labels,
    pivotBy,
    pivotLabel,
    pivotCellType,
    timeRange
  } = decodeUrlSearchParams(url);
  const canaryState = {
    timeRange,
    ...(layout != null && typeof layout === "string" && { layout }),
    ...(tabBy != null && typeof groupBy === "string" && { tabBy }),
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    ...(groupBy != null && typeof groupBy === "string" && { groupBy }),
    ...(pivotBy != null && typeof pivotBy === "string" && { pivotBy }),
    ...(pivotCellType != null &&
      typeof pivotCellType === "string" && { pivotCellType }),
    ...(pivotLabel != null && typeof pivotLabel === "string" && { pivotLabel }),
    ...(isPlainObject(labels) && {
      labels: { ...labels }
    })
  };
  return { canaryState };
}

export function initialiseFormState(defaultValues, url) {
  const {
    layout,
    tabBy,
    groupBy,
    pivotBy,
    pivotLabel,
    hidePassing,
    pivotCellType,
    timeRange,
    labels: decodedLabels = {},
    ...rest
  } = decodeUrlSearchParams(url);

  const pivotByDefaults = new Map(
    Object.keys(defaultPivotSelections).map((k) => [k, null])
  );

  const newLabelState =
    Object.keys(defaultValues.labels).length === 0
      ? initialiseLabelState(decodedLabels, decodedLabels)
      : initialiseLabelState(defaultValues.labels, decodedLabels);

  const labelsFromState = getLabelsFromState(newLabelState);
  const labelEntries = Object.entries(labelsFromState.all);
  const nonBooleanlabelEntries = Object.entries(labelsFromState.nonBoolean);

  const groupByDefaults = new Map([
    ["no-group", null],
    ["description", null],
    ["name", null],
    ...labelEntries
  ]);

  const pivotLabelDefaults = new Map([...nonBooleanlabelEntries]);

  const tabByDefaults = new Map([
    ["namespace", null],
    ...Object.entries(getLabelKeys(defaultValues.labels))
  ]);

  const [first] = nonBooleanlabelEntries;
  const [firstLabel] = first ?? [];

  const groupByValueOrDefault = groupByDefaults.has(groupBy) ? groupBy : "name";
  const tabByValueOrDefault = tabByDefaults.has(tabBy) ? tabBy : "namespace";
  const pivotByValueOrDefault = pivotByDefaults.has(pivotBy) ? pivotBy : "none";
  const pivotCellTypeValueOrDefault = pivotCellDefaults.has(pivotCellType)
    ? pivotCellType
    : "checkStatuses";
  const pivotLabelValueOrDefault = pivotLabelDefaults.has(pivotLabel)
    ? pivotLabel
    : (firstLabel ?? "");

  const formState = {
    ...defaultValues,
    ...(layout != null && typeof layout === "string" && { layout }),
    tabBy: tabByValueOrDefault,
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    groupBy: groupByValueOrDefault,
    pivotBy: pivotByValueOrDefault,
    pivotLabel: pivotLabelValueOrDefault,
    pivotCellType: pivotCellTypeValueOrDefault,
    labels: newLabelState,
    timeRange:
      isEmpty(timeRange) || timeRange === "undefined" ? "1h" : timeRange
  };
  return { formState, fullState: { ...rest, ...formState } };
}

export function updateFormState(update, url, labels) {
  const {
    layout,
    timeRange,
    tabBy,
    groupBy,
    pivotBy,
    pivotLabel,
    hidePassing,
    pivotCellType,
    labels: updateLabels = {}
  } = update;
  const { labels: decodedLabels = {}, ...rest } = decodeUrlSearchParams(url);
  const incoming = { ...decodedLabels, ...updateLabels };
  const newLabels = initialiseLabelState(labels, incoming);

  const pivotByDefaults = new Map(
    Object.keys(defaultPivotSelections).map((k) => [k, null])
  );
  const labelsFromState = getLabelsFromState(newLabels);
  const labelEntries = Object.entries(labelsFromState.all);
  const nonBooleanlabelEntries = Object.entries(labelsFromState.nonBoolean);

  const pivotLabelDefaults = new Map([...nonBooleanlabelEntries]);

  const groupByDefaults = new Map([
    ["no-group", null],
    ["description", null],
    ["name", null],
    ...labelEntries
  ]);

  const tabByDefaults = new Map([
    ["namespace", null],
    ...Object.entries(labels).map((label) => [label[1].key, null])
  ]);

  const [first] = nonBooleanlabelEntries;
  const [firstLabel] = first ?? [];

  const groupByValueOrDefault = groupByDefaults.has(groupBy) ? groupBy : "name";
  const tabByValueOrDefault = tabByDefaults.has(tabBy) ? tabBy : "namespace";
  const pivotByValueOrDefault = pivotByDefaults.has(pivotBy) ? pivotBy : "none";
  const pivotLabelValueOrDefault = pivotLabelDefaults.has(pivotLabel)
    ? pivotLabel
    : (firstLabel ?? "");
  const pivotCellTypeValueOrDefault = pivotCellDefaults.has(pivotCellType)
    ? pivotCellType
    : "checkStatuses";

  const formState = {
    ...rest,
    ...(layout != null && typeof layout === "string" && { layout }),
    tabBy: tabByValueOrDefault,
    ...(hidePassing != null &&
      typeof hidePassing === "boolean" && { hidePassing }),
    groupBy: groupByValueOrDefault,
    pivotBy: pivotByValueOrDefault,
    pivotLabel: pivotLabelValueOrDefault,
    pivotCellType: pivotCellTypeValueOrDefault,
    labels: newLabels,
    timeRange:
      isEmpty(timeRange) || timeRange === "undefined" ? "1h" : timeRange
  };
  return { formState };
}
