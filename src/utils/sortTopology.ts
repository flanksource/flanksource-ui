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

function getValue(t: Topology, sortBy: string) {
  return Boolean(t[sortBy])
    ? t[sortBy]
    : t?.properties?.find((p) => Boolean(p[sortBy]))
    ? t?.properties?.find((p) => p[sortBy])?.[sortBy]
    : undefined;
}

function isDate(dateString: ValueType) {
  return !isNaN(new Date(dateString).getDate());
}

// NOTE: We implement sort within client instead of requesting th API cause the topology is not paged
export function getSortedTopology(
  topology: Topology[] = [],
  sortBy: string,
  sortByType: string
) {
  const topologyMap = new Map(topology.map((p) => [p.id, p]));

  let updatedTopology = [...topologyMap.values()].sort((t1, t2) => {
    let t1Value: ValueType = getValue(t1, sortBy);
    let t2Value: ValueType = getValue(t2, sortBy);

    if (!t1Value && !t2Value) {
      return 0;
    }
    if (t1Value && !t2Value) {
      return 1;
    }
    if (t2Value && !t1Value) {
      return -1;
    }

    if (isDate(t1Value) && isDate(t2Value)) {
      return new Date(t1Value).getDate() - new Date(t2Value).getDate();
    }

    return +(t1Value > t2Value) || -(t1Value < t2Value);
  });

  if (sortByType === "DESC") {
    return updatedTopology.reverse();
  }

  return updatedTopology;
}
