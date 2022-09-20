import { CardSize, CardWidth } from "../TopologyCard";

type ValueType = number | string | Date;

type TopologyProperty = {
  name?: string;
  headline?: boolean;
  value?: ValueType;
  unit?: string;
};

export type Topology = {
  id: string;
  name: string;
  type?: string;
  updated_at?: string;
  properties?: TopologyProperty[];
};

export const defaultSortLabels = [
  { id: 1, value: "status", label: "Health" },
  { id: 2, value: "name", label: "Name" },
  { id: 3, value: "type", label: "Type" },
  { id: 4, value: "updated_at", label: "Last Updated" }
];

export function getSortLabels(topology: any[]) {
  const currentSortLabels: typeof defaultSortLabels = [];

  topology?.forEach((t) => {
    t?.properties?.forEach((h, index) => {
      if (h.headline && !currentSortLabels.find((t) => t.value === h.name)) {
        currentSortLabels.push({
          id: defaultSortLabels.length + index,
          value: h.name.toLowerCase(),
          label: h.name
        });
      }
    });
  });

  return [...defaultSortLabels, ...currentSortLabels];
}

function getValue(t: Topology, sortBy: string) {
  if (Boolean(t[sortBy])) {
    return t[sortBy] as ValueType;
  }

  const property = t?.properties?.find((p) => p.name === sortBy);
  if (property) {
    return property.value as ValueType;
  }

  return undefined;
}

function isDate(dateString?: ValueType) {
  if (
    !dateString ||
    dateString === null ||
    !["string", "object"].includes(typeof dateString)
  ) {
    return false;
  }

  return !isNaN(new Date(dateString).getDate());
}

const STATUS = {
  info: 0,
  healthy: 1,
  warning: 2,
  unhealthy: 3
};

export function getSortedTopology(
  topology: Topology[] = [],
  sortBy: string,
  sortByType: string
) {
  const topologyMap = new Map(topology.map((p) => [p.id, p]));

  let updatedTopology = [...topologyMap.values()].sort((t1, t2) => {
    let t1Value = getValue(t1, sortBy);
    let t2Value = getValue(t2, sortBy);

    if (t1Value && (!t2Value || t2Value === null)) {
      return 1;
    }
    if (t2Value && (!t1Value || t1Value === null)) {
      return -1;
    }

    if (isDate(t1Value) && isDate(t2Value)) {
      return (
        new Date(t1Value as string).getDate() -
        new Date(t2Value as string).getDate()
      );
    }

    if (sortBy === "status") {
      t1Value = STATUS[t1Value];
      t2Value = STATUS[t2Value];
    }

    if (t1Value && t2Value) {
      return +(t1Value > t2Value) || -(t1Value < t2Value);
    }

    return 0;
  });

  if (sortByType === "desc") {
    return updatedTopology.reverse();
  }

  return updatedTopology;
}

export function getCardWidth() {
  let value: any = localStorage.getItem("topology_card_width");

  if (!value?.trim()) {
    return CardWidth[CardSize.extra_large];
  }

  value = parseInt(value, 10);
  if (isNaN(value)) {
    return CardWidth[CardSize.extra_large];
  } else {
    return `${value}px`;
  }
}
