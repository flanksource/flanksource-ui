import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { ConfigGraphNodes } from "./ConfigRelationshipGraph";

export function prepareConfigsForGraph(
  configs: Pick<
    ConfigItem,
    | "id"
    | "related_ids"
    | "type"
    | "health"
    | "deleted_at"
    | "name"
    | "status"
    | "tags"
  >[]
) {
  const configsMap = new Map<string, ConfigGraphNodes>(
    configs.map((config) => {
      return [
        config.id,
        {
          nodeId: config.id,
          related_ids: config.related_ids,
          data: {
            type: "config",
            config: config
          },
          expanded: false
        } satisfies ConfigGraphNodes
      ];
    })
  );

  /**
   * @Notes:
   * Relationship flows from parent to child, with related_ids being the
   * children of the parent.
   */
  configs.forEach((config) => {
    // First, we find the children of the current config
    const currentConfigsChildren = configs?.filter((c) =>
      config.related_ids?.includes(c.id)
    );

    // If only 1 child, we don't need to create an intermediary node
    if (currentConfigsChildren.length < 2) {
      return;
    }

    // Then, we group the children by their type, to create intermediary nodes
    const groupChildrenByConfigType = currentConfigsChildren.reduce(
      (acc, c) => {
        if (!acc[c.type]) {
          acc[c.type] = [];
        }
        acc[c.type].push(c);
        return acc;
      },
      {} as Record<string, ConfigItem[]>
    );

    // for each type, with more than 1 child, create an intermediary node
    Object.entries(groupChildrenByConfigType).forEach(([type, children]) => {
      // If there is less than 3 children, we don't need to create an intermediary
      if (children.length < 3) {
        return;
      }
      const typeGroupNodeId = `${config.id}-${type}-intermediary`;
      const intermediaryNode: ConfigGraphNodes = {
        nodeId: typeGroupNodeId,
        // The intermediary node should be related to the parent children, for
        // the type
        related_ids: children.map((c) => c.id),
        data: {
          type: "intermediary",
          numberOfConfigs: children.length,
          configType: type
        },
        expanded: false
      };

      configsMap.set(typeGroupNodeId, intermediaryNode);

      // Remove the children from the parent node and add the intermediary node
      const parentConfigNode = configsMap.get(config.id);
      if (parentConfigNode) {
        const relatedIdsWithoutChildren = parentConfigNode.related_ids?.filter(
          (id) => !children.map((c) => c.id).includes(id)
        );

        configsMap.set(config.id, {
          ...parentConfigNode,
          related_ids: [...(relatedIdsWithoutChildren || []), typeGroupNodeId]
        });
      }
    });
  });

  return Array.from(configsMap.values());
}
