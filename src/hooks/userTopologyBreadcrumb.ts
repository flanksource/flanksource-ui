import { useState, useEffect } from "react";
import { useComponentsQuery } from "../api/query-hooks";
import { Topology } from "../context/TopologyPageContext";
import { cacheUtil } from "../utils/cache";

export function useTopologyBreadcrumb({
  topologyId
}: {
  topologyId: string | undefined;
}) {
  const [queryEnabled, setQueryEnabled] = useState(false);
  const { data: components, isLoading } = useComponentsQuery({
    enabled: queryEnabled
  });

  const [pathTopology, setPathTopology] = useState<
    Pick<Topology, "text" | "name" | "id" | "icon">[]
  >([]);

  useEffect(() => {
    if (!topologyId || !components?.data?.length || !queryEnabled) {
      return;
    }
    const rootTopology = components.data.find(
      (item: Record<string, string>) => item.id === topologyId
    );
    const items: any[] = [];
    let ids =
      rootTopology?.path?.split(".").filter((v: string) => v.trim()) || [];
    ids = [...ids, topologyId];
    ids.forEach((id: string) => {
      const item = components.data.find(
        (v: Record<string, string>) => v.id === id
      );
      if (item) {
        items.push(item);
      }
    });
    setPathTopology(items);
    cacheUtil.set(topologyId, items);
  }, [topologyId, components, queryEnabled]);

  useEffect(() => {
    if (!topologyId) {
      setPathTopology([]);
    } else {
      const data = cacheUtil.get(topologyId);
      if (data && Array.isArray(data)) {
        setPathTopology(data);
      } else {
        setQueryEnabled(true);
      }
    }
  }, [topologyId]);

  return {
    pathTopology,
    isLoading
  };
}
