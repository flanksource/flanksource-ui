import { User } from "@flanksource-ui/api/types/users";

type LogBackendsSource = "KubernetesCRD" | "ConfigFile";

export type LogBackends = {
  id: string;
  name: string;
  labels: Record<string, any>;
  spec: Record<string, any>;
  source: LogBackendsSource;
  created_by?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};
