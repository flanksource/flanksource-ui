import { useQuery } from "@tanstack/react-query";
import { getConfigsBy } from "../services/configs";
import { ConfigItem } from "../types/configs";

export const componentConfigRelationshipQueryKey = ({
  topologyId,
  configId,
  hideDeleted = true
}: {
  topologyId?: string;
  configId?: string;
  hideDeleted?: boolean;
}) => {
  if (topologyId) {
    return ["component", "config", "relationships", topologyId, hideDeleted];
  }
  return ["config", "relationships", configId, hideDeleted];
};

export function useComponentConfigRelationshipQuery({
  topologyId,
  configId,
  hideDeleted = true
}: {
  topologyId?: string;
  configId?: string;
  hideDeleted?: boolean;
}) {
  return useQuery(
    componentConfigRelationshipQueryKey({ topologyId, configId, hideDeleted }),
    () => {
      if (topologyId) {
        return getConfigsBy({ topologyId, hideDeleted })?.then((res) => {
          return res?.data?.map((item) => {
            return item.configs as ConfigItem;
          });
        });
      }
      if (configId) {
        return getConfigsBy({ configId, hideDeleted })?.then((res) => {
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
          items = items.sort((ent) => (ent.deleted_at ? 1 : -1));
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
