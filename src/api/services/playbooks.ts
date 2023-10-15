import { PlaybookRunWithActions } from "../../components/Playbooks/Runs/PlaybookRunsActions";
import { PlaybookRunAction } from "../../components/Playbooks/Runs/PlaybookRunsSidePanel";
import { SubmitPlaybookRunFormValues } from "../../components/Playbooks/Runs/SubmitPlaybookRunForm";
import {
  NewPlaybookSpec,
  PlaybookSpec,
  UpdatePlaybookSpec
} from "../../components/Playbooks/Settings/PlaybookSpecsTable";
import { AVATAR_INFO } from "../../constants";
import { ConfigDB, IncidentCommander, PlaybookAPI } from "../axios";
import { GetPlaybooksToRunParams } from "../query-hooks/playbooks";
import { resolve } from "../resolve";

export async function getAllPlaybooksSpecs() {
  const res = await IncidentCommander.get<PlaybookSpec[] | null>(
    `/playbooks?select=*,created_by(${AVATAR_INFO})&deleted_at=is.null&order=created_at.desc`
  );
  return res.data ?? [];
}

export async function getPlaybookSpec(id: string) {
  const res = await IncidentCommander.get<PlaybookSpec | null>(
    `/playbooks/${id},created_by(${AVATAR_INFO})`
  );
  return res.data ?? undefined;
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

export async function submitPlaybookRun(
  input: Omit<SubmitPlaybookRunFormValues, "playbook_spec">
) {
  const res = await PlaybookAPI.post("/run", input);
  return res.data;
}

export async function getPlaybookToRunForResource(
  params: GetPlaybooksToRunParams
) {
  const paramsString = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const res = await PlaybookAPI.get<PlaybookSpec[] | null>(
    `/list?${paramsString}`
  );
  return res.data ?? [];
}

export async function getPlaybookRun(id: string) {
  const res = await IncidentCommander.get<PlaybookRunWithActions[] | null>(
    `/playbook_runs?id=eq.${id}&select=*,created_by(${AVATAR_INFO}),playbooks(id,name),component:components(id,name,icon),actions:playbook_run_actions(*)`
  );
  return res.data?.[0] ?? undefined;
}

export async function getPlaybookRuns({
  componentId,
  configId,
  pageIndex,
  pageSize
}: {
  componentId?: string;
  configId?: string;
  pageIndex: number;
  pageSize: number;
}) {
  const componentParamString = componentId
    ? `&component_id=eq.${componentId}`
    : "";
  const configParamString = configId ? `&config_id=eq.${configId}` : "";

  const pagingParams = `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  const res = await resolve(
    ConfigDB.get<PlaybookRunAction[] | null>(
      `/playbook_runs?select=*,playbooks(id,name),component:components(id,name,icon),check:checks(id,name,icon),config:config_items(id,name,type,config_class)&order=created_at.desc${componentParamString}&${configParamString}${pagingParams}}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
  return res;
}
