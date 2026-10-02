import { RbacStoredObject } from "./rbacResources";

// A reference to a Scope in the Role's (or RoleBinding's) namespace
export type ScopeReference = {
  scopeRef: string;
};

export type RoleRule = {
  name: string;
  description?: string;
  action: string;
  resource: ScopeReference;
  // Only playbook:run, playbook:approve and playbook:cancel take a target
  target?: ScopeReference;
  deny?: boolean;
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
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type RoleDisplay = Omit<RoleDB, "created_by"> & {
  created_by?: { id: string; email: string; name: string; avatar?: string };
};
