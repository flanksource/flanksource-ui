import { AVATAR_INFO } from "@flanksource-ui/constants";
import { IncidentCommander } from "../axios";
import { RbacManifest } from "../types/rbacResources";
import { RoleDB, RoleDisplay, RoleSpec } from "../types/roles";
import { createRbacObject, updateRbacObject } from "./rbacResources";

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

// The bindings that grant a Role: a RoleBinding's role names a Role in its own namespace.
export async function getRoleBindingNamesForRole(
  namespace: string,
  role: string
): Promise<{ name: string; namespace: string }[]> {
  const response = await IncidentCommander.get<
    { name: string; namespace: string }[]
  >("/role_bindings", {
    params: {
      select: "name,namespace",
      namespace: `eq.${namespace}`,
      role: `eq.${role}`,
      deleted_at: "is.null",
      order: "name"
    }
  });
  return response.data;
}
