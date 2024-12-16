import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { RelationshipGraph } from "@flanksource-ui/ui/Graphs/RelationshipGraph";
import { useMemo } from "react";
import { Edge, Node } from "reactflow";
import { useConfigGraphDirectionToggleValue } from "../ConfigsListFilters/ConfigGraphDirectionToggle";
import { prepareConfigsForGraph } from "./formatConfigsForGraph";

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
  const configsForGraph = useMemo(
    () => prepareConfigsForGraph(configs),
    [configs]
  );

  const direction = useConfigGraphDirectionToggleValue();

  const edges: Edge<ConfigGraphNodes>[] = useMemo(() => {
    const nodeIDs = new Set(configsForGraph.map((c) => c.nodeId));
    const processedEdges = new Set<string>();

    return configsForGraph.flatMap((config) =>
      (config.related_ids ?? [])
        .filter(
          (related_id) =>
            nodeIDs.has(related_id) &&
            config.nodeId !== related_id &&
            !processedEdges.has(`${config.nodeId}-${related_id}`)
        )
        .map((related_id) => {
          const edgeKey = `${config.nodeId}-${related_id}`;
          processedEdges.add(edgeKey);

          return {
            id: `${config.nodeId}-related-to-${related_id}`,
            source: config.nodeId,
            target: related_id
          } satisfies Edge;
        })
    );
  }, [configsForGraph]);

  const nodes: Node<ConfigGraphNodes>[] = useMemo(
    () =>
      configsForGraph.map((config) => ({
        id: `${config.nodeId}`,
        type: config.data.type === "config" ? "configNode" : "intermediaryNode",
        data: config,
        position: { x: 0, y: 0 }
      })),
    [configsForGraph]
  );

  if (nodes.length === 0) {
    return null;
  }

  return (
    <RelationshipGraph nodes={nodes} edges={edges} direction={direction} />
  );
}
