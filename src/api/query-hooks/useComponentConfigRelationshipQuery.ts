import { useQuery } from "@tanstack/react-query";
import { getConfigsBy } from "../services/configs";

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
    () => getConfigsBy({ topologyId, configId, hideDeleted }),
    {
      enabled: !!topologyId || !!configId
    }
  );
}
