import { RbacStoredObject } from "./rbacResources";
import { ScopeReference } from "./roles";

// Selects resources acting on their own, e.g. a playbook calling Mission Control.
// name is an exact value or "*"; namespace is an exact value, omitted to match any namespace.
export type RoleBindingResourceSubject = {
  namespace?: string;
  name?: string;
};

// Users of an ExternalIdentityProvider whose token claims match a CEL expression
export type RoleBindingOIDCSubject = {
  provider: string;
  match: string;
};

export const roleBindingResourceSubjectKinds = [
  "playbooks",
  "notifications",
  "topologies",
  "scrapers",
  "canaries"
] as const;

export type RoleBindingResourceSubjectKind =
  (typeof roleBindingResourceSubjectKinds)[number];

// The built-in roles a binding can select subjects by
export const bindableBuiltInRoles = ["everyone", "guest", "agent"] as const;

export type RoleBindingSubjects = {
  // Emails of Mission Control users
  people?: string[];
  // Team names
  teams?: string[];
  roles?: string[];
  oidc?: RoleBindingOIDCSubject[];
} & Partial<
  Record<RoleBindingResourceSubjectKind, RoleBindingResourceSubject[]>
>;

// Narrows every allow rule of the Role for the binding's subjects, one side at a time:
// an operation's resource (or target) must also be in the constraint's Scope.
// At least one of resource and target is set. Deny rules are never narrowed.
export type RoleBindingConstraint = {
  resource?: ScopeReference;
  target?: ScopeReference;
};

// The spec of a RoleBinding, as sent to /api/rbac/role-bindings
export type RoleBindingSpec = {
  description?: string;
  role: string;
  subjects: RoleBindingSubjects;
  // Without a constraint, the binding grants the Role's rules as written
  constraint?: RoleBindingConstraint;
};

// Database model (from PostgREST)
export type RoleBindingDB = RbacStoredObject & {
  description?: string;
  role: string;
  subjects: RoleBindingSubjects;
  constraint?: RoleBindingConstraint | null;
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type RoleBindingDisplay = Omit<RoleBindingDB, "created_by"> & {
  created_by?: { id: string; email: string; name: string; avatar?: string };
};
