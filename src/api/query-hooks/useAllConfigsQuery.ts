import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { defaultStaleTime, prepareConfigListQuery } from ".";
import { getAllConfigsMatchingQuery } from "../services/configs";
import { useShowDeletedConfigs } from "@flanksource-ui/store/preference.state";

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

  const showDeletedConfigs = useShowDeletedConfigs();
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
        showDeletedConfigs,
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
      showDeletedConfigs,
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
      showDeletedConfigs,
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
