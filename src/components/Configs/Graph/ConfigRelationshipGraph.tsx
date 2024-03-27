import {
  ConfigItem,
  ConfigRelationships
} from "@flanksource-ui/api/types/configs";
import { RelationshipGraph } from "@flanksource-ui/ui/Graphs/RelationshipGraph";
import { useMemo } from "react";
import { Edge, Node } from "reactflow";

type ConfigGraphProps = {
  configs: ConfigRelationships[];
  currentConfig: ConfigItem;
};

export function ConfigRelationshipGraph({
  configs,
  currentConfig
}: ConfigGraphProps) {
  const edges: Edge<ConfigItem>[] = useMemo(() => {
    return configs
      .filter((config) => config.related_id !== undefined)
      .map(
        (config) =>
          ({
            id: `${config.id}-related-to-${config.related_id}`,
            source:
              config.direction === "incoming" ? config.id : config.related_id!,
            target:
              config.direction === "incoming" ? config.related_id! : config.id
          } satisfies Edge)
      );
  }, [configs]);

  const nodes: Node<ConfigItem>[] = useMemo(() => {
    return [
      {
        id: currentConfig.id,
        type: "configNode",
        data: currentConfig,
        position: { x: 0, y: 0 }
      } satisfies Node<ConfigItem>,
      ...configs.map(
        (config) =>
          ({
            id: config.id,
            type: "configNode",
            data: config,
            position: { x: 0, y: 0 }
          } satisfies Node<ConfigItem>)
      )
    ];
  }, [configs, currentConfig]);

  if (nodes.length === 0 || edges.length === 0) {
    return null;
  }

  return <RelationshipGraph nodes={nodes} edges={edges} />;
}
