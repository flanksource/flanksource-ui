import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { RelationshipGraph } from "@flanksource-ui/ui/Graphs/RelationshipGraph";
import { useMemo } from "react";
import { Edge, Node } from "reactflow";
import { useConfigGraphDirectionToggleValue } from "../ConfigsListFilters/ConfigGraphDirectionToggle";
import { prepareConfigsForGraph } from "./formatConfigsForGraph";

export type ConfigGraphNodes =
  | {
      nodeType: "config";
      config: Pick<
        ConfigItem,
        | "id"
        | "related_ids"
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
      id: string;
      related_id: string;
      configType: string;
      nodeType: "intermediary";
      configs: Pick<
        ConfigItem,
        | "id"
        | "related_ids"
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
  configs: ConfigItem[];
  currentConfig: ConfigItem;
};

export function ConfigRelationshipGraph({
  configs,
  currentConfig
}: ConfigGraphProps) {
  // Extract this to an outside function and write tests for it
  const configsForGraph = useMemo(
    () => prepareConfigsForGraph(configs),
    [configs]
  );

  const direction = useConfigGraphDirectionToggleValue();

  const edges: Edge<ConfigGraphNodes>[] = useMemo(() => {
    const e: Edge<ConfigGraphNodes>[] = [];
    configsForGraph.forEach((config) => {
      if (config.nodeType === "config") {
        config.config.related_ids?.forEach((related_id) => {
          e.push({
            id: `${config.config.id}-related-to-${related_id}`,
            source: config.config.id,
            target: related_id
          } satisfies Edge);
        });
      } else {
        e.push({
          id: `${config.id}-related-to-${config.related_id}`,
          source: config.id,
          target: config.related_id
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

  return (
    <RelationshipGraph nodes={nodes} edges={edges} direction={direction} />
  );
}
