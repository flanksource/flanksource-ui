import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery
} from "@tanstack/react-query";
import { SubmitPlaybookRunFormValues } from "../../components/Playbooks/Runs/Submit/SubmitPlaybookRunForm";
import {
  getAllPlaybookNames,
  getPlaybookSpec,
  getPlaybookSpecsByIDs,
  getPlaybookToRunForResource,
  submitPlaybookRun
} from "../services/playbooks";
import {
  PlaybookNames,
  PlaybookSpec,
  RunnablePlaybook
} from "../types/playbooks";

export function useGetAllPlaybookSpecs(
  options: UseQueryOptions<PlaybookNames[], Error> = {}
) {
  return useQuery<PlaybookNames[], Error>(
    ["playbooks", "all"],
    getAllPlaybookNames,
    {
      cacheTime: 0,
      staleTime: 0,
      ...options
    }
  );
}

export function useGetPlaybookNames(
  options: UseQueryOptions<PlaybookNames[], Error> = {}
) {
  return useQuery<PlaybookNames[], Error>({
    queryKey: ["playbooks", "names"],
    queryFn: getAllPlaybookNames,
    cacheTime: 0,
    staleTime: 0,
    ...options
  });
}

export type GetPlaybooksToRunParams = {
  component_id?: string;
  config_id?: string;
  check_id?: string;
};

export function useGetPlaybooksToRun(
  params: GetPlaybooksToRunParams,
  options: UseQueryOptions<
    (RunnablePlaybook & {
      spec: any;
    })[],
    Error
  > = {}
) {
  return useQuery<
    (RunnablePlaybook & {
      spec: any;
    })[],
    Error
  >(
    ["playbooks", "run", params],
    async () => {
      const res = await getPlaybookToRunForResource(params);
      const ids = res.map((playbook) => playbook.id);
      // this is a bit of a hack, but we need to get the specs because that's
      // where the icon is stored
      const specs = await getPlaybookSpecsByIDs(ids);
      return res.map((playbook) => ({
        ...playbook,
        spec: specs.find((spec) => spec.id === playbook.id)!.spec
      })) as (RunnablePlaybook & {
        spec: any;
      })[];
    },
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
    UseMutationOptions<
      {
        run_id: string;
        starts_at: string;
      },
      Error,
      SubmitPlaybookRunFormValues
    >,
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
