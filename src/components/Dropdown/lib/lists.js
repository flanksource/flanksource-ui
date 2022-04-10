import { BiLabel } from "react-icons/bi";
import { ImUngroup } from "react-icons/im";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { isBooleanValue } from "../../../lib/isBooleanValue";

export function getLabelsFromState(labelState) {
  return Object.keys(labelState).reduce(
    (acc, fullLabel) => {
      const start = new RegExp("^([^:]*:)");
      const end = new RegExp("(:[^:]*)$");
      const value = new RegExp("([^:]*)$");
      const label = fullLabel.replace(start, "").replace(end, "");
      const [labelValue] = value.exec(fullLabel);
      // Need to decide here what kinds of values are representations of bools.
      // The loose comparison may be too permissive.
      if (isBooleanValue(labelValue) === false) {
        acc.nonBoolean[label] = labelValue ?? null;
      }
      acc.all[label] = labelValue ?? null;
      return acc;
    },
    { all: {}, nonBoolean: {} }
  );
}

// provide a list of group selections that includes (non-boolean) labels, given a list of checks.
export function getLabelSelections(
  checks,
  defaultSelections = {},
  icon = <BiLabel />
) {
  const nonBooleanLabels = getNonBooleanLabels(Object.values(checks));
  const newLabelSelections = defaultSelections;

  const uniqueLabels = [
    ...new Set(Object.values(nonBooleanLabels).map((o) => o.key))
  ];
  uniqueLabels.sort().forEach((label) => {
    const onlyAlphabets = label.replace(/[^a-zA-Z]/g, "");
    newLabelSelections[label] = {
      id: label,
      name: onlyAlphabets,
      icon,
      description: label,
      value: label,
      labelValue: label,
      key: label
    };
  });
  return newLabelSelections;
}

export const defaultPivotSelections = {
  none: {
    id: "none",
    name: "none",
    icon: <ImUngroup />,
    description: "None",
    value: "none",
    labelValue: null,
    key: "none"
  },
  labels: {
    id: "labels",
    name: "labels",
    icon: <BiLabel />,
    description: "Labels",
    value: "labels",
    labelValue: null,
    key: "labels"
  },
  namespace: {
    id: "namespace",
    name: "namespace",
    icon: <TiSortAlphabeticallyOutline />,
    description: "Namespace",
    value: "namespace",
    labelValue: null,
    key: "namespace"
  }
};

export const defaultTabSelections = {
  namespace: {
    id: "namespace",
    name: "namespace",
    icon: <TiSortAlphabeticallyOutline />,
    description: "Namespace",
    value: "namespace",
    labelValue: null,
    key: "namespace"
  }
};

export const defaultCellTypeSelections = {
  uptime: {
    id: "uptime",
    name: "uptime",
    icon: <ImUngroup />,
    description: "Uptime",
    value: "uptime",
    labelValue: null,
    key: "uptime"
  },
  checkStatuses: {
    id: "checkStatuses",
    name: "checkStatuses",
    icon: <ImUngroup />,
    description: "Health",
    value: "checkStatuses",
    labelValue: null,
    key: "checkStatuses"
  },
  latency: {
    id: "latency",
    name: "latency",
    icon: <ImUngroup />,
    description: "Latency",
    value: "latency",
    labelValue: null,
    key: "latency"
  }
};

export function getNonBooleanLabels(checks) {
  const nonBooleanLabels = checks.reduce((acc, check) => {
    if (
      check &&
      typeof check !== "string" &&
      "labels" in check &&
      check.labels !== null
    ) {
      const labels = Object.entries(check.labels).reduce((accum, [k, v]) => {
        const id = `canary:${k}:${v}`;
        if (typeof v === "boolean" || v === "true" || v === "false") {
          return accum;
        }
        accum[id] = { key: k, value: v };
        return accum;
      }, {});
      return { ...acc, ...labels };
    }
    return acc;
  }, {});
  return nonBooleanLabels;
}

export function getUniqueNonBooleanLabelKeys(checks) {
  const nonBooleanLabels = getNonBooleanLabels(Object.values(checks));
  const uniqueLabels = new Set(
    Object.values(nonBooleanLabels).map((o) => o.key)
  );
  const uniqueLabelsWithValues = Array.from(uniqueLabels).reduce((acc, k) => {
    acc[k] = Object.entries(nonBooleanLabels)
      .filter((label) => label[1].key === k)
      .map((label) => label[1].value);
    return acc;
  }, {});
  return uniqueLabelsWithValues;
}

// provide a list of tab selections that includes (non-boolean) labels, given a list of checks.
export function getTabSelections(checks, defaultTabSelections) {
  const uniqueLabelKeys = getUniqueNonBooleanLabelKeys(checks);
  const newTabSelections = defaultTabSelections;

  Object.entries(uniqueLabelKeys)
    .sort((a, b) => (b[0] > a[0] ? -1 : 1))
    .forEach((o) => {
      const k = o[0];
      const onlyAlphabets = k.replace(/[^a-zA-Z]/g, "");
      newTabSelections[k] = {
        id: k,
        name: onlyAlphabets,
        icon: <BiLabel />,
        description: k,
        value: k,
        labelValue: k,
        key: k
      };
    });
  return newTabSelections;
}

export function getBooleanLabels(checks) {
  const booleanLabels = checks.reduce((acc, check) => {
    if (
      check &&
      typeof check !== "string" &&
      "labels" in check &&
      check.labels !== null
    ) {
      const labels = Object.entries(check.labels).reduce((accum, [k, v]) => {
        const id = `canary:${k}:${v}`;
        if (!(typeof v === "boolean" || v === "true" || v === "false")) {
          return accum;
        }
        accum[id] = { key: k, value: v };
        return accum;
      }, {});
      return { ...acc, ...labels };
    }
    return acc;
  }, {});
  return booleanLabels;
}
