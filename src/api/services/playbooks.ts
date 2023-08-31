import {
  NewPlaybookSpec,
  PlaybookSpec,
  UpdatePlaybookSpec
} from "../../components/Playbooks/Settings/PlaybookSpecsTable";
import { AVATAR_INFO } from "../../constants";
import { IncidentCommander } from "../axios";

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
