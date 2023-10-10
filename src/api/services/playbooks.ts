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
    `/playbooks?select=*,created_by(${AVATAR_INFO})&deleted_at=is.null`
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
    `/playbooks?id=eq.${spec.ID}`,
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

export async function getPlaybookRun(params: GetPlaybooksToRunParams) {
  const paramsString = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const res = await PlaybookAPI.get<PlaybookSpec[] | null>(
    `/list?${paramsString}`
  );
  return res.data ?? [];
}

export async function getPlaybookRuns(componentId?: string, configId?: string) {
  const componentParamString = componentId
    ? `&component_id=eq.${componentId}`
    : "";
  const configParamString = configId ? `&config_id=eq.${configId}` : "";

  const res = await resolve(
    ConfigDB.get<PlaybookRunAction[] | null>(
      `/playbook_runs?select=*,playbooks(id,name)&order=created_at.desc${componentParamString}&${configParamString}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
  return res;
}
