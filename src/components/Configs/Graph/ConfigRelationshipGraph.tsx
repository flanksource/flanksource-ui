import {
  ConfigItem,
  ConfigRelationships
} from "@flanksource-ui/api/types/configs";
import { RelationshipGraph } from "@flanksource-ui/ui/Graphs/RelationshipGraph";
import { useMemo } from "react";
import { Edge, Node } from "reactflow";

export type ConfigGraphNodes =
  | {
      nodeType: "config";
      config: ConfigRelationships;
      expanded?: boolean;
    }
  | {
      direction: ConfigRelationships["direction"];
      id: string;
      related_id: string;
      configType: string;
      nodeType: "intermediary";
      configs: ConfigRelationships[];
      expanded?: boolean;
    };

export function checkIfConfigHasMoreThan3Siblings(
  configList: ConfigRelationships[],
  configItem: ConfigRelationships
) {
  return (
    configList.filter(
      (config) =>
        config.related_id === configItem.related_id &&
        config.direction === configItem.direction
    ).length > 3
  );
}

type ConfigGraphProps = {
  configs: ConfigRelationships[];
  currentConfig: ConfigItem;
};

export function ConfigRelationshipGraph({
  configs,
  currentConfig
}: ConfigGraphProps) {
  const configsForGraph = useMemo(() => {
    const transformedConfigs: ConfigGraphNodes[] = [];

    const allConfigs = [
      ...configs,
      {
        ...currentConfig
        // related_id: "3e3a9f54-ffdd-4151-baec-8a6cd7e44867"
      } as ConfigRelationships
    ];

    allConfigs.forEach((config) => {
      // if config is in the transformedConfigs, skip
      if (
        transformedConfigs.find(
          (node) => node.nodeType === "config" && node.config.id === config.id
        )
      ) {
        return;
      }

      // first, determine direct children of a config, based on direction
      // second, determine if a config has more than three children
      // if so, create an intermediary node, replace related_id with
      // intermediary node id
      const childrenConfigs = allConfigs.filter(
        (configItem) =>
          configItem.related_id === config.id &&
          configItem.direction === "outgoing"
      );

      if (childrenConfigs.length < 4) {
        // if there are less than three related configs, just push the current
        // config to the transformedConfigs
        if (!checkIfConfigHasMoreThan3Siblings(allConfigs, config)) {
          transformedConfigs.push({
            nodeType: "config",
            config: config
          } satisfies ConfigGraphNodes);
        }
      } else {
        childrenConfigs.forEach((child) => {
          const intermediaryNodeID = `${config.id}-${config.direction}-${child.type}`;

          // determine the number of children the config has
          const childrenConfigs = allConfigs.filter(
            (configItem) =>
              configItem.related_id === config.id &&
              configItem.direction === "outgoing" &&
              configItem.type === child.type
          );

          // if the config only has one child, push the child to the
          // transformedConfigs, no need to create an intermediary node
          if (childrenConfigs.length > 1) {
            if (
              !transformedConfigs.find(
                (node) =>
                  node.nodeType === "intermediary" &&
                  node.id === intermediaryNodeID
              )
            ) {
              // This is incorrect, we need to do this based on the child configs and
              // not the parent config
              transformedConfigs.push({
                nodeType: "intermediary",
                direction: config.direction!,
                // we need to create a unique id for the intermediary node, based on
                // the config id and type
                id: intermediaryNodeID,
                // for related_id, we need to use related_id, so can place the
                // intermediary node in between the related configs
                related_id: config.id!,
                configType: child.type!,
                configs: childrenConfigs.filter((c) => c.type === child.type)
              } satisfies ConfigGraphNodes);
            }

            // replace related_id with intermediary node id
            transformedConfigs.push({
              nodeType: "config",
              config: {
                ...child,
                related_id: intermediaryNodeID
              }
            });
          } else {
            // if there are less than three related configs, just push the current
            // config to the transformedConfigs
            transformedConfigs.push({
              nodeType: "config",
              config: child
            } satisfies ConfigGraphNodes);
          }
        });

        // push the current config
        transformedConfigs.push({
          nodeType: "config",
          config: {
            ...config,
            related_id: `${config.related_id}`
          }
        } satisfies ConfigGraphNodes);
      }
    });
    return transformedConfigs;
  }, [configs, currentConfig]);

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
