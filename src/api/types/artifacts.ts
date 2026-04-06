export type Artifact = {
  id: string;
  filename: string;
  path: string;
  content_type: string;
  checksum: string;
  size: number;
  playbook_run_action_id?: string;
  config_change_id?: string;
  connection_id?: string;
  created_at: string;
  // PostgREST embedded joins
  playbook_run_action?: { id: string; name: string; playbook_run_id: string };
  config_change?: { id: string; config_id: string; change_type: string };
};

export type ArtifactSummary = {
  content_type: string;
  storage: "inline" | "external";
  connection_id: string | null;
  connection_name: string | null;
  connection_type: string | null;
  total_count: number;
  total_size: number;
};
