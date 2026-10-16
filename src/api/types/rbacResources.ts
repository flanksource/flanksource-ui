// Scopes, Roles and RoleBindings are managed through /api/rbac/<resource>, not /api/db:
// the backend validates them on write and refuses writes through PostgREST.

export const RBAC_API_VERSION = "mission-control.flanksource.com/v1";

// Objects created from the UI go to this namespace unless another one is chosen.
export const RBAC_DEFAULT_NAMESPACE = "default";

// Mission Control owns this namespace: it holds the shipped Scopes, Roles and RoleBindings,
// and the API refuses every write in it.
export const RBAC_SHIPPED_NAMESPACE = "mission-control-builtin";

// Mission Control owns this namespace too: it holds access tokens' role bindings, which only limit their token,
// so they're never listed with the others.
export const RBAC_ACCESS_TOKENS_NAMESPACE = "mission-control-access-tokens";

const dnsLabel = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
const dnsSubdomain =
  /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;

// Why a namespace can't hold a new Scope, Role or RoleBinding, or undefined when it can.
export function validateRbacNamespace(namespace?: string): string | undefined {
  if (!namespace) {
    return "Namespace is required";
  }
  if (namespace.length > 63 || !dnsLabel.test(namespace)) {
    return "Use lowercase letters, numbers and '-', starting and ending with a letter or number";
  }
  if (namespace === RBAC_SHIPPED_NAMESPACE) {
    return `${RBAC_SHIPPED_NAMESPACE} is reserved for what ships with Mission Control`;
  }
  return undefined;
}

export type RbacObjectRef = { namespace: string; name: string };

// A reference to a Scope (scopeRef) or Role (a binding's role) is `name`, in the namespace of the
// object it's written in, or `namespace/name`. Returns undefined when it's malformed.
export function parseRbacReference(
  namespace: string,
  ref: string
): RbacObjectRef | undefined {
  const parts = ref.split("/");
  const [refNamespace, name] =
    parts.length === 1 ? [namespace, parts[0]] : parts;
  if (
    parts.length > 2 ||
    !dnsLabel.test(refNamespace) ||
    !name ||
    name.length > 253 ||
    !dnsSubdomain.test(name)
  ) {
    return undefined;
  }
  return { namespace: refNamespace, name };
}

export function qualifiedRbacReference({ namespace, name }: RbacObjectRef) {
  return `${namespace}/${name}`;
}

// The reference to write in an object in `namespace`: the bare name when the target is in the same namespace.
// A malformed reference is returned as is, for the API to reject.
export function relativeRbacReference(namespace: string, ref: string): string {
  const target = parseRbacReference(namespace, ref);
  if (!target) {
    return ref;
  }
  return target.namespace === namespace
    ? target.name
    : qualifiedRbacReference(target);
}

// The `namespace/name` form of a reference written in an object in `namespace`, so it keeps naming the same
// object whatever namespace the form ends up saving in. A malformed reference is returned as is.
export function absoluteRbacReference(namespace: string, ref: string): string {
  const target = parseRbacReference(namespace, ref);
  return target ? qualifiedRbacReference(target) : ref;
}

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

  if (obj.namespace === RBAC_SHIPPED_NAMESPACE) {
    return `This ${label} ships with Mission Control and can't be changed.`;
  }

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
