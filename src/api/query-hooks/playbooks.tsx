import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { PlaybookSpec } from "../../components/Playbooks/Settings/PlaybookSpecsTable";
import { getAllPlaybooksSpecs, getPlaybookSpec } from "../services/playbooks";

export function useGetAllPlaybookSpecs(
  options: UseQueryOptions<PlaybookSpec[], Error> = {}
) {
  return useQuery<PlaybookSpec[], Error>(
    ["playbooks", "all"],
    getAllPlaybooksSpecs,
    {
      cacheTime: 0,
      staleTime: 0,
      ...options
    }
  );
}

export function useGetPlaybookSpecsDetails(id: string) {
  return useQuery<Record<string, any>, Error>(
    ["playbooks", "settings", "specs", id],
    async () => getPlaybookSpec(id),
    {
      enabled: !!id,
      cacheTime: 0,
      staleTime: 0,
      keepPreviousData: false
    }
  );
}
