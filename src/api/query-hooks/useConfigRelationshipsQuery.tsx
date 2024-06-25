import { ConfigRelationKey } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigRelationshipToggles";
import { useHideDeletedConfigs } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getAConfigRelationships } from "../services/configs";
import { ConfigItem } from "../types/configs";

export default function useConfigRelationshipsQuery(id: string | undefined) {
  const [searchParams] = useSearchParams();
  const hideDeleted = useHideDeletedConfigs();
  const configType = searchParams.get("configType") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const incoming = searchParams.get("incoming") === "true";
  const outgoing = searchParams.get("outgoing") === "true";
  const relation =
    searchParams.get(ConfigRelationKey) === "soft" ? "both" : "hard";

  const relationshipType = useMemo(() => {
    const all = incoming && outgoing;
    if (all) {
      return "all";
    }
    if (incoming) {
      return "incoming";
    }
    if (outgoing) {
      return "outgoing";
    }
    return undefined;
  }, [incoming, outgoing]);

  const transformConfigRelationships = useCallback(
    (configs: ConfigItem[]) =>
      configs.filter((item) => {
        if (
          tag &&
          !(
            Object.entries(item.tags!).map(
              ([key, value]) => `${key}__:__${value}`
            ) ?? []
          )?.includes(tag)
        ) {
          return false;
        }
        return true;
      }),
    [tag]
  );

  return useQuery({
    // we add type and tag to the queryKey so that the query is re-executed when
    // the type or tag changes
    queryKey: [
      "config",
      "relationships",
      id,
      hideDeleted,
      tag,
      configType,
      relationshipType,
      relation,
      incoming,
      outgoing
    ],
    queryFn: () =>
      getAConfigRelationships({
        configId: id!,
        type_filter: relationshipType,
        configType: configType,
        hideDeleted: hideDeleted,
        relation: relation
      }),
    enabled: id !== undefined,
    keepPreviousData: true,
    select: (data) => transformConfigRelationships(data ?? [])
  });
}
