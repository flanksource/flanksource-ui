import { AVATAR_INFO } from "@flanksource-ui/constants";
import { IncidentCommander } from "../axios";
import { RbacManifest } from "../types/rbacResources";
import {
  RoleBindingDB,
  RoleBindingDisplay,
  RoleBindingSpec
} from "../types/roleBindings";
import { createRbacObject, updateRbacObject } from "./rbacResources";

// Role bindings are read through PostgREST, which can join their author.
export async function getRoleBindings(): Promise<RoleBindingDisplay[]> {
  const response = await IncidentCommander.get<RoleBindingDisplay[]>(
    "/role_bindings",
    {
      params: {
        select: `*,created_by(${AVATAR_INFO})`,
        deleted_at: "is.null",
        order: "namespace,name"
      }
    }
  );
  return response.data;
}

// Role bindings are written through /api/rbac/role-bindings, which validates them and refuses writes through /db.
export async function createRoleBinding(
  manifest: RbacManifest<RoleBindingSpec>
): Promise<RoleBindingDB> {
  return createRbacObject<RoleBindingDB>("role-bindings", manifest);
}

export async function updateRoleBinding(
  manifest: RbacManifest<RoleBindingSpec>
): Promise<RoleBindingDB> {
  return updateRbacObject<RoleBindingDB>("role-bindings", manifest);
}
