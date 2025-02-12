import { JobHistoryStatus } from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { ConfigItem } from "./configs";
import { HealthCheck } from "./health";
import { Topology } from "./topology";
import { Team, User } from "./users";

export type NotificationRules = {
  id: string;
  namespace?: string;
  name: string;
  title?: string;
  events: string[];
  source?: "KubernetesCRD" | "ConfigFile" | "UI" | "Topology";
  template: string;
  filter?: string;
  properties?: Record<string, any>;
  person_id?: string;
  team_id?: string;
  custom_services?: {
    name: string;
    filters?: string;
    url?: string;
    connection?: string;
    properties?: Record<string, any>;
  }[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  person?: User;
  team?: Team;
  job_status?: JobHistoryStatus;
  job_name?: string;
  job_details?: {
    errors?: string[];
  };
  pending?: number;
  avg_duration_ms?: number;
  failed?: number;
  sent?: number;
  most_common_error?: string;
  repeat_interval?: string;
  error?: string;
  wait_for?: number;
};

export type SilenceNotificationResponse = {
  id: string;
  name: string;
  filter?: string;
  component_id?: string;
  config_id?: string;
  check_id?: string;
  canary_id?: string;
  from: string;
  until: string | null;
  description?: string;
  recursive?: boolean;
  namespace?: string;
  error?: string;
  source?: "KubernetesCRD" | "UI";
  parent_config?: string;
};

export type NotificationSendHistory = {
  id: string;
  notification_id: string;
  body?: string | undefined;
  status?: string | null;
  count: number;
  first_observed: string;
  source_event: string;
  resource_id: string;
  playbook_run_id?: string;
  person_id?: string | undefined;
  error?: string | undefined;
  duration_millis?: number | undefined;
  created_at: string;
};

export type NotificationSendHistoryApiResponse = NotificationSendHistory & {
  resource_type: "component" | "config" | "check" | "canary";
  resource:
    | Pick<HealthCheck, "id" | "name" | "type" | "status">
    | Pick<ConfigItem, "id" | "name" | "type" | "config_class">
    | Pick<Topology, "id" | "name" | "icon">;
  person: User;
};

export type NotificationSilenceItem = {
  id: string;
  name: string;
  namespace: string;
  description?: string;
  filter?: string;
  error?: string;
  from: string;
  until: string | null;
  recursive?: boolean;
  config_id?: string;
  check_id?: string;
  canary_id?: string;
  component_id?: string;
  source?: "KubernetesCRD" | "UI";
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type NotificationSilenceItemApiResponse = NotificationSilenceItem & {
  checks: Pick<HealthCheck, "id" | "name" | "type" | "status">;
  catalog: Pick<ConfigItem, "id" | "name" | "type" | "config_class">;
  component: Pick<Topology, "id" | "name" | "icon">;
  createdBy: User;
};
