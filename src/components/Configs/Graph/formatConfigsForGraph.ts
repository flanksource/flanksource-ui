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
            config: {
              ...config,
              // remove self-references
              related_ids: config.related_ids?.filter((id) => id !== config.id)
            }
          },
          expanded: false,
          // we don't know the children count yet
          childrenCount: 0
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
          configType: type
        },
        expanded: false,
        // we don't know the children count yet
        childrenCount: 0
      };

      configsMap.set(typeGroupNodeId, intermediaryNode);

      // Remove the children from the parent node and add the intermediary node
      const parentConfigNode = configsMap.get(config.id);
      if (parentConfigNode) {
        const relatedIdsWithoutChildren = parentConfigNode.related_ids
          ?.filter((id) => !children.map((c) => c.id).includes(id))
          // remove any children from the node that don't exist in the nodes
          .filter((id) => configsMap.has(id));

        configsMap.set(config.id, {
          ...parentConfigNode,
          related_ids: [...(relatedIdsWithoutChildren || []), typeGroupNodeId]
        });
      }
    });
  });

  const intermediaryNodesWithSameRelatedIDs = Array.from(configsMap.values())
    .filter((config) => config.data.type === "intermediary")
    .filter((config) => config.related_ids)
    .filter((config, _, self) => {
      if (config.related_ids) {
        const similarRelatedIds = self.filter(
          (c) =>
            config.related_ids!.length > 0 &&
            c.related_ids?.length === config.related_ids?.length &&
            c.related_ids?.every((id) => config.related_ids?.includes(id))
        );
        if (similarRelatedIds.length > 1) {
          return true;
        }
        return false;
      }
    })
    // group intermediary nodes with the same related_ids
    .reduce(
      (acc, config) => {
        const key = config.related_ids?.sort()?.join(",")!;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(config);
        return acc;
      },
      {} as Record<string, ConfigGraphNodes[]>
    );

  // Create a new intermediary node, a combination of all intermediary nodes
  // with same related ids
  Object.values(intermediaryNodesWithSameRelatedIDs).forEach(
    (intermediaryNodesToBeCombined) => {
      // Create a new intermediary node
      const combinedIntermediaryNode = {
        ...intermediaryNodesToBeCombined[0],
        nodeId: intermediaryNodesToBeCombined
          .map((n) => n.nodeId)
          .join("-combined-with-")
      } satisfies ConfigGraphNodes;

      // add the new intermediary node
      configsMap.set(combinedIntermediaryNode.nodeId, combinedIntermediaryNode);

      // remove the intermediary nodes
      intermediaryNodesToBeCombined.forEach((formerIntermediaryNode) => {
        // find the parent node,
        const parentID = Array.from(configsMap.values()).find((config) => {
          return config.related_ids?.includes(formerIntermediaryNode.nodeId);
        })?.nodeId;

        // update the parent node related_ids to include the new intermediary
        // node, while removing the old intermediary node
        const parentConfigNode = configsMap.get(parentID!);
        if (parentConfigNode) {
          const relatedIdsWithoutChildren =
            parentConfigNode.related_ids?.filter(
              (id) => id !== formerIntermediaryNode.nodeId
            );

          configsMap.set(parentID!, {
            ...parentConfigNode,
            related_ids: [
              ...(relatedIdsWithoutChildren || []),
              combinedIntermediaryNode.nodeId
            ]
          });
        }

        configsMap.delete(formerIntermediaryNode.nodeId);
      });
    }
  );

  return Array.from(configsMap.values());
}
