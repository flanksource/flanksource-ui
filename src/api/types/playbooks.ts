import { Agent, Avatar, CreatedAt } from "../traits";
import { ConfigItem } from "./configs";
import { HealthCheckSummary } from "./health";
import { Topology } from "./topology";
import { User } from "./users";

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

export interface PlaybookRunWithActions extends PlaybookRun {
  actions: PlaybookRunAction[];
}

export interface PlaybookRun extends CreatedAt, Avatar, Agent {
  id: string;
  playbook_id?: string;
  status: PlaybookRunStatus;
  start_time: string;
  scheduled_time?: string;
  end_time?: string;
  check_id?: string;
  config_id?: string;
  component_id?: string;
  parameters?: Record<string, unknown>;
  /* relationships */
  playbooks?: PlaybookSpec;
  component?: Pick<Topology, "id" | "name" | "icon">;
  check?: HealthCheckSummary;
  config?: Pick<ConfigItem, "id" | "name" | "type" | "config_class">;
}

export type PlaybookSpec = {
  id: string;
  name: string;
  created_by?: User;
  spec: any;
  source: "KubernetesCRD" | "ConfigFile" | "UI";
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type PlaybookParam = {
  name: string;
  label: string;
};

export type RunnablePlaybook = Omit<PlaybookSpec, "spec"> & {
  check_id?: string;
  config_id?: string;
  component_id?: string;
  parameters: PlaybookParam[];
};

export type NewPlaybookSpec = Omit<
  PlaybookSpec,
  "id" | "created_at" | "updated_at" | "deleted_at" | "created_by"
> & {
  created_by?: string;
};

export type UpdatePlaybookSpec = Omit<
  PlaybookSpec,
  "created_at" | "updated_at" | "deleted_at" | "created_by"
>;
