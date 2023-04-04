import { useQuery } from "@tanstack/react-query";
import { SchemaApi } from "../../components/SchemaResourcePage/resourceTypes";
import { getAll, getResource } from "../schemaResources";

export function useGetSettingsAllQuery(resourceInfo: SchemaApi) {
  return useQuery(
    ["settings", "all", resourceInfo],
    async () => {
      const res = await getAll(resourceInfo);
      return res.data;
    },
    {
      cacheTime: 0,
      staleTime: 0
    }
  );
}

export function useGetSettingsResourceDetails(
  resourceInfo: SchemaApi,
  resourceID?: string
) {
  return useQuery(
    ["settings", "details", resourceID, resourceInfo],
    async () => {
      const res = await getResource(resourceInfo, resourceID!);
      return res?.data[0];
    },
    {
      enabled: !!resourceID,
      cacheTime: 0,
      staleTime: 0
    }
  );
}
