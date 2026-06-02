import { apiBase, IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { PermissionsSummary, PermissionTable } from "../types/permissions";
import { AVATAR_INFO } from "@flanksource-ui/constants";
import { tristateOutputToQueryParamValue } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";

export type FetchPermissionsInput = {
  componentId?: string;
  personId?: string;
  teamId?: string;
  configId?: string;
  checkId?: string;
  canaryId?: string;
  playbookId?: string;
  playbookName?: string;
  playbookNamespace?: string;
  connectionId?: string;
  subject?: string;
  action?: string;
  direction?: "inbound" | "outbound";
  subject_type?:
    | "playbook"
    | "team"
    | "person"
    | "notification"
    | "component"
    | "role"
    | "playbook"
    | "plugin"
    | "access_token_person";
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
  action,
  subject_type
}: FetchPermissionsInput) {
  const filters: string[] = [];

  if (componentId) {
    filters.push(`component_id=eq.${componentId}`);
  }
  if (personId) {
    filters.push(`person_id=eq.${personId}`);
  }
  if (teamId) {
    filters.push(`team_id=eq.${teamId}`);
  }
  if (configId) {
    filters.push(`config_id=eq.${configId}`);
  }
  if (checkId) {
    filters.push(`check_id=eq.${checkId}`);
  }
  if (canaryId) {
    filters.push(`canary_id=eq.${canaryId}`);
  }
  if (playbookId) {
    filters.push(`playbook_id=eq.${playbookId}`);
  }
  if (connectionId) {
    filters.push(`connection_id=eq.${connectionId}`);
  }
  if (subject) {
    filters.push(`subject=eq.${subject}`);
  }
  if (action) {
    const actionFilter = tristateOutputToQueryParamValue(action, true);
    if (actionFilter && action.includes(":")) {
      filters.push(`action.filter=${actionFilter}`);
    } else {
      filters.push(`action=eq.${action}`);
    }
  }
  if (subject_type) {
    filters.push(`subject_type=eq.${subject_type}`);
  }

  return filters.join("&");
}

