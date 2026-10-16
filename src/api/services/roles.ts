import { AVATAR_INFO } from "@flanksource-ui/constants";
import { IncidentCommander } from "../axios";
import {
  RBAC_ACCESS_TOKENS_NAMESPACE,
  RbacManifest
} from "../types/rbacResources";
import { RoleDB, RoleDisplay, RoleSpec } from "../types/roles";
import {
  createRbacObject,
  getRbacObject,
  updateRbacObject
} from "./rbacResources";

// Roles are read through PostgREST, which can join their author.
export async function getRoles(): Promise<RoleDisplay[]> {
  const response = await IncidentCommander.get<RoleDisplay[]>("/roles", {
    params: {
      select: `*,created_by(${AVATAR_INFO})`,
      deleted_at: "is.null",
      order: "namespace,name"
    }
  });
  return response.data;
}

// The API's view of a Role adds what PostgREST doesn't have: the bindings its rules don't apply through.
export async function getRoleReport(
  namespace: string,
  name: string
): Promise<RoleDB> {
  return getRbacObject<RoleDB>("roles", namespace, name);
}

// Roles are written through /api/rbac/roles, which validates them and refuses writes through /db.
export async function createRole(
  manifest: RbacManifest<RoleSpec>
): Promise<RoleDB> {
  return createRbacObject<RoleDB>("roles", manifest);
}

export async function updateRole(
  manifest: RbacManifest<RoleSpec>
): Promise<RoleDB> {
  return updateRbacObject<RoleDB>("roles", manifest);
}

// The bindings that grant a Role, in any namespace: a RoleBinding's role is a name in its own namespace,
// or namespace/name.
export async function getRoleBindingNamesForRole(
  namespace: string,
  role: string
): Promise<{ name: string; namespace: string }[]> {
  const response = await IncidentCommander.get<
    { name: string; namespace: string }[]
  >("/role_bindings", {
    params: {
      select: "name,namespace",
      or: `(and(namespace.eq."${namespace}",role.eq."${role}"),role.eq."${namespace}/${role}")`,
      deleted_at: "is.null",
      namespace: `neq.${RBAC_ACCESS_TOKENS_NAMESPACE}`,
      order: "namespace,name"
    }
  });
  return response.data;
}
