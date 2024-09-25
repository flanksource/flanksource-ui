import { AVATAR_INFO } from "@flanksource-ui/constants";
import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { PermissionAPIResponse, PermissionTable } from "../types/permissions";

export type FetchPermissionsInput = {
  componentId?: string;
  personId?: string;
  teamId?: string;
  configId?: string;
  checkId?: string;
  canaryId?: string;
  playbookId?: string;
  connectionId?: string;
};

function composeQueryParamForFetchPermissions({
  componentId,
  personId,
  teamId,
  configId,
  checkId,
  canaryId,
  playbookId,
  connectionId
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
  const selectFields = [
    "*",
    // "checks:check_id(id, name, status, type)",
    "catalog:config_id(id, name, type, config_class)",
    "component:component_id(id, name, icon)",
    "canary:canary_id(id, name)",
    "playbook:playbook_id(id, title, name, icon)",
    "team:team_id(id, name, icon)",
    `person:person_id(${AVATAR_INFO})`,
    `createdBy:created_by(${AVATAR_INFO})`,
    `connection:connection_id(id,name,type)`
  ];

  const { pageSize, pageIndex } = pagination;

  const url = `/permissions?${queryParam}&select=${selectFields.join(",")}&limit=${pageSize}&offset=${pageIndex * pageSize}`;
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<PermissionAPIResponse[]>(url)
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
  return IncidentCommander.patch(`/permissions?id=eq.${id}`, {
    deleted_at: "now()"
  });
}
