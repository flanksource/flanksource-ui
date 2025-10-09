export type ScopeResourceType =
  | "*"
  | "config"
  | "component"
  | "playbook"
  | "canary";

export type ScopeResourceSelector = {
  agent?: string;
  name?: string;
  tagSelector?: string;
};

export type ScopeTarget = {
  config?: ScopeResourceSelector;
  component?: ScopeResourceSelector;
  playbook?: ScopeResourceSelector;
  canary?: ScopeResourceSelector;
  global?: ScopeResourceSelector;
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
};

// For display in UI (with joined created_by info)
export type ScopeDisplay = ScopeDB & {
  created_by?: { id: string; email: string; name: string; avatar?: string };
};
