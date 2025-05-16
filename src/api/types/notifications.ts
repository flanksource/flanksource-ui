import { JobHistoryStatus } from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { ConfigItem } from "./configs";
import { HealthCheck } from "./health";
import { Topology } from "./topology";
import { Team, User } from "./users";
import { PlaybookRunStatus } from "./playbooks";

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
  playbook_id?: string;
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
  selectors?: string;
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
};

export type NotificationSendHistory = {
  id: string;
  notification_id: string;
  body?: string | undefined;
  status?:
    | "attempting_fallback"
    | "error"
    | "evaluating-waitfor"
    | "inhibited"
    | "pending_playbook_completion"
    | "pending_playbook_run"
    | "pending"
    | "repeat-interval"
    | "sent"
    | "silenced"
    | "skipped";
  count: number;
  first_observed: string;
  source_event: string;
  silenced_by?: string;
  resource_id: string;
  playbook_run_id?: string;
  person_id?: string | undefined;
  connection_id?: string | undefined;
  error?: string | undefined;
  duration_millis?: number | undefined;
  created_at: string;
  parent_id?: string;
  resource_health: "healthy" | "unhealthy" | "warning" | "unknown";
  resource_status: string;
  resource_health_description: string;
};

export type NotificationSendHistoryResource =
  | (Pick<HealthCheck, "id" | "name" | "type" | "status"> & {
      health: "healthy" | "unhealthy" | "warning" | "unknown";
    })
  | Pick<
      ConfigItem,
      "id" | "name" | "type" | "health" | "status" | "config_class"
    >
  | Pick<Topology, "id" | "name" | "type" | "icon" | "health" | "status">;

export type NotificationSendHistorySummary = {
  resource?: NotificationSendHistoryResource; // resource can be null when the resource is deleted, but the notification history is still present
  resource_health: "healthy" | "unhealthy" | "warning" | "unknown";
  resource_status: string;
  resource_health_description: string;
  notification_id: string;
  created_at: string;
  resource_type: "component" | "config" | "check";
  first_observed: string;
  last_seen: string;
  total: number;
  sent: number;
  error: number;
  suppressed: number;
};

export type NotificationSendHistoryApiResponse = NotificationSendHistory & {
  resource_type: "component" | "config" | "check";
  resource_health: "healthy" | "unhealthy" | "warning" | "unknown";
  resource_status: string;
  playbook_run: {
    id: string;
    status: PlaybookRunStatus;
    playbook_name: string;
    playbook_id: string;
  };
  resource: NotificationSendHistoryResource;
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
