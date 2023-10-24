import { useQuery } from "@tanstack/react-query";
import { getConfigsBy } from "../services/configs";
import { ConfigItem } from "../types/configs";

export const componentConfigRelationshipQueryKey = ({
  topologyId,
  configId
}: {
  topologyId?: string;
  configId?: string;
}) => {
  if (topologyId) {
    return ["component", "config", "relationships", topologyId];
  }
  return ["config", "relationships", configId];
};

export function useComponentConfigRelationshipQuery({
  topologyId,
  configId
}: {
  topologyId?: string;
  configId?: string;
}) {
  return useQuery(
    componentConfigRelationshipQueryKey({ topologyId, configId }),
    () => {
      if (topologyId) {
        return getConfigsBy({ topologyId })?.then((res) => {
          return res?.data?.map((item) => {
            return item.configs as ConfigItem;
          });
        });
      }
      if (configId) {
        return getConfigsBy({ configId })?.then((res) => {
          let items: ConfigItem[] = [];
          res?.data?.forEach((item) => {
            const configs = item.configs as ConfigItem;
            const related = item.related as ConfigItem;
            if (configs && configs.id !== configId) {
              items.push(configs);
            }
            if (related && related.id !== configId) {
              items.push(related);
            }
          });
          items = items.sort((ent: ConfigItem) => (ent.deleted_at ? 1 : -1));
          return items;
        });
      }
      return Promise.resolve([]);
    },
    {
      enabled: !!topologyId || !!configId
    }
  );
}
