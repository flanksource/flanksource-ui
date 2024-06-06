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
        | "related_ids"
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
        | "related_ids"
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
    const e: Edge<ConfigGraphNodes>[] = [];
    configsForGraph.forEach((config) => {
      if (config.nodeType === "config") {
        config.config.related_ids?.forEach((related_id) => {
          e.push({
            id: `${config.config.id}-related-to-${related_id}`,
            source:
              config.config.direction === "incoming"
                ? config.config.id
                : related_id,
            target:
              config.config.direction === "incoming"
                ? related_id
                : config.config.id
          } satisfies Edge);
        });
      } else {
        e.push({
          id: `${config.id}-related-to-${config.related_id}`,
          source:
            config.direction === "incoming" ? config.id : config.related_id!,
          target:
            config.direction === "incoming" ? config.related_id! : config.id
        } satisfies Edge);
      }
    });
    return e;
  }, [configsForGraph]);

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
