// Scopes, Roles and RoleBindings are managed through /api/rbac/<resource>, not /api/db:
// the backend validates them on write and refuses writes through PostgREST.

export const RBAC_API_VERSION = "mission-control.flanksource.com/v1";

// Objects created from the UI go to this namespace. References (scopeRef, role) only
// resolve within one namespace, so a Role and RoleBinding take the namespace of what they reference.
export const RBAC_DEFAULT_NAMESPACE = "default";

export type RbacResource = "scopes" | "roles" | "role-bindings";

export const rbacResourceKinds: Record<
  RbacResource,
  { kind: string; label: string }
> = {
  scopes: { kind: "Scope", label: "Scope" },
  roles: { kind: "Role", label: "Role" },
  "role-bindings": { kind: "RoleBinding", label: "Role Binding" }
};

// The fields every stored Scope, Role and RoleBinding has.
export type RbacStoredObject = {
  id: string;
  name: string;
  namespace?: string | null;
  source: string;
  // Why the object isn't in effect. Empty when it's valid.
  error?: string | null;
  // Machine readable reason for error, e.g. RowLevelSecurityRequired.
  error_reason?: string | null;
};

// The request body of the API: the same shape as the Kubernetes object.
export type RbacManifest<Spec> = {
  apiVersion: typeof RBAC_API_VERSION;
  kind: string;
  metadata: { name: string; namespace: string };
  spec: Spec;
};

export function toRbacManifest<Spec>(
  resource: RbacResource,
  metadata: { name: string; namespace?: string | null },
  spec: Spec
): RbacManifest<Spec> {
  return {
    apiVersion: RBAC_API_VERSION,
    kind: rbacResourceKinds[resource].kind,
    metadata: {
      name: metadata.name,
      namespace: metadata.namespace || RBAC_DEFAULT_NAMESPACE
    },
    spec
  };
}

/**
 * Returns why a stored object can't be changed or deleted from the UI, or
 * undefined when it can. New objects (undefined) can always be saved.
 */
export function getRbacReadOnlyReason(
  resource: RbacResource,
  obj?: Pick<RbacStoredObject, "source" | "namespace">
): string | undefined {
  if (!obj) {
    return undefined;
  }

  const label = rbacResourceKinds[resource].label.toLowerCase();

  // The API only changes objects created through it; others would be overwritten where they're defined.
  if (obj.source !== "UI") {
    if (obj.source === "KubernetesCRD") {
      return `This ${label} is managed by a Kubernetes CRD and can't be changed from the UI.`;
    }
    return `This ${label} is managed by ${obj.source || "an external source"} and can't be changed from the UI.`;
  }

  // The API addresses objects by namespace and name.
  if (!obj.namespace) {
    return `This ${label} has no namespace, so it can't be changed or deleted until it's moved to one.`;
  }

  return undefined;
}