export function fetchPermissions(
  input: FetchPermissionsInput,
  options: {
    pageSize: number;
    pageIndex: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) {
  const queryParam = composeQueryParamForFetchPermissions(input);
  const selectFields = `*,created_by(${AVATAR_INFO})`;

  const { pageSize, pageIndex, sortBy, sortOrder } = options;
  const sortParams = sortBy ? `&order=${sortBy}.${sortOrder ?? "asc"}` : "";

  const isInboundPlaybookSelectorQuery =
    input.direction === "inbound" && !!input.playbookName;

  const url = isInboundPlaybookSelectorQuery
    ? (() => {
        const params = new URLSearchParams({
          p_field: "playbooks",
          p_name: input.playbookName!
        });
        if (input.playbookNamespace) {
          params.set("p_namespace", input.playbookNamespace);
        }
        return `/rpc/permissions_for_obj_selector?${params.toString()}&select=${selectFields}&limit=${pageSize}&offset=${pageIndex * pageSize}${sortParams}`;
      })()
    : `/permissions_summary?${queryParam}&select=${selectFields}&deleted_at=is.null&limit=${pageSize}&offset=${pageIndex * pageSize}${sortParams}`;

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

export async function fetchPermissionById(id: string) {
  const response = await IncidentCommander.get<PermissionTable[]>(
    `/permissions?id=eq.${id}`
  );
  return response.data[0];
}

/**
 * Re-checks/re-validates a permission by clearing its error field.
 * The backend will re-evaluate the permission and set a new error if validation fails.
 */
export function recheckPermission(id: string) {
  return IncidentCommander.patch<PermissionTable>(`/permissions?id=eq.${id}`, {
    error: null
  });
}

// Source marker used by settings UIs for permissions they create/manage.
export const INTERACTIVE_SETTINGS_PERMISSION_SOURCE =
  "interactive_settings" as const;

export function isSettingsManagedPermissionSource(source?: string | null) {
  return source === INTERACTIVE_SETTINGS_PERMISSION_SOURCE;
}

export async function fetchSettingsManagedSubjectPermissions(
  subjectId: string
) {
  const response = await IncidentCommander.get<PermissionsSummary[] | null>(
    `/permissions_summary?select=*&subject=eq.${subjectId}&source=eq.${INTERACTIVE_SETTINGS_PERMISSION_SOURCE}&deleted_at=is.null&limit=5000`
  );

  return response.data ?? [];
}

export async function fetchMcpRunPermissions() {
  const response = await IncidentCommander.get<PermissionsSummary[] | null>(
    `/permissions_summary?select=*&action=eq.mcp:run&source=eq.${INTERACTIVE_SETTINGS_PERMISSION_SOURCE}&deleted_at=is.null&limit=5000`
  );

  return response.data ?? [];
}

export async function fetchMcpUserPermissions() {
  const response = await IncidentCommander.get<PermissionsSummary[] | null>(
    `/permissions_summary?select=*&action=eq.mcp:use&object=eq.mcp&source=eq.${INTERACTIVE_SETTINGS_PERMISSION_SOURCE}&deleted_at=is.null&limit=5000`
  );

  return response.data ?? [];
}

export type PermissionSubject = {
  id: string;
  name: string;
  type:
    | "team"
    | "permission_subject_group"
    | "person"
    | "role"
    | "playbook"
    | "plugin"
    | "access_token_person";
  owner?: string | null;
  icon?: string | null;
};

export async function fetchPermissionSubjectsPaginated({
  search = "",
  pageIndex = 0,
  pageSize = 20
}: {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}) {
  const query = search.trim();

  let url =
    "/permission_subjects?select=id,name,type,owner,icon&order=name.asc";
  url += `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  if (query) {
    url += `&name=ilike.*${encodeURIComponent(query)}*`;
  }

  return resolvePostGrestRequestWithPagination<PermissionSubject[]>(
    IncidentCommander.get(url, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
}

export async function fetchPermissionSubjectsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }
  const response = await IncidentCommander.get<PermissionSubject[] | null>(
    `/permission_subjects?select=id,name,type,owner,icon&id=in.(${ids.join(",")})&limit=${ids.length}`
  );
  return response.data ?? [];
}

export type PluginPermissionSubject = {
  id?: string;
  name?: string;
  type?: string;
  icon?: string | null;
};

type PluginSubjectResponse =
  | PluginPermissionSubject[]
  | { plugins?: PluginPermissionSubject[]; data?: PluginPermissionSubject[] };

export async function fetchPluginPermissionSubjects(): Promise<
  PermissionSubject[]
> {
  const response = await apiBase.get<PluginSubjectResponse>("/plugins");
  const plugins = Array.isArray(response.data)
    ? response.data
    : (response.data.plugins ?? response.data.data ?? []);

  return plugins
    .map((plugin): PermissionSubject | null => {
      const id = plugin.id ?? plugin.name;
      const name = plugin.name ?? plugin.id;

      if (!id || !name) {
        return null;
      }

      return {
        id,
        name,
        type: "plugin" as const,
        owner: null,
        icon: plugin.icon ?? null
      };
    })
    .filter((subject): subject is PermissionSubject => subject !== null);
}

async function fetchPermissionSubjectsWithOrder(order: string) {
  const [response, plugins] = await Promise.all([
    IncidentCommander.get<PermissionSubject[] | null>(
      `/permission_subjects?select=id,name,type,owner,icon&order=${order}&limit=5000`
    ),
    fetchPluginPermissionSubjects()
  ]);

  return [...(response.data ?? []), ...plugins];
}

export async function fetchPermissionSubjects() {
  const subjects = await fetchPermissionSubjectsWithOrder("name.asc");
  return subjects.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

export async function fetchAllPermissionSubjects() {
  const subjects = await fetchPermissionSubjectsWithOrder("type.asc,name.asc");
  return subjects.sort((a, b) => {
    const typeDiff = a.type.localeCompare(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}
