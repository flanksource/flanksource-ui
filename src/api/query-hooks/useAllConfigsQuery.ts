import { useHideDeletedConfigs } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { defaultStaleTime, prepareConfigListQuery } from ".";
import {
  getAllConfigsMatchingQuery,
  getConfigsTagsAndLabelsKeys
} from "../services/configs";

export const useAllConfigsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  const [searchParams] = useSearchParams({
    sortBy: "type",
    sortOrder: "asc",
    groupBy: "type"
  });

  const hideDeletedConfigs = useHideDeletedConfigs();
  const search = searchParams.get("search") ?? undefined;
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");
  const configType = searchParams.get("configType") ?? undefined;
  const labels = searchParams.get("labels") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const health = searchParams.get("health") ?? undefined;
  const { pageIndex, pageSize } = useReactTablePaginationState();

  const query = useMemo(
    () =>
      prepareConfigListQuery({
        search,
        configType,
        sortBy,
        sortOrder,
        hideDeletedConfigs,
        includeAgents: true,
        labels: labels,
        health,
        status,
        pageIndex,
        pageSize
      }),
    [
      search,
      configType,
      sortBy,
      sortOrder,
      hideDeletedConfigs,
      labels,
      health,
      status,
      pageIndex,
      pageSize
    ]
  );

  return useQuery(
    [
      "allConfigs",
      search,
      configType,
      sortBy,
      sortOrder,
      hideDeletedConfigs,
      true,
      labels,
      health,
      status,
      pageIndex,
      pageSize
    ],
    () => {
      return getAllConfigsMatchingQuery(query);
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};

export function useGetAllConfigTagsAndLabels() {
  return useQuery<{ key: string }[], Error>(
    ["config_tags_labels_keys"],
    async () => {
      const response = await getConfigsTagsAndLabelsKeys();
      return response ?? [];
    }
  );
}
