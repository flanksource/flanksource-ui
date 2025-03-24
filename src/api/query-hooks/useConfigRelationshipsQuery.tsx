import { ConfigRelationKey } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigRelationshipToggles";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getAConfigRelationships } from "../services/configs";
import { ConfigItem } from "../types/configs";
import { useShowDeletedConfigs } from "@flanksource-ui/store/preference.state";

export function useConfigRelationshipsQuery(id: string | undefined) {
  const [searchParams] = useSearchParams();
  const showDeletedConfigs = useShowDeletedConfigs();
  const tag = searchParams.get("tag") ?? undefined;
  const incoming = searchParams.get("incoming") === "true";
  const outgoing = searchParams.get("outgoing") === "true";
  const relation =
    searchParams.get(ConfigRelationKey) === "soft" ? "both" : "hard";
  const configTypes = searchParams.get("configTypes") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const health = searchParams.get("health") ?? undefined;

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
      showDeletedConfigs,
      tag,
      configTypes,
      relationshipType,
      relation,
      incoming,
      outgoing,
      status,
      health
    ],
    queryFn: () =>
      getAConfigRelationships({
        configId: id!,
        type_filter: relationshipType ?? "outgoing",
        configTypes: configTypes,
        hideDeleted: !showDeletedConfigs,
        relation: relation,
        status,
        health
      }),
    enabled: id !== undefined,
    keepPreviousData: true,
    select: (data) => transformConfigRelationships(data ?? [])
  });
}

export function useConfigHardParents(id: string) {
  return useQuery({
    queryKey: ["config", "relationships", id],
    queryFn: () =>
      getAConfigRelationships({
        configId: id!,
        type_filter: "incoming",
        hideDeleted: true,
        relation: "hard"
      }),
    enabled: id !== undefined,
    keepPreviousData: true,
    select: (data) => data ?? []
  });
}
