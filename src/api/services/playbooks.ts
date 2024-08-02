import { SubmitPlaybookRunFormValues } from "@flanksource-ui/components/Playbooks/Runs/Submit/SubmitPlaybookRunForm";
import { AVATAR_INFO } from "@flanksource-ui/constants";
import { ConfigDB, IncidentCommander, PlaybookAPI } from "../axios";
import { GetPlaybooksToRunParams } from "../query-hooks/playbooks";
import { resolve } from "../resolve";
import {
  NewPlaybookSpec,
  PlaybookNames,
  PlaybookParam,
  PlaybookRun,
  PlaybookRunAction,
  PlaybookRunWithActions,
  PlaybookSpec,
  RunnablePlaybook,
  UpdatePlaybookSpec
} from "../types/playbooks";

export async function getAllPlaybooksSpecs() {
  const res = await IncidentCommander.get<PlaybookSpec[] | null>(
    `/playbooks?select=*,created_by(${AVATAR_INFO})&deleted_at=is.null&order=created_at.desc`
  );
  return res.data ?? [];
}

export async function getAllPlaybookNames() {
  const res = await IncidentCommander.get<PlaybookNames[] | null>(
    `/playbook_names?select=id,name,icon,category&order=name.asc`
  );
  return res.data ?? [];
}

export async function getPlaybookSpec(id: string) {
  const res = await IncidentCommander.get<PlaybookSpec[] | null>(
    `/playbooks?id=eq.${id}&select=*,created_by(${AVATAR_INFO})`
  );
  return res.data?.[0] ?? undefined;
}

export async function getPlaybookSpecsByIDs(ids: string[]) {
  const res = await IncidentCommander.get<
    Pick<PlaybookSpec, "id" | "spec">[] | null
  >(`/playbooks?id=in.(${ids.join(",")})&select=id,spec`);
  return res.data ?? [];
}
export async function createPlaybookSpec(spec: NewPlaybookSpec) {
  const res = await IncidentCommander.post<PlaybookSpec>("/playbooks", spec);
  return res.data;
}

export async function updatePlaybookSpec(spec: UpdatePlaybookSpec) {
  const res = await IncidentCommander.patch<PlaybookSpec>(
    `/playbooks?id=eq.${spec.id}`,
    spec
  );
  return res.data;
}

export async function deletePlaybookSpec(id: string) {
  const res = await IncidentCommander.patch<PlaybookSpec>(
    `/playbooks?id=eq.${id}`,
    {
      deleted_at: "now()"
    }
  );
  return res.data;
}

export type PlaybookRunResponse = {
  run_id: string;
  starts_at: string;
};

export async function submitPlaybookRun(
  input: Omit<SubmitPlaybookRunFormValues, "playbook_spec">
) {
  const res = await PlaybookAPI.post<PlaybookRunResponse>("/run", input);
  return res.data;
}

export async function getPlaybookToRunForResource(
  params: GetPlaybooksToRunParams
) {
  const paramsString = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const res = await PlaybookAPI.get<RunnablePlaybook[] | null>(
    `/list?${paramsString}`
  );
  return res.data ?? [];
}

export async function getPlaybookRun(id: string) {
  const res = await IncidentCommander.get<PlaybookRunWithActions[] | null>(
    // todo: use playbook names instead
    `/playbook_runs?id=eq.${id}&select=*,created_by(${AVATAR_INFO}),playbooks(id,name,spec),component:components(id,name,icon),config:config_items(id,name,type,config_class),check:checks(id,name,icon)`
  );

  const resActions = await IncidentCommander.get<PlaybookRunAction[] | null>(
    `/playbook_run_actions?select=id,name,status,start_time,end_time,scheduled_time&order=start_time.asc&playbook_run_id=eq.${id}`
  );

  const actions = resActions.data ?? [];

  if (res.data?.[0] === undefined) {
    return undefined;
  }
  return {
    ...res.data?.[0],
    actions
  } satisfies PlaybookRunWithActions;
}

export async function getPlaybookRunActionById(id: string) {
  const res = await IncidentCommander.get<PlaybookRunAction[] | null>(
    `/playbook_run_actions?id=eq.${id}&select=*`
  );
  return res.data?.[0] ?? undefined;
}

type getPlaybookParamsParams = {
  playbookId: string;
  component_id?: string;
  config_id?: string;
  check_id?: string;
};

export async function getPlaybookParams({
  playbookId,
  component_id,
  config_id,
  check_id
}: getPlaybookParamsParams) {
  const res = await PlaybookAPI.post<{
    params: PlaybookParam[];
  } | null>(`/${playbookId}/params`, {
    id: playbookId,
    ...(component_id && { component_id }),
    ...(config_id && { config_id }),
    ...(check_id && { check_id })
  });
  return res.data;
}

export async function getPlaybookRuns({
  componentId,
  configId,
  pageIndex,
  pageSize,
  playbookId,
  status,
  starts,
  ends
}: {
  componentId?: string;
  configId?: string;
  pageIndex: number;
  pageSize: number;
  playbookId?: string;
  status?: string;
  starts?: string;
  ends?: string;
}) {
  const componentParamString = componentId
    ? `&component_id=eq.${componentId}`
    : "";

  const configParamString = configId ? `&config_id=eq.${configId}` : "";

  const statusParamString = status ? `&status=eq.${status}` : "";

  const pagingParams = `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  const dateFilter =
    starts && ends
      ? `&and=(start_time.gte.${starts},start_time.lte.${ends})`
      : "";

  const playbookParamsString = playbookId
    ? `&playbook_id=eq.${playbookId}`
    : "";

  const res = await resolve(
    ConfigDB.get<PlaybookRun[] | null>(
      `/playbook_runs?select=*,playbooks(id,name,spec,icon),component:components(id,name,icon),check:checks(id,name,icon),config:config_items(id,name,type,config_class)&&order=created_at.desc${playbookParamsString}${componentParamString}&${configParamString}${pagingParams}${statusParamString}${dateFilter}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
  return res;
}
