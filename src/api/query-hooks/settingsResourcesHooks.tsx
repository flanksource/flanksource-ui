import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { useQuery } from "@tanstack/react-query";
import { SchemaApi } from "../../components/SchemaResourcePage/resourceTypes";
import {
  SchemaResourceWithJobStatus,
  getAll,
  getResource
} from "../schemaResources";

export function useGetSettingsAllQuery(resourceInfo: SchemaApi) {
  const [sortState] = useReactTableSortState();

  return useQuery<SchemaResourceWithJobStatus[], Error>(
    ["settings", "all", resourceInfo, sortState],
    async () => {
      const res = await getAll(resourceInfo, sortState);
      if (res.data.length === 0) {
        return [];
      }
      return res.data ?? [];
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
  return useQuery<Record<string, any>, Error>(
    ["settings", "details", resourceID, resourceInfo],
    async () => {
      const res = await getResource(resourceInfo, resourceID!);
      if (res?.data.length === 0) {
        return null;
      }
      return res?.data[0];
    },
    {
      enabled: !!resourceID,
      cacheTime: 0,
      staleTime: 0,
      keepPreviousData: false
    }
  );
}
