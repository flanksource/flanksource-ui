export type ScopeResourceSelector = {
  id?: string;
  agent?: string;
  name?: string;
  namespace?: string;
  types?: string[];
  tagSelector?: string;
  labelSelector?: string;
};

export const scopeTargetLabels = {
  config: "Config",
  component: "Component",
  check: "Check",
  playbook: "Playbook",
  canary: "Canary",
  view: "View",
  connection: "Connection",
  scraper: "Scraper",
  application: "Application",
  notification: "Notification",
  notificationSilence: "Notification Silence",
  agent: "Agent",
  person: "Person",
  team: "Team",
  scope: "Scope",
  role: "Role",
  roleBinding: "Role Binding"
} as const;

export type ScopeTarget = {
  [K in keyof typeof scopeTargetLabels]?: ScopeResourceSelector;
};

export const wholeTypeScopeTargets: (keyof ScopeTarget)[] = [
  "application",
  "notification",
  "notificationSilence",
  "agent",
  "person",
  "team",
  "scope",
  "role",
  "roleBinding"
];

// Form-specific extensions for UI (includes additional fields for form editing)
export type ScopeResourceSelectorForm = ScopeResourceSelector & {
  tags?: Record<string, string>; // Object form of tagSelector for easier editing
  wildcard?: boolean; // Indicates "match all" mode
};

export type ScopeTargetForm = {
  [K in keyof ScopeTarget]?: ScopeResourceSelectorForm;
};

// Database model (from PostgREST)
export type ScopeDB = {
  id: string;
  name: string;
  namespace?: string;
  description?: string;
  targets: ScopeTarget[];
  source: "UI" | "KubernetesCRD";
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  created_by?: string;
  // Why the scope isn't in effect. Empty when it's valid.
  error?: string | null;
  error_reason?: string | null;
};

// The spec of a Scope, as sent to /api/rbac/scopes
export type ScopeSpec = {
  description?: string;
  targets: ScopeTarget[];
};

// For display in UI (with joined created_by info)
export type ScopeDisplay = ScopeDB & {
  created_by?: { id: string; email: string; name: string; avatar?: string };
};
