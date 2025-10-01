import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { PermissionsSummary, PermissionTable } from "../types/permissions";

export type FetchPermissionsInput = {
  componentId?: string;
  personId?: string;
  teamId?: string;
  configId?: string;
  checkId?: string;
  canaryId?: string;
  playbookId?: string;
  connectionId?: string;
  subject?: string;
  subject_type?: "playbook" | "team" | "person" | "notification" | "component";
};

function composeQueryParamForFetchPermissions({
  componentId,
  personId,
  teamId,
  configId,
  checkId,
  canaryId,
  playbookId,
  connectionId,
  subject,
  subject_type
}: FetchPermissionsInput) {
  if (componentId) {
    return `component_id=eq.${componentId}`;
  }
  if (personId) {
    return `person_id=eq.${personId}`;
  }
  if (teamId) {
    return `team_id=eq.${teamId}`;
  }
  if (configId) {
    return `config_id=eq.${configId}`;
  }
  if (checkId) {
    return `check_id=eq.${checkId}`;
  }
  if (canaryId) {
    return `canary_id=eq.${canaryId}`;
  }
  if (playbookId) {
    return `playbook_id=eq.${playbookId}`;
  }
  if (connectionId) {
    return `connection_id=eq.${connectionId}`;
  }
  if (subject) {
    return `subject=eq.${subject}`;
  }
  if (subject_type) {
    return `subject_type=eq.${subject_type}`;
  }
  return "";
}

export function fetchPermissions(
  input: FetchPermissionsInput,
  pagination: {
    pageSize: number;
    pageIndex: number;
  }
) {
  const queryParam = composeQueryParamForFetchPermissions(input);
  const selectFields = ["*"];

  const { pageSize, pageIndex } = pagination;

  const url = `/permissions_summary?${queryParam}&select=${selectFields.join(",")}&deleted_at=is.null&limit=${pageSize}&offset=${pageIndex * pageSize}`;
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<PermissionsSummary[]>(url, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
}

export function addPermission(permission: PermissionTable) {
  return IncidentCommander.post<PermissionTable>("/permissions", permission);
}

export function updatePermission(permission: PermissionTable) {
  return IncidentCommander.patch<PermissionTable>(
    `/permissions?id=eq.${permission.id}`,
    permission
  );
}

export function deletePermission(id: string) {
  return IncidentCommander.delete(`/permissions?id=eq.${id}`);
}
