import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { ConfigGraphNodes } from "./ConfigRelationshipGraph";

export function checkIfConfigHasMoreThan3Siblings(
  configList: ConfigItem[],
  configItem: ConfigItem
) {
  return (
    configList.filter((config) => {
      let relatedIdExistsInBoth = false;
      config.related_ids?.forEach((relatedId) => {
        relatedIdExistsInBoth =
          configItem.related_ids?.includes(relatedId) ?? false;
      });
      return relatedIdExistsInBoth;
    }).length > 3
  );
}

export function shouldCreateRootIntermediaryNode(
  configList: ConfigItem[],
  configItem: ConfigItem
) {
  const types = configList
    .filter((config) => config.related_ids?.includes(configItem.id))
    .reduce((acc, config) => {
      acc.add(config.type);
      return acc;
    }, new Set<string | undefined>());

  return types.size > 1;
}

export function prepareConfigsForGraph(configs: ConfigItem[]) {
  const transformedConfigs: ConfigGraphNodes[] = [];

  const allConfigs = [...configs];

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
    const childrenConfigs = allConfigs.filter((configItem) =>
      configItem.related_ids?.includes(config.id)
    );

    if (childrenConfigs.length < 4) {
      // if there are less than three related configs, just push the current
      // config to the transformedConfigs
      if (!checkIfConfigHasMoreThan3Siblings(allConfigs, config)) {
        transformedConfigs.push({
          nodeType: "config",
          config: config as ConfigItem
        } satisfies ConfigGraphNodes);
      }
    } else {
      // When a root config can have multiple children of the same type
      // and we need to create an intermediary node to connect the children to
      // the root config
      const createRootIntermediaryNode = shouldCreateRootIntermediaryNode(
        allConfigs,
        config
      );
      // if it's a root config, we need to create an intermediary node that
      // the 3+ children will connect to
      const rootConfigIntermediaryNodeID = createRootIntermediaryNode
        ? `${config.id}-root-intermediary`
        : undefined;

      if (rootConfigIntermediaryNodeID) {
        transformedConfigs.push({
          nodeType: "intermediary",
          id: rootConfigIntermediaryNodeID,
          related_id: config.id,
          configType: config.type!,
          configs: childrenConfigs as ConfigItem[]
        } satisfies ConfigGraphNodes);
      }

      childrenConfigs.forEach((child) => {
        const intermediaryNodeID = `${config.id}-root-${child.type}`;

        // determine the number of children the config has, based on the type
        const siblingsConfigByType = allConfigs.filter(
          (configItem) =>
            configItem.related_ids?.includes(config.id) &&
            configItem.type === child.type
        );

        // if the config only has one child, push the child to the
        // transformedConfigs, no need to create an intermediary node
        if (siblingsConfigByType.length > 1) {
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
              // we need to create a unique id for the intermediary node, based on
              // the config id and type
              id: intermediaryNodeID,
              // for related_id, we need to use related_id, so can place the
              // intermediary node in between the related configs
              related_id: rootConfigIntermediaryNodeID ?? config.id!,
              configType: child.type!,
              configs: siblingsConfigByType.filter(
                (c) => c.type === child.type
              ) as ConfigItem[]
            } satisfies ConfigGraphNodes);
          }

          // replace related_id with intermediary node id
          transformedConfigs.push({
            nodeType: "config",
            config: {
              ...(child as ConfigItem),
              related_ids: [intermediaryNodeID]
            }
          });
        } else {
          // if there are less than three related configs, just push the current
          // config to the transformedConfigs
          transformedConfigs.push({
            nodeType: "config",
            config: {
              ...(child as ConfigItem),
              related_ids: [rootConfigIntermediaryNodeID ?? config.id]
            }
          } satisfies ConfigGraphNodes);
        }
      });
    }
  });
  return transformedConfigs;
}
