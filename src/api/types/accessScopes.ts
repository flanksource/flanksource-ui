export type AccessScopeSubject = {
  person?: string; // email
  team?: string; // team name
};

export type AccessScopeScope = {
  tags?: Record<string, string>;
  agents?: string[];
  names?: string[];
};

export type AccessScopeSpec = {
  description?: string;
  subject: AccessScopeSubject;
  resources: string[];
  scopes: AccessScopeScope[];
};

// Database model (from PostgREST)
export type AccessScopeDB = {
  id: string;
  name: string;
  namespace?: string;
  description?: string;
  person_id?: string;
  team_id?: string;
  resources: string[];
  scopes: AccessScopeScope[]; // stored as JSONB
  source: "UI" | "KubernetesCRD";
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

// For display in UI (with joined person/team info)
export type AccessScopeDisplay = AccessScopeDB & {
  person?: { id: string; email: string; name: string };
  team?: { id: string; name: string };
};
