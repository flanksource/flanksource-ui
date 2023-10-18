import { ConfigItem } from "../../../api/services/configs";
import { User } from "../../../api/services/users";
import { Topology } from "../../../context/TopologyPageContext";
import { HealthCheck } from "../../../types/healthChecks";
import { PlaybookSpec } from "../Settings/PlaybookSpecsTable";

export type PlaybookRunStatus =
  | "scheduled"
  | "running"
  | "cancelled"
  | "completed"
  | "failed"
  | "pending";

export type PlaybookRunAction = {
  id: string;
  name: string;
  status: PlaybookRunStatus;
  playbook_run_id: string;
  start_time: string;
  scheduled_time?: string;
  end_time?: string;
  result?: {
    stdout?: string;
    logs?: string;
    [key: string]: unknown;
  };
  error?: string;
};

export type PlaybookRun = {
  id: string;
  playbook_id?: string;
  status: PlaybookRunStatus;
  start_time: string;
  scheduled_time?: string;
  end_time?: string;
  created_at?: string;
  created_by?: User;
  check_id?: string;
  config_id?: string;
  component_id?: string;
  parameters?: Record<string, unknown>;
  agent_id?: string;
  /* relationships */
  playbooks?: PlaybookSpec;
  component?: Pick<Topology, "id" | "name" | "icon">;
  check?: Pick<HealthCheck, "id" | "name" | "icon">;
  config?: Pick<ConfigItem, "id" | "name" | "type" | "config_class">;
};
