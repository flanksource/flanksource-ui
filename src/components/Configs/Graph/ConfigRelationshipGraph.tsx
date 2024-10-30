import { ConfigItem } from "@flanksource-ui/api/types/configs";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Edge, Node } from "reactflow";
import { useConfigGraphDirectionToggleValue } from "../ConfigsListFilters/ConfigGraphDirectionToggle";
import { prepareConfigsForGraph } from "./formatConfigsForGraph";

const RelationshipGraph = dynamic(
  () =>
    import("@flanksource-ui/ui/Graphs/RelationshipGraph").then(
      (mod) => mod.RelationshipGraph
    ),
  { ssr: false }
);

export type ConfigGraphNodes = {
  nodeId: string;
  related_ids?: string[];
  data:
    | {
        type: "config";
        config: Pick<
          ConfigItem,
          | "id"
          | "related_ids"
          | "type"
          | "health"
          | "deleted_at"
          | "name"
          | "status"
          | "tags"
          | "changes"
        >;
      }
    | {
        type: "intermediary";
        configType: string;
      };
  expanded?: boolean;
  expandable?: boolean;
  childrenCount: number;
};

type ConfigGraphProps = {
  configs: ConfigItem[];
};

export function ConfigRelationshipGraph({ configs }: ConfigGraphProps) {
  // Extract this to an outside function and write tests for it
  const configsForGraph = useMemo(
    () => prepareConfigsForGraph(configs),
    [configs]
  );

  const direction = useConfigGraphDirectionToggleValue();

  const edges: Edge<ConfigGraphNodes>[] = useMemo(() => {
    const e: Edge<ConfigGraphNodes>[] = [];
    configsForGraph.forEach((config) => {
      config.related_ids?.forEach((related_id) => {
        e.push({
          id: `${config.nodeId}-related-to-${related_id}`,
          source: config.nodeId,
          target: related_id
        } satisfies Edge);
      });
    });
    return e;
  }, [configsForGraph]);

  const nodes: Node<ConfigGraphNodes>[] = useMemo(() => {
    // break this down by config types
    return configsForGraph.map((config) => {
      return {
        id: `${config.nodeId}`,
        type: config.data.type === "config" ? "configNode" : "intermediaryNode",
        data: config,
        position: { x: 0, y: 0 }
      } satisfies Node<ConfigGraphNodes>;
    });
  }, [configsForGraph]);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <RelationshipGraph nodes={nodes} edges={edges} direction={direction} />
  );
}
