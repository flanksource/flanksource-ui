import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery
} from "@tanstack/react-query";
import { SubmitPlaybookRunFormValues } from "../../components/Playbooks/Runs/Submit/SubmitPlaybookRunForm";
import {
  getAllPlaybooksSpecs,
  getPlaybookSpec,
  getPlaybookToRunForResource,
  submitPlaybookRun
} from "../services/playbooks";
import { PlaybookSpec, RunnablePlaybook } from "../types/playbooks";

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
  options: UseQueryOptions<RunnablePlaybook[], Error> = {}
) {
  return useQuery<RunnablePlaybook[], Error>(
    ["playbooks", "run", params],
    () => getPlaybookToRunForResource(params),
    {
      cacheTime: 0,
      staleTime: 0,
      enabled:
        // if any of the params are undefined, don't run the query
        params.check_id !== undefined ||
        params.component_id !== undefined ||
        params.config_id !== undefined,
      ...options
    }
  );
}

export function useGetPlaybookSpecsDetails(
  id: string,
  options: UseQueryOptions<PlaybookSpec | undefined, Error> = {}
) {
  return useQuery<PlaybookSpec | undefined, Error>(
    ["playbooks", "settings", "specs", id],
    async () => getPlaybookSpec(id),
    {
      enabled: !!id,
      cacheTime: 0,
      staleTime: 0,
      keepPreviousData: false,
      ...options
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
