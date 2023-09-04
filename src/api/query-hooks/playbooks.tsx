import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery
} from "@tanstack/react-query";
import { PlaybookSpec } from "../../components/Playbooks/Settings/PlaybookSpecsTable";
import {
  getAllPlaybooksSpecs,
  getPlaybookRun,
  getPlaybookSpec,
  submitPlaybookRun
} from "../services/playbooks";
import { SubmitPlaybookRunFormValues } from "../../components/Playbooks/Runs/SubmitPlaybookRunForm";

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

export type GetPlaybooksToRunParams = {
  component_id?: string;
  config_id?: string;
  check_id?: string;
};

export function useGetPlaybooksToRun(
  params: GetPlaybooksToRunParams,
  options: UseQueryOptions<PlaybookSpec[], Error> = {}
) {
  return useQuery<PlaybookSpec[], Error>(
    ["playbooks", "run", params],
    () => getPlaybookRun(params),
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

export function useSubmitPlaybookRunMutation(
  options: Omit<
    UseMutationOptions<any, Error, SubmitPlaybookRunFormValues>,
    "mutationFn"
  > = {}
) {
  return useMutation({
    mutationFn: async (
      input: Omit<SubmitPlaybookRunFormValues, "playbook_spec">
    ) => {
      return submitPlaybookRun(input);
    },
    ...options
  });
}
