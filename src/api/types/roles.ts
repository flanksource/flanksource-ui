import { RbacStoredObject } from "./rbacResources";

// A reference to a Scope in the Role's (or RoleBinding's) namespace
export type ScopeReference = {
  scopeRef: string;
};

export type RoleRule = {
  name: string;
  description?: string;
  action: string;
  // Omitted for the actions that take no resource, e.g. person:manage
  resource?: ScopeReference;
  // Only playbook:run, playbook:approve and playbook:cancel take a target
  target?: ScopeReference;
  // Only on roles stored before deny was rejected: rules only allow, and the UI never sends it
  deny?: boolean;
};

// A RoleBinding whose constraint can't narrow some of the role's rules, so they don't apply through it
export type RoleBindingUnappliedRules = {
  name: string;
  rules: string[];
};

// The spec of a Role, as sent to /api/rbac/roles
export type RoleSpec = {
  description?: string;
  rules: RoleRule[];
};

// Database model (from PostgREST)
export type RoleDB = RbacStoredObject & {
  description?: string;
  rules: RoleRule[];
  // Only in responses of /api/rbac/roles, not from PostgREST
  bindings_with_unapplied_rules?: RoleBindingUnappliedRules[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type RoleDisplay = Omit<RoleDB, "created_by"> & {
  created_by?: { id: string; email: string; name: string; avatar?: string };
};
