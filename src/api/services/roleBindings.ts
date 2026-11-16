import { AVATAR_INFO } from "@flanksource-ui/constants";
import { IncidentCommander } from "../axios";
import {
  RBAC_ACCESS_TOKENS_NAMESPACE,
  RbacManifest
} from "../types/rbacResources";
import {
  RoleBindingDB,
  RoleBindingDisplay,
  RoleBindingNamedSubject,
  RoleBindingSpec
} from "../types/roleBindings";
import { createRbacObject, updateRbacObject } from "./rbacResources";

// Role bindings are read through PostgREST, which can join their author.
// With a subject, only the bindings whose subjects list it, by JSON containment on subjects.
export async function getRoleBindings(
  subject?: RoleBindingNamedSubject
): Promise<RoleBindingDisplay[]> {
  const response = await IncidentCommander.get<RoleBindingDisplay[]>(
    "/role_bindings",
    {
      params: {
        select: `*,created_by(${AVATAR_INFO})`,
        deleted_at: "is.null",
        namespace: `neq.${RBAC_ACCESS_TOKENS_NAMESPACE}`,
        ...(subject
          ? {
              subjects: `cs.${JSON.stringify({ [subject.field]: [subject.name] })}`
            }
          : {}),
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
