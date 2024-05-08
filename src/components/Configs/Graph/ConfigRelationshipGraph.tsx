import {
  ConfigItem,
  ConfigRelationships
} from "@flanksource-ui/api/types/configs";
import { RelationshipGraph } from "@flanksource-ui/ui/Graphs/RelationshipGraph";
import { useMemo } from "react";
import { Edge, Node } from "reactflow";
import { prepareConfigsForGraph } from "./formatConfigsForGraph";

export type ConfigGraphNodes =
  | {
      nodeType: "config";
      config: Pick<
        ConfigRelationships,
        | "id"
        | "related_id"
        | "direction"
        | "type"
        | "name"
        | "status"
        | "health"
        | "deleted_at"
        | "tags"
      >;
      expanded?: boolean;
    }
  | {
      direction: ConfigRelationships["direction"];
      id: string;
      related_id: string;
      configType: string;
      nodeType: "intermediary";
      configs: Pick<
        ConfigRelationships,
        | "id"
        | "related_id"
        | "direction"
        | "type"
        | "name"
        | "status"
        | "health"
        | "deleted_at"
        | "tags"
      >[];
      expanded?: boolean;
    };

type ConfigGraphProps = {
  configs: ConfigRelationships[];
  currentConfig: ConfigItem;
};

export function ConfigRelationshipGraph({
  configs,
  currentConfig
}: ConfigGraphProps) {
  // Extract this to an outside function and write tests for it
  const configsForGraph = useMemo(
    () => prepareConfigsForGraph(configs, currentConfig),
    [configs, currentConfig]
  );

  const edges: Edge<ConfigGraphNodes>[] = useMemo(() => {
    return configsForGraph.map((config) => {
      if (config.nodeType === "config") {
        return {
          id: `${config.config.id}-related-to-${config.config.related_id}`,
          source:
            config.config.direction === "incoming"
              ? config.config.id
              : config.config.related_id!,
          target:
            config.config.direction === "incoming"
              ? config.config.related_id!
              : config.config.id
        } satisfies Edge;
      }

      return {
        id: `${config.id}-related-to-${config.related_id}`,
        source:
          config.direction === "incoming" ? config.id : config.related_id!,
        target: config.direction === "incoming" ? config.related_id! : config.id
      } satisfies Edge;
    });
  }, [configsForGraph]);

  console.log("configsForGraph", JSON.stringify(configsForGraph, null, 2));

  const nodes: Node<ConfigGraphNodes>[] = useMemo(() => {
    // break this down by config types
    return configsForGraph.map((config) => {
      if (config.nodeType === "config") {
        return {
          id: config.config.id,
          type: "configNode",
          data: config,
          position: { x: 0, y: 0 }
        } satisfies Node<ConfigGraphNodes>;
      }
      return {
        id: `${config.id}`,
        type: "intermediaryNode",
        data: config,
        position: { x: 0, y: 0 }
      } satisfies Node<ConfigGraphNodes>;
    });
  }, [configsForGraph]);

  if (nodes.length === 0 || edges.length === 0) {
    return null;
  }

  return <RelationshipGraph nodes={nodes} edges={edges} />;
}
